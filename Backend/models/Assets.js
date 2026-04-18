import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Equipment = sequelize.define('Equipment', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    image: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 },
    specifications: { type: DataTypes.JSONB, defaultValue: {} }
}, {
    tableName: 'equipments',
    underscored: true,
    timestamps: true
});

const EquipmentOrder = sequelize.define('EquipmentOrder', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    totalAmount: { type: DataTypes.FLOAT, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: 'Pending' },
    paymentStatus: { type: DataTypes.STRING, defaultValue: 'Pending' },
    cancellationReason: { type: DataTypes.STRING, defaultValue: '' }
}, {
    tableName: 'equipment_orders',
    underscored: true,
    timestamps: true
});

const EquipmentOrderItem = sequelize.define('EquipmentOrderItem', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false }
}, {
    tableName: 'equipment_order_items',
    underscored: true,
    timestamps: false
});

const Fertilizer = sequelize.define('Fertilizer', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    image: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
    tableName: 'fertilizers',
    underscored: true,
    timestamps: true
});

const FertilizerOrder = sequelize.define('FertilizerOrder', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    totalAmount: { type: DataTypes.FLOAT, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: 'Pending' },
    paymentStatus: { type: DataTypes.STRING, defaultValue: 'Pending' }
}, {
    tableName: 'fertilizer_orders',
    underscored: true,
    timestamps: true
});

const FertilizerOrderItem = sequelize.define('FertilizerOrderItem', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false }
}, {
    tableName: 'fertilizer_order_items',
    underscored: true,
    timestamps: false
});

export { Equipment, EquipmentOrder, EquipmentOrderItem, Fertilizer, FertilizerOrder, FertilizerOrderItem };
