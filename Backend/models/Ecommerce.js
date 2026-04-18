import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Product = sequelize.define('Product', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    shortDescription: { type: DataTypes.STRING },
    category: { type: DataTypes.STRING, allowNull: false },
    subCategory: { type: DataTypes.STRING },
    price: { type: DataTypes.DECIMAL, allowNull: false },
    discountedPrice: { type: DataTypes.DECIMAL },
    images: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 },
    specifications: { type: DataTypes.JSONB, defaultValue: {} },
    ratings: { type: DataTypes.DECIMAL, defaultValue: 0 },
    numReviews: { type: DataTypes.INTEGER, defaultValue: 0 },
    isFeatured: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
    tableName: 'products',
    underscored: true,
    timestamps: true
});

const Review = sequelize.define('Review', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    rating: { type: DataTypes.INTEGER, allowNull: false },
    comment: { type: DataTypes.TEXT, allowNull: false },
    userName: { type: DataTypes.STRING, allowNull: false }
}, {
    tableName: 'reviews',
    underscored: true,
    timestamps: true
});

const MarketplaceOrder = sequelize.define('MarketplaceOrder', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    totalAmount: { type: DataTypes.DECIMAL, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: 'Pending' },
    paymentMethod: { type: DataTypes.STRING, defaultValue: 'COD' },
    paymentStatus: { type: DataTypes.STRING, defaultValue: 'Pending' },
    razorpayOrderId: { type: DataTypes.STRING, defaultValue: '' },
    paymentDetails: { type: DataTypes.JSONB, defaultValue: {} },
    cancellationReason: { type: DataTypes.STRING, defaultValue: '' }
}, {
    tableName: 'marketplace_orders',
    underscored: true,
    timestamps: true
});

const MarketplaceOrderItem = sequelize.define('MarketplaceOrderItem', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.DECIMAL, allowNull: false }
}, {
    tableName: 'marketplace_order_items',
    underscored: true,
    timestamps: false
});

export { Product, Review, MarketplaceOrder, MarketplaceOrderItem };
