import cron from 'node-cron';
import supabase from './supabase.js';
import { syncMandiData } from '../services/marketSyncService.js';

const startCronJobs = () => {
    // Run every day at 10:00 AM
    cron.schedule('0 10 * * *', async () => {
        try {
            console.log('--- Starting Soil Reminder Check ---');
            const today = new Date().toISOString();

            const { data: upcomingReminders, error } = await supabase
                .from('soil_reminders')
                .select('*, users:user_id(name, phone, email)')
                .lte('reminder_date', today)
                .eq('is_sent', false);

            if (error) throw error;

            for (const reminder of (upcomingReminders || [])) {
                console.log(`Sending alert to: ${reminder.users?.name} (${reminder.users?.phone})`);

                // Placeholder for real SMS/WhatsApp notification logic
                // await notifyUser(reminder.users.phone, "KMC Health Alert: Your soil test is due this week.");

                await supabase
                    .from('soil_reminders')
                    .update({ is_sent: true })
                    .eq('id', reminder.id);
            }
            console.log(`--- Finished: ${(upcomingReminders || []).length} notifications sent ---`);
        } catch (error) {
            console.error('Error in soil reminder cron:', error);
        }
    });

    // Run every 4 hours for price alerts
    cron.schedule('0 */4 * * *', async () => {
        try {
            console.log('--- Checking Price Alerts ---');
            const { data: activeAlerts, error } = await supabase
                .from('price_alerts')
                .select('*, users:user_id(name, email, phone)')
                .eq('status', 'Active');

            if (error) throw error;

            for (const alert of (activeAlerts || [])) {
                const { data: currentPrice } = await supabase
                    .from('market_prices')
                    .select('modal_price')
                    .eq('crop_name', alert.crop)
                    .order('arrival_date', { ascending: false })
                    .limit(1)
                    .single();

                if (!currentPrice) continue;

                let triggered = false;
                if (alert.condition === 'Above' && currentPrice.modal_price >= alert.target_price) triggered = true;
                if (alert.condition === 'Below' && currentPrice.modal_price <= alert.target_price) triggered = true;

                if (triggered) {
                    console.log(`Alert Triggered for ${alert.users?.name}: ${alert.crop} hit ₹${currentPrice.modal_price}`);
                    // Placeholder for real notification
                    // await notifyUser(alert.users.phone, `KMC Price Alert: ${alert.crop} is now ₹${currentPrice.modal_price}, which is ${alert.condition} your target.`);

                    await supabase
                        .from('price_alerts')
                        .update({
                            status: 'Triggered',
                            last_notified: new Date().toISOString()
                        })
                        .eq('id', alert.id);
                }
            }
        } catch (error) {
            console.error('Error in price alert cron:', error);
        }
    });

    // Run every 1 hour for Mandi Data Sync
    cron.schedule('0 * * * *', async () => {
        try {
            console.log('--- Hourly Mandi Sync Started ---');
            const result = await syncMandiData();
            console.log(`--- Sync Result: ${result.success ? 'Success' : 'Failed'} - ${result.message} ---`);
        } catch (error) {
            console.error('Error in Mandi Sync cron:', error);
        }
    });
};

export default startCronJobs;
