import { User, UserAddress, FarmerSurvey } from './User.js';
import { Product, Review, MarketplaceOrder, MarketplaceOrderItem } from './Ecommerce.js';
import { Equipment, EquipmentOrder, EquipmentOrderItem, Fertilizer, FertilizerOrder, FertilizerOrderItem } from './Assets.js';
import { SoilReport, SoilReminder, MarketPrice, MarketHistory, PriceAlert, CropDiagnosis } from './Agri.js';
import { Blog, SuccessStory, Booking, Notification, OrchardRequest, Order } from './Content.js';

// Setup Relationships

// User Relations
User.hasMany(UserAddress, { foreignKey: 'userId', onDelete: 'CASCADE' });
UserAddress.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(FarmerSurvey, { foreignKey: 'userId', onDelete: 'CASCADE' });
FarmerSurvey.belongsTo(User, { foreignKey: 'userId' });

User.belongsTo(User, { as: 'FieldOfficer', foreignKey: 'fieldOfficerId' }); // Self-referencing

// E-commerce
User.hasMany(Review, { foreignKey: 'userId', onDelete: 'CASCADE' });
Review.belongsTo(User, { foreignKey: 'userId' });
Product.hasMany(Review, { foreignKey: 'productId', onDelete: 'CASCADE' });
Review.belongsTo(Product, { foreignKey: 'productId' });

User.hasMany(MarketplaceOrder, { foreignKey: 'userId', onDelete: 'CASCADE' });
MarketplaceOrder.belongsTo(User, { foreignKey: 'userId' });

MarketplaceOrder.hasMany(MarketplaceOrderItem, { foreignKey: 'orderId', onDelete: 'CASCADE' });
MarketplaceOrderItem.belongsTo(MarketplaceOrder, { foreignKey: 'orderId' });
Product.hasMany(MarketplaceOrderItem, { foreignKey: 'productId', onDelete: 'RESTRICT' });
MarketplaceOrderItem.belongsTo(Product, { foreignKey: 'productId' });

// Assets (Equipment & Fertilizer)
User.hasMany(EquipmentOrder, { foreignKey: 'userId', onDelete: 'CASCADE' });
EquipmentOrder.belongsTo(User, { foreignKey: 'userId' });
EquipmentOrder.hasMany(EquipmentOrderItem, { foreignKey: 'orderId', onDelete: 'CASCADE' });
EquipmentOrderItem.belongsTo(EquipmentOrder, { foreignKey: 'orderId' });
Equipment.hasMany(EquipmentOrderItem, { foreignKey: 'equipmentId', onDelete: 'RESTRICT' });
EquipmentOrderItem.belongsTo(Equipment, { foreignKey: 'equipmentId' });

User.hasMany(FertilizerOrder, { foreignKey: 'userId', onDelete: 'CASCADE' });
FertilizerOrder.belongsTo(User, { foreignKey: 'userId' });
FertilizerOrder.hasMany(FertilizerOrderItem, { foreignKey: 'orderId', onDelete: 'CASCADE' });
FertilizerOrderItem.belongsTo(FertilizerOrder, { foreignKey: 'orderId' });
Fertilizer.hasMany(FertilizerOrderItem, { foreignKey: 'fertilizerId', onDelete: 'RESTRICT' });
FertilizerOrderItem.belongsTo(Fertilizer, { foreignKey: 'fertilizerId' });

// Agriculture (Soil & Market Alerts)
User.hasMany(SoilReport, { foreignKey: 'farmerId', onDelete: 'CASCADE' });
SoilReport.belongsTo(User, { foreignKey: 'farmerId' });

User.hasMany(SoilReminder, { foreignKey: 'userId', onDelete: 'CASCADE' });
SoilReminder.belongsTo(User, { foreignKey: 'userId' });
SoilReport.hasMany(SoilReminder, { foreignKey: 'reportId', onDelete: 'CASCADE' });
SoilReminder.belongsTo(SoilReport, { foreignKey: 'reportId' });

User.hasMany(PriceAlert, { foreignKey: 'userId', onDelete: 'CASCADE' });
PriceAlert.belongsTo(User, { foreignKey: 'userId' });

// Crop Diagnoses
User.hasMany(CropDiagnosis, { foreignKey: 'farmerId', onDelete: 'CASCADE' });
CropDiagnosis.belongsTo(User, { foreignKey: 'farmerId' });

// Bookings & Content
User.hasMany(Booking, { foreignKey: 'farmerId', onDelete: 'CASCADE' });
Booking.belongsTo(User, { as: 'Farmer', foreignKey: 'farmerId' });
User.hasMany(Booking, { foreignKey: 'assignedOfficerId' });
Booking.belongsTo(User, { as: 'Officer', foreignKey: 'assignedOfficerId' });

User.hasMany(Notification, { foreignKey: 'sentBy' });
Notification.belongsTo(User, { foreignKey: 'sentBy' });

User.hasMany(OrchardRequest, { foreignKey: 'farmerId', onDelete: 'SET NULL' });
OrchardRequest.belongsTo(User, { foreignKey: 'farmerId' });

export {
    User, UserAddress, FarmerSurvey,
    Product, Review, MarketplaceOrder, MarketplaceOrderItem,
    Equipment, EquipmentOrder, EquipmentOrderItem,
    Fertilizer, FertilizerOrder, FertilizerOrderItem,
    SoilReport, SoilReminder, MarketPrice, MarketHistory, PriceAlert, CropDiagnosis,
    Blog, SuccessStory, Booking, Notification, OrchardRequest, Order
};
