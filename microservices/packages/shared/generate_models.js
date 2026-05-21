import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modelsDir = path.resolve(__dirname, 'models');
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
}

const models = [
  { name: 'User', table: 'users', fields: `
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING, unique: true },
    otp: { type: DataTypes.STRING, defaultValue: '' },
    otp_expire_at: { type: DataTypes.BIGINT, defaultValue: 0 },
    verify_otp: { type: DataTypes.STRING, defaultValue: '' },
    verify_otp_expire_at: { type: DataTypes.BIGINT, defaultValue: 0 },
    reset_otp: { type: DataTypes.STRING, defaultValue: '' },
    reset_otp_expire_at: { type: DataTypes.BIGINT, defaultValue: 0 },
    isAccountVerified: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'is_account_verified' },
    role: { type: DataTypes.ENUM('user', 'admin', 'field-officer'), defaultValue: 'user' },
    district: { type: DataTypes.STRING, defaultValue: 'Other' },
    crops: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
    field_officer_id: { type: DataTypes.UUID },
    language: { type: DataTypes.STRING, defaultValue: 'en' },
    preferred_language: { type: DataTypes.STRING, defaultValue: 'en' },
    has_completed_tour: { type: DataTypes.BOOLEAN, defaultValue: false },
    simple_mode: { type: DataTypes.BOOLEAN, defaultValue: false },
    cartData: { type: DataTypes.JSONB, defaultValue: {}, field: 'cart_data' },
    has_completed_survey: { type: DataTypes.BOOLEAN, defaultValue: false }
  `},
  { name: 'UserAddress', table: 'user_addresses', fields: `
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false, field: 'user_id' },
    full_name: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false }
  `},
  { name: 'FarmerSurvey', table: 'farmer_surveys', fields: `
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false, unique: true, field: 'user_id' },
    language: { type: DataTypes.STRING },
    farm_name: { type: DataTypes.STRING },
    farm_size: { type: DataTypes.DECIMAL },
    farm_size_unit: { type: DataTypes.STRING, defaultValue: 'acres' },
    land_ownership: { type: DataTypes.STRING },
    soil_type: { type: DataTypes.STRING },
    water_source: { type: DataTypes.STRING },
    primary_crops: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
    farming_experience: { type: DataTypes.STRING }
  `},
  { name: 'AdminUser', table: 'admin_users', fields: `
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING, unique: true },
    role: { type: DataTypes.STRING, defaultValue: 'support_agent' },
    status: { type: DataTypes.STRING, defaultValue: 'active' },
    avatar: { type: DataTypes.STRING },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_active' },
    assignedDistricts: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [], field: 'assigned_districts' },
    languagesSpoken: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: ['en'], field: 'languages_spoken' }
  `},
  { name: 'SoilReport', table: 'soil_reports', fields: `
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    farmerId: { type: DataTypes.UUID, allowNull: false, field: 'farmer_id' },
    ph: { type: DataTypes.DECIMAL },
    nitrogen: { type: DataTypes.DECIMAL },
    phosphorus: { type: DataTypes.DECIMAL },
    potassium: { type: DataTypes.DECIMAL },
    organic_matter: { type: DataTypes.DECIMAL },
    micronutrients: { type: DataTypes.JSONB, defaultValue: {} },
    recommended_fertilizer: { type: DataTypes.STRING },
    suitable_crops: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
    soil_status: { type: DataTypes.ENUM('Good', 'Moderate', 'Critical', 'Acidic', 'Neutral', 'Alkaline') },
    suitability_pct: { type: DataTypes.DECIMAL },
    report_file: { type: DataTypes.STRING },
    status: { type: DataTypes.ENUM('Pending', 'Completed'), defaultValue: 'Pending' },
    next_test_date: { type: DataTypes.DATE }
  `},
  { name: 'SoilReminder', table: 'soil_reminders', fields: `
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false, field: 'user_id' },
    reportId: { type: DataTypes.UUID, allowNull: false, field: 'report_id' },
    reminder_date: { type: DataTypes.DATE, allowNull: false },
    is_sent: { type: DataTypes.BOOLEAN, defaultValue: false }
  `},
  { name: 'MarketPrice', table: 'market_prices', fields: `
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    cropName: { type: DataTypes.STRING, allowNull: false, field: 'crop_name' },
    district: { type: DataTypes.STRING, allowNull: false },
    mandi: { type: DataTypes.STRING, defaultValue: 'Local Mandi' },
    min_price: { type: DataTypes.DECIMAL },
    max_price: { type: DataTypes.DECIMAL },
    modalPrice: { type: DataTypes.DECIMAL, allowNull: false, field: 'modal_price' },
    change: { type: DataTypes.DECIMAL, defaultValue: 0 },
    arrivalDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'arrival_date' },
    variety: { type: DataTypes.STRING, defaultValue: 'Standard' },
    source: { type: DataTypes.STRING, defaultValue: 'agmarknet' }
  `},
  { name: 'MarketHistory', table: 'market_history', fields: `
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    crop: { type: DataTypes.STRING, allowNull: false },
    district: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DECIMAL, allowNull: false },
    date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  `},
  { name: 'PriceAlert', table: 'price_alerts', fields: `
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false, field: 'user_id' },
    crop: { type: DataTypes.STRING, allowNull: false },
    target_price: { type: DataTypes.DECIMAL, allowNull: false },
    condition: { type: DataTypes.ENUM('Above', 'Below'), allowNull: false },
    status: { type: DataTypes.ENUM('Active', 'Triggered'), defaultValue: 'Active' },
    last_notified: { type: DataTypes.DATE }
  `},
  { name: 'Product', table: 'products', fields: `
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    short_description: { type: DataTypes.TEXT },
    category: { type: DataTypes.STRING, allowNull: false },
    sub_category: { type: DataTypes.STRING },
    price: { type: DataTypes.DECIMAL, allowNull: false },
    discounted_price: { type: DataTypes.DECIMAL },
    images: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 },
    specifications: { type: DataTypes.JSONB, defaultValue: {} },
    ratings: { type: DataTypes.DECIMAL, defaultValue: 0 },
    num_reviews: { type: DataTypes.INTEGER, defaultValue: 0 },
    isFeatured: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'is_featured' }
  `},
  { name: 'Review', table: 'reviews', fields: `
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false, field: 'user_id' },
    productId: { type: DataTypes.UUID, allowNull: false, field: 'product_id' },
    rating: { type: DataTypes.INTEGER, allowNull: false },
    comment: { type: DataTypes.TEXT, allowNull: false },
    user_name: { type: DataTypes.STRING, allowNull: false }
  `},
  { name: 'Equipment', table: 'equipments', fields: `
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    price: { type: DataTypes.DECIMAL, allowNull: false },
    image: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 },
    specifications: { type: DataTypes.JSONB, defaultValue: {} }
  `},
  { name: 'Fertilizer', table: 'fertilizers', fields: `
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    price: { type: DataTypes.DECIMAL, allowNull: false },
    image: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 }
  `},
  { name: 'MarketplaceOrder', table: 'marketplace_orders', fields: `
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false, field: 'user_id' },
    total_amount: { type: DataTypes.DECIMAL, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'), defaultValue: 'Pending' },
    payment_method: { type: DataTypes.ENUM('COD', 'Razorpay'), defaultValue: 'COD' },
    payment_status: { type: DataTypes.ENUM('Pending', 'Completed', 'Failed'), defaultValue: 'Pending' },
    razorpay_order_id: { type: DataTypes.STRING, defaultValue: '' },
    payment_details: { type: DataTypes.JSONB, defaultValue: {} },
    cancellation_reason: { type: DataTypes.STRING, defaultValue: '' }
  `},
  { name: 'MarketplaceOrderItem', table: 'marketplace_order_items', fields: `
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    orderId: { type: DataTypes.UUID, allowNull: false, field: 'order_id' },
    productId: { type: DataTypes.UUID, allowNull: false, field: 'product_id' },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.DECIMAL, allowNull: false }
  `, timestamps: false },
  { name: 'EquipmentOrder', table: 'equipment_orders', fields: `
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false, field: 'user_id' },
    total_amount: { type: DataTypes.DECIMAL, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'), defaultValue: 'Pending' },
    payment_status: { type: DataTypes.ENUM('Pending', 'Completed', 'Failed'), defaultValue: 'Pending' },
    cancellation_reason: { type: DataTypes.STRING, defaultValue: '' }
  `},
  { name: 'EquipmentOrderItem', table: 'equipment_order_items', fields: `
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    orderId: { type: DataTypes.UUID, allowNull: false, field: 'order_id' },
    equipmentId: { type: DataTypes.UUID, allowNull: false, field: 'equipment_id' },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.DECIMAL, allowNull: false }
  `, timestamps: false },
  { name: 'FertilizerOrder', table: 'fertilizer_orders', fields: `
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false, field: 'user_id' },
    total_amount: { type: DataTypes.DECIMAL, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'), defaultValue: 'Pending' },
    payment_status: { type: DataTypes.ENUM('Pending', 'Completed', 'Failed'), defaultValue: 'Pending' }
  `},
  { name: 'FertilizerOrderItem', table: 'fertilizer_order_items', fields: `
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    orderId: { type: DataTypes.UUID, allowNull: false, field: 'order_id' },
    fertilizerId: { type: DataTypes.UUID, allowNull: false, field: 'fertilizer_id' },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.DECIMAL, allowNull: false }
  `, timestamps: false },
  { name: 'Blog', table: 'blogs', fields: `
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, unique: true },
    excerpt: { type: DataTypes.TEXT },
    content: { type: DataTypes.TEXT },
    featured_image: { type: DataTypes.STRING },
    author: { type: DataTypes.STRING },
    status: { type: DataTypes.ENUM('draft', 'published'), defaultValue: 'draft' },
    tags: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
    views: { type: DataTypes.INTEGER, defaultValue: 0 }
  `},
  { name: 'SuccessStory', table: 'success_stories', fields: `
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    farmer_name: { type: DataTypes.STRING },
    district: { type: DataTypes.STRING },
    crop: { type: DataTypes.STRING },
    before_yield: { type: DataTypes.DECIMAL },
    after_yield: { type: DataTypes.DECIMAL },
    description: { type: DataTypes.TEXT },
    image: { type: DataTypes.STRING },
    status: { type: DataTypes.ENUM('draft', 'published'), defaultValue: 'draft' }
  `},
  { name: 'Booking', table: 'bookings', fields: `
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    farmer_id: { type: DataTypes.UUID, allowNull: false },
    full_name: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    village: { type: DataTypes.STRING, allowNull: false },
    district: { type: DataTypes.STRING, allowNull: false },
    visit_date: { type: DataTypes.DATE, allowNull: false },
    purpose: { type: DataTypes.STRING, allowNull: false },
    assigned_officer_id: { type: DataTypes.UUID },
    status: { type: DataTypes.ENUM('Pending', 'Confirmed', 'Completed', 'Cancelled'), defaultValue: 'Pending' },
    payment_status: { type: DataTypes.ENUM('Pending', 'Completed', 'Failed'), defaultValue: 'Pending' }
  `},
  { name: 'Expert', table: 'experts', fields: `
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, field: 'user_id' },
    name: { type: DataTypes.STRING, allowNull: false },
    specialization: { type: DataTypes.STRING },
    bio: { type: DataTypes.TEXT },
    profileImage: { type: DataTypes.STRING, field: 'profile_image' },
    experienceYears: { type: DataTypes.INTEGER, field: 'experience_years' },
    rating: { type: DataTypes.DECIMAL, defaultValue: 0 },
    hourlyRate: { type: DataTypes.DECIMAL, field: 'hourly_rate' },
    isAvailable: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_available' },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_active' }
  `},
  { name: 'ExpertBooking', table: 'expert_bookings', fields: `
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    farmerId: { type: DataTypes.UUID, allowNull: false, field: 'farmer_id' },
    expertId: { type: DataTypes.UUID, allowNull: false, field: 'expert_id' },
    scheduledAt: { type: DataTypes.DATE, allowNull: false, field: 'scheduled_at' },
    status: { type: DataTypes.STRING, defaultValue: 'pending' },
    meetingUrl: { type: DataTypes.STRING, field: 'meeting_url' },
    notes: { type: DataTypes.TEXT },
    amount: { type: DataTypes.DECIMAL }
  `},
  { name: 'ExpertReview', table: 'expert_reviews', fields: `
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    farmerId: { type: DataTypes.UUID, allowNull: false, field: 'farmer_id' },
    expertId: { type: DataTypes.UUID, allowNull: false, field: 'expert_id' },
    rating: { type: DataTypes.INTEGER, allowNull: false },
    comment: { type: DataTypes.TEXT }
  `},
  { name: 'NotificationLog', table: 'notification_logs', fields: `
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    user_id: { type: DataTypes.UUID },
    channel: { type: DataTypes.STRING },
    type: { type: DataTypes.STRING },
    recipient: { type: DataTypes.STRING },
    subject: { type: DataTypes.STRING },
    status: { type: DataTypes.STRING, defaultValue: 'sent' },
    metadata: { type: DataTypes.JSONB, defaultValue: {} },
    targetType: { type: DataTypes.STRING, field: 'target_type' },
    target_value: { type: DataTypes.STRING, defaultValue: 'Global' },
    recipient_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    sent_by: { type: DataTypes.UUID },
    sent_at: { type: DataTypes.DATE }
  `},
  { name: 'SupportTicket', table: 'support_tickets', fields: `
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, field: 'user_id' },
    ticketRef: { type: DataTypes.STRING, field: 'ticket_ref' },
    subject: { type: DataTypes.STRING },
    category: { type: DataTypes.STRING },
    priority: { type: DataTypes.STRING },
    status: { type: DataTypes.STRING, defaultValue: 'open' },
    assignedTo: { type: DataTypes.UUID, field: 'assigned_to' },
    description: { type: DataTypes.TEXT }
  `},
  { name: 'TicketMessage', table: 'ticket_messages', fields: `
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    ticketId: { type: DataTypes.UUID, allowNull: false, field: 'ticket_id' },
    senderId: { type: DataTypes.UUID, field: 'sender_id' },
    senderRole: { type: DataTypes.STRING, field: 'sender_role' },
    message: { type: DataTypes.TEXT, allowNull: false },
    attachments: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] }
  `},
  { name: 'ReplyTemplate', table: 'reply_templates', fields: `
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING },
    content: { type: DataTypes.TEXT, allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_active' },
    createdBy: { type: DataTypes.UUID, field: 'created_by' }
  `},
  { name: 'SLAConfig', table: 'sla_config', fields: `
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    priority: { type: DataTypes.STRING, unique: true },
    firstResponseMins: { type: DataTypes.INTEGER, field: 'first_response_mins' },
    resolutionMins: { type: DataTypes.INTEGER, field: 'resolution_mins' }
  `},
  { name: 'Order', table: 'orders', fields: `
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.STRING, allowNull: false, field: 'user_id' },
    package: { type: DataTypes.STRING, allowNull: false },
    amount: { type: DataTypes.DECIMAL, allowNull: false },
    date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    status: { type: DataTypes.STRING, defaultValue: 'Active' }
  `},
  { name: 'Payment', table: 'payments', fields: `
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    orderId: { type: DataTypes.UUID, field: 'order_id' },
    userId: { type: DataTypes.UUID, field: 'user_id' },
    amount: { type: DataTypes.DECIMAL },
    currency: { type: DataTypes.STRING, defaultValue: 'INR' },
    status: { type: DataTypes.STRING },
    paymentMethod: { type: DataTypes.STRING, field: 'payment_method' },
    transactionId: { type: DataTypes.STRING, field: 'transaction_id' },
    paymentGateway: { type: DataTypes.STRING, field: 'payment_gateway' },
    gatewayResponse: { type: DataTypes.JSONB, field: 'gateway_response' }
  `},
  { name: 'CropDiagnosis', table: 'crop_diagnoses', fields: `
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    farmerId: { type: DataTypes.UUID, field: 'farmer_id' },
    imageUrl: { type: DataTypes.STRING, field: 'image_url' },
    cropName: { type: DataTypes.STRING, field: 'crop_name' },
    fieldName: { type: DataTypes.STRING, field: 'field_name' },
    diseaseName: { type: DataTypes.STRING, field: 'disease_name' },
    severity: { type: DataTypes.STRING },
    confidence: { type: DataTypes.DECIMAL },
    isHealthy: { type: DataTypes.BOOLEAN, field: 'is_healthy' },
    recommendations: { type: DataTypes.JSONB, defaultValue: [] }
  `},
  { name: 'Scheme', table: 'schemes', fields: `
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    eligibility: { type: DataTypes.TEXT },
    benefits: { type: DataTypes.TEXT },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
  `}
];

models.forEach(model => {
  const fileContent = "import { DataTypes } from 'sequelize';\n\nexport default (sequelize) => {\n  const " + model.name + " = sequelize.define('" + model.name + "', {\n" + model.fields + "\n  }, {\n    tableName: '" + model.table + "',\n    timestamps: " + (model.timestamps === false ? 'false' : 'true') + "\n  });\n\n  return " + model.name + ";\n};\n";
  fs.writeFileSync(path.join(modelsDir, model.name + '.js'), fileContent);
});

// Generate index.js
let indexContent = "import { getSequelize } from '../database/sequelize.js';\n\nconst sequelize = getSequelize();\n\nconst models = {};\n\n";
models.forEach(m => {
  indexContent += "import " + m.name + "Model from './" + m.name + ".js';\n";
});
indexContent += "\n";
models.forEach(m => {
  indexContent += "models." + m.name + " = " + m.name + "Model(sequelize);\n";
});

indexContent += `

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
`;
fs.writeFileSync(path.join(modelsDir, 'index.js'), indexContent);
console.log('Successfully generated models.');
