import { getSequelize } from '../database/sequelize.js';

const sequelize = getSequelize();

const models = {};

import UserModel from './User.js';
import UserAddressModel from './UserAddress.js';
import FarmerSurveyModel from './FarmerSurvey.js';
import AdminUserModel from './AdminUser.js';
import SoilReportModel from './SoilReport.js';
import SoilReminderModel from './SoilReminder.js';
import MarketPriceModel from './MarketPrice.js';
import MarketHistoryModel from './MarketHistory.js';
import PriceAlertModel from './PriceAlert.js';
import ProductModel from './Product.js';
import ReviewModel from './Review.js';
import EquipmentModel from './Equipment.js';
import FertilizerModel from './Fertilizer.js';
import MarketplaceOrderModel from './MarketplaceOrder.js';
import MarketplaceOrderItemModel from './MarketplaceOrderItem.js';
import EquipmentOrderModel from './EquipmentOrder.js';
import EquipmentOrderItemModel from './EquipmentOrderItem.js';
import FertilizerOrderModel from './FertilizerOrder.js';
import FertilizerOrderItemModel from './FertilizerOrderItem.js';
import BlogModel from './Blog.js';
import SuccessStoryModel from './SuccessStory.js';
import BookingModel from './Booking.js';
import ExpertModel from './Expert.js';
import ExpertBookingModel from './ExpertBooking.js';
import ExpertReviewModel from './ExpertReview.js';
import NotificationLogModel from './NotificationLog.js';
import SupportTicketModel from './SupportTicket.js';
import TicketMessageModel from './TicketMessage.js';
import ReplyTemplateModel from './ReplyTemplate.js';
import SLAConfigModel from './SLAConfig.js';
import OrderModel from './Order.js';
import PaymentModel from './Payment.js';
import CropDiagnosisModel from './CropDiagnosis.js';
import SchemeModel from './Scheme.js';

models.User = UserModel(sequelize);
models.UserAddress = UserAddressModel(sequelize);
models.FarmerSurvey = FarmerSurveyModel(sequelize);
models.AdminUser = AdminUserModel(sequelize);
models.SoilReport = SoilReportModel(sequelize);
models.SoilReminder = SoilReminderModel(sequelize);
models.MarketPrice = MarketPriceModel(sequelize);
models.MarketHistory = MarketHistoryModel(sequelize);
models.PriceAlert = PriceAlertModel(sequelize);
models.Product = ProductModel(sequelize);
models.Review = ReviewModel(sequelize);
models.Equipment = EquipmentModel(sequelize);
models.Fertilizer = FertilizerModel(sequelize);
models.MarketplaceOrder = MarketplaceOrderModel(sequelize);
models.MarketplaceOrderItem = MarketplaceOrderItemModel(sequelize);
models.EquipmentOrder = EquipmentOrderModel(sequelize);
models.EquipmentOrderItem = EquipmentOrderItemModel(sequelize);
models.FertilizerOrder = FertilizerOrderModel(sequelize);
models.FertilizerOrderItem = FertilizerOrderItemModel(sequelize);
models.Blog = BlogModel(sequelize);
models.SuccessStory = SuccessStoryModel(sequelize);
models.Booking = BookingModel(sequelize);
models.Expert = ExpertModel(sequelize);
models.ExpertBooking = ExpertBookingModel(sequelize);
models.ExpertReview = ExpertReviewModel(sequelize);
models.NotificationLog = NotificationLogModel(sequelize);
models.SupportTicket = SupportTicketModel(sequelize);
models.TicketMessage = TicketMessageModel(sequelize);
models.ReplyTemplate = ReplyTemplateModel(sequelize);
models.SLAConfig = SLAConfigModel(sequelize);
models.Order = OrderModel(sequelize);
models.Payment = PaymentModel(sequelize);
models.CropDiagnosis = CropDiagnosisModel(sequelize);
models.Scheme = SchemeModel(sequelize);


// Associations
models.UserAddress.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
models.User.hasMany(models.UserAddress, { foreignKey: 'userId', as: 'addresses' });

models.FarmerSurvey.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
models.User.hasOne(models.FarmerSurvey, { foreignKey: 'userId', as: 'survey' });

models.SoilReport.belongsTo(models.User, { foreignKey: 'farmerId', as: 'farmer' });
models.User.hasMany(models.SoilReport, { foreignKey: 'farmerId', as: 'soilReports' });

models.MarketplaceOrder.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
models.MarketplaceOrder.hasMany(models.MarketplaceOrderItem, { foreignKey: 'orderId', as: 'items' });
models.MarketplaceOrderItem.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });

models.EquipmentOrder.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
models.EquipmentOrder.hasMany(models.EquipmentOrderItem, { foreignKey: 'orderId', as: 'items' });
models.EquipmentOrderItem.belongsTo(models.Equipment, { foreignKey: 'equipmentId', as: 'equipment' });

models.FertilizerOrder.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
models.FertilizerOrder.hasMany(models.FertilizerOrderItem, { foreignKey: 'orderId', as: 'items' });
models.FertilizerOrderItem.belongsTo(models.Fertilizer, { foreignKey: 'fertilizerId', as: 'fertilizer' });

models.ExpertBooking.belongsTo(models.User, { foreignKey: 'farmerId', as: 'farmer' });
models.ExpertBooking.belongsTo(models.Expert, { foreignKey: 'expertId', as: 'expert' });
models.Expert.hasMany(models.ExpertBooking, { foreignKey: 'expertId', as: 'bookings' });
models.Expert.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });

models.TicketMessage.belongsTo(models.SupportTicket, { foreignKey: 'ticketId', as: 'ticket' });
models.SupportTicket.hasMany(models.TicketMessage, { foreignKey: 'ticketId', as: 'messages' });

export default models;
