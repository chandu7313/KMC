import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { sequelize, connectDB } from './config/database.js';
import { AdminUser } from './models/index.js';

const devAccounts = [
    {
        name: "Super Admin",
        email: "superadmin@dev.kissanmithar.com",
        password: "dev@SuperAdmin123",
        role: "super_admin",
    },
    {
        name: "Tech Admin",
        email: "techadmin@dev.kissanmithar.com",
        password: "dev@TechAdmin123",
        role: "tech_admin",
    },
    {
        name: "Agriculture Expert",
        email: "agriexpert@dev.kissanmithar.com",
        password: "dev@AgriExpert123",
        role: "agri_expert",
    },
    {
        name: "E-commerce Manager",
        email: "ecommerce@dev.kissanmithar.com",
        password: "dev@Ecommerce123",
        role: "ecommerce_manager",
    },
    {
        name: "Order Manager",
        email: "orders@dev.kissanmithar.com",
        password: "dev@Orders123",
        role: "order_manager",
    },
    {
        name: "Support Agent",
        email: "support@dev.kissanmithar.com",
        password: "dev@Support123",
        role: "support_agent",
    },
    {
        name: "Content Manager",
        email: "content@dev.kissanmithar.com",
        password: "dev@Content123",
        role: "content_manager",
    },
    {
        name: "Finance Manager",
        email: "finance@dev.kissanmithar.com",
        password: "dev@Finance123",
        role: "finance_manager",
    },
    {
        name: "Field Agent",
        email: "fieldagent@dev.kissanmithar.com",
        password: "dev@FieldAgent123",
        role: "field_agent",
    },
];

const seedDevAccounts = async () => {
    try {
        await connectDB();
        await sequelize.sync({ alter: false });

        console.log('\n🌱 Seeding dev accounts into admin_users...\n');

        for (const account of devAccounts) {
            const existing = await AdminUser.findOne({ where: { email: account.email } });

            if (existing) {
                console.log(`  ⏭  ${account.role.padEnd(20)} — already exists (${account.email})`);
                continue;
            }

            const hashedPassword = await bcrypt.hash(account.password, 10);

            await AdminUser.create({
                name: account.name,
                email: account.email,
                password: hashedPassword,
                role: account.role,
                status: 'offline',
                isActive: true,
                languagesSpoken: ['en', 'hi', 'te'],
            });

            console.log(`  ✅ ${account.role.padEnd(20)} — created (${account.email})`);
        }

        console.log('\n🎉 Dev account seeding complete!\n');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
        process.exit(1);
    }
};

seedDevAccounts();
