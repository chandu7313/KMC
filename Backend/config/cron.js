import cron from 'node-cron';
import SoilReminder from '../models/SoilReminder.js';
import PriceAlert from '../models/priceAlertModel.js';
import MarketPrice from '../models/MarketPrice.js';
import { syncMandiData } from '../services/marketSyncService.js';

const startCronJobs = () => {
    // Run every day at 10:00 AM
    cron.schedule('0 10 * * *', async () => {
        try {
            console.log('--- Starting Soil Reminder Check ---');
            const today = new Date();
            const upcomingReminders = await SoilReminder.find({
                reminderDate: { $lte: today },
                isSent: false
            }).populate('user', 'name phone email');

            for (const reminder of upcomingReminders) {
                console.log(`Sending alert to: ${reminder.user?.name} (${reminder.user?.phone})`);

                // Placeholder for real SMS/WhatsApp notification logic
                // await notifyUser(reminder.user.phone, "KMC Health Alert: Your soil test is due this week.");

                reminder.isSent = true;
                await reminder.save();
            }
            console.log(`--- Finished: ${upcomingReminders.length} notifications sent ---`);
        } catch (error) {
            console.error('Error in soil reminder cron:', error);
        }
    });

    // Run every 4 hours for price alerts
    cron.schedule('0 */4 * * *', async () => {
        try {
            console.log('--- Checking Price Alerts ---');
            const activeAlerts = await PriceAlert.find({ status: 'Active' }).populate('userId', 'name email phone');

            for (const alert of activeAlerts) {
                const currentPrice = await MarketPrice.findOne({ cropName: alert.crop });
                if (!currentPrice) continue;

                let triggered = false;
                if (alert.condition === 'Above' && currentPrice.modalPrice >= alert.targetPrice) triggered = true;
                if (alert.condition === 'Below' && currentPrice.modalPrice <= alert.targetPrice) triggered = true;

                if (triggered) {
                    console.log(`Alert Triggered for ${alert.userId?.name}: ${alert.crop} hit ₹${currentPrice.modalPrice}`);
                    // Placeholder for real notification
                    // await notifyUser(alert.userId.phone, `KMC Price Alert: ${alert.crop} is now ₹${currentPrice.modalPrice}, which is ${alert.condition} your target.`);

                    alert.status = 'Triggered';
                    alert.lastNotified = new Date();
                    await alert.save();
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
