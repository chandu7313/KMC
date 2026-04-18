import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Blog = sequelize.define('Blog', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, unique: true },
    excerpt: { type: DataTypes.TEXT },
    content: { type: DataTypes.TEXT },
    featuredImage: { type: DataTypes.STRING },
    author: { type: DataTypes.STRING },
    status: { type: DataTypes.STRING, defaultValue: 'draft' },
    tags: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
    views: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
    tableName: 'blogs',
    underscored: true,
    timestamps: true
});

const SuccessStory = sequelize.define('SuccessStory', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    farmerName: { type: DataTypes.STRING },
    district: { type: DataTypes.STRING },
    crop: { type: DataTypes.STRING },
    beforeYield: { type: DataTypes.DECIMAL },
    afterYield: { type: DataTypes.DECIMAL },
    description: { type: DataTypes.TEXT },
    image: { type: DataTypes.STRING },
    status: { type: DataTypes.STRING, defaultValue: 'draft' }
}, {
    tableName: 'success_stories',
    underscored: true,
    timestamps: true
});

const Booking = sequelize.define('Booking', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    fullName: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    village: { type: DataTypes.STRING, allowNull: false },
    district: { type: DataTypes.STRING, allowNull: false },
    visitDate: { type: DataTypes.DATE, allowNull: false },
    purpose: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: 'Pending' },
    paymentStatus: { type: DataTypes.STRING, defaultValue: 'Pending' }
}, {
    tableName: 'bookings',
    underscored: true,
    timestamps: true
});

const Notification = sequelize.define('Notification', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    targetType: { type: DataTypes.STRING, allowNull: false },
    targetValue: { type: DataTypes.STRING, defaultValue: 'Global' },
    recipientCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    sentAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
    tableName: 'notifications',
    underscored: true,
    timestamps: true
});

const OrchardRequest = sequelize.define('OrchardRequest', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    acres: { type: DataTypes.DECIMAL, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    waterType: { type: DataTypes.STRING, allowNull: false },
    goal: { type: DataTypes.STRING, allowNull: false },
    skillLevel: { type: DataTypes.STRING, allowNull: false },
    marketPreference: { type: DataTypes.STRING, allowNull: false },
    images: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
    status: { type: DataTypes.STRING, defaultValue: 'pending' },
    assignedExpert: { type: DataTypes.STRING }
}, {
    tableName: 'orchard_requests',
    underscored: true,
    timestamps: true
});

// Used for Package Subscriptions
const Order = sequelize.define('Order', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.STRING, allowNull: false },
    package: { type: DataTypes.STRING, allowNull: false },
    amount: { type: DataTypes.DECIMAL, allowNull: false },
    date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    status: { type: DataTypes.STRING, defaultValue: 'Active' }
}, {
    tableName: 'orders',
    underscored: true,
    timestamps: true
});

export { Blog, SuccessStory, Booking, Notification, OrchardRequest, Order };
