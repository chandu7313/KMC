import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { models, getSequelize } from '@kissan/shared';
// auth-service uses env config for rounds
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12', 10);

const { AdminUser, User } = models;

const devAccounts = [
  { role: 'field_officer', name: 'Field Officer', email: 'fieldofficer@dev.kissanmithar.com', password: 'Dev@FieldOfficer123', type: 'admin' },
  { role: 'super_admin', name: 'Super Admin', email: 'superadmin@dev.kissanmithar.com', password: 'Dev@SuperAdmin123', type: 'admin' },
  { role: 'admin', name: 'Admin', email: 'admin@dev.kissanmithar.com', password: 'Dev@Admin123', type: 'admin' },
  { role: 'tech_admin', name: 'Tech Admin', email: 'techadmin@dev.kissanmithar.com', password: 'Dev@TechAdmin123', type: 'admin' },
  { role: 'agri_expert', name: 'Agri Expert', email: 'agriexpert@dev.kissanmithar.com', password: 'Dev@AgriExpert123', type: 'admin' },
  { role: 'ecommerce_manager', name: 'E-commerce Manager', email: 'ecommerce@dev.kissanmithar.com', password: 'Dev@Ecommerce123', type: 'admin' },
  { role: 'order_manager', name: 'Order Manager', email: 'orders@dev.kissanmithar.com', password: 'Dev@Orders123', type: 'admin' },
  { role: 'support_agent', name: 'Support Agent', email: 'supportagent@dev.kissanmithar.com', password: 'Dev@SupportAgent123', type: 'admin' },
  { role: 'support_manager', name: 'Support Manager', email: 'supportmanager@dev.kissanmithar.com', password: 'Dev@SupportManager123', type: 'admin' },
  { role: 'content_manager', name: 'Content Manager', email: 'content@dev.kissanmithar.com', password: 'Dev@Content123', type: 'admin' },
  { role: 'finance_manager', name: 'Finance Manager', email: 'finance@dev.kissanmithar.com', password: 'Dev@Finance123', type: 'admin' },
  { role: 'field_agent', name: 'Field Agent', email: 'fieldagent@dev.kissanmithar.com', password: 'Dev@FieldAgent123', type: 'admin' },
  { role: 'farmer', name: 'Test Farmer', email: 'farmer@dev.kissanmithar.com', password: 'Dev@Farmer123', phone: '9876543210', type: 'user' },
];

const seedDevAccounts = async () => {
  try {
    console.log('🔌 Connecting to Database...');
    await getSequelize();

    console.log('\n🌱 Seeding KMC Dev Accounts...\n');

    for (const account of devAccounts) {
      if (account.type === 'admin') {
        const existing = await AdminUser.findOne({ where: { email: account.email } });
        if (existing) {
          console.log(`  ⏭  ${account.role.padEnd(20)} — already exists`);
          continue;
        }

        const hashedPassword = await bcrypt.hash(account.password, BCRYPT_ROUNDS);
        await AdminUser.create({
          name: account.name,
          email: account.email,
          password: hashedPassword,
          role: account.role,
          status: 'online',
          isActive: true,
          languagesSpoken: ['en', 'hi'],
        });
        console.log(`  ✅ ${account.role.padEnd(20)} — created (${account.email})`);
      } else if (account.type === 'user') {
        const existing = await User.findOne({ where: { phone: account.phone } });
        if (existing) {
          console.log(`  ⏭  ${account.role.padEnd(20)} — already exists`);
          continue;
        }

        const hashedPassword = await bcrypt.hash(account.password, BCRYPT_ROUNDS);
        await User.create({
          name: account.name,
          email: account.email,
          phone: account.phone,
          password: hashedPassword,
          role: 'user', // base role for farmers in User model
          isAccountVerified: true,
          district: 'Nizamabad',
          crops: ['Wheat', 'Cotton'],
        });
        console.log(`  ✅ ${account.role.padEnd(20)} — created (${account.phone})`);
      }
    }

    console.log('\n🎉 All dev accounts seeded successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDevAccounts();
