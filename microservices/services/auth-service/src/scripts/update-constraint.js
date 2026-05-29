import 'dotenv/config';
import { getSequelize } from '@kissan/shared';

async function run() {
  const sequelize = await getSequelize();
  try {
    await sequelize.query(`
      ALTER TABLE admin_users DROP CONSTRAINT admin_users_role_check;
    `);
    console.log('✅ Dropped old constraint');
    
    await sequelize.query(`
      ALTER TABLE admin_users ADD CONSTRAINT admin_users_role_check 
      CHECK (role IN (
        'super_admin', 'admin', 'tech_admin', 'agri_expert', 
        'ecommerce_manager', 'order_manager', 'support_agent', 
        'support_manager', 'content_manager', 'finance_manager', 
        'field_agent', 'field_officer'
      ));
    `);
    console.log('✅ Added new constraint with all 12 admin roles');
  } catch (err) {
    console.error('Error updating constraint:', err);
  }
  process.exit(0);
}
run();
