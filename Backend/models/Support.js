import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

// ─────────────────────────────────────────────────────────────
// Admin Users — Support staff (agents, managers, super_admin)
// ─────────────────────────────────────────────────────────────

const AdminUser = sequelize.define('AdminUser', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    phone: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING, allowNull: false },
    avatar: { type: DataTypes.STRING },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'support_agent',
        validate: { isIn: [['super_admin', 'support_agent', 'support_manager']] }
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'offline',
        validate: { isIn: [['online', 'busy', 'offline']] }
    },
    assignedDistricts: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
    languagesSpoken: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: ['en'] },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    lastLoginAt: { type: DataTypes.DATE },
}, {
    tableName: 'admin_users',
    underscored: true,
    timestamps: true
});

// ─────────────────────────────────────────────────────────────
// Support Tickets
// ─────────────────────────────────────────────────────────────

const SupportTicket = sequelize.define('SupportTicket', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    ticketRef: { type: DataTypes.STRING, unique: true },
    category: { type: DataTypes.STRING, allowNull: false },
    subCategory: { type: DataTypes.STRING },
    subject: { type: DataTypes.STRING, allowNull: false },
    priority: {
        type: DataTypes.STRING,
        defaultValue: 'medium',
        validate: { isIn: [['critical', 'high', 'medium', 'low']] }
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'open',
        validate: { isIn: [['open', 'in_progress', 'waiting', 'resolved', 'closed', 'spam']] }
    },
    source: {
        type: DataTypes.STRING,
        defaultValue: 'app',
        validate: { isIn: [['app', 'email', 'phone', 'whatsapp']] }
    },
    tags: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
    linkedOrderId: { type: DataTypes.UUID },
    linkedBookingId: { type: DataTypes.UUID },
    escalatedAt: { type: DataTypes.DATE },
    firstResponseAt: { type: DataTypes.DATE },
    resolvedAt: { type: DataTypes.DATE },
    closedAt: { type: DataTypes.DATE },
    slaBreached: { type: DataTypes.BOOLEAN, defaultValue: false },
    farmerRating: {
        type: DataTypes.INTEGER,
        validate: { min: 1, max: 5 }
    },
    farmerFeedback: { type: DataTypes.TEXT },
}, {
    tableName: 'support_tickets',
    underscored: true,
    timestamps: true
});

// ─────────────────────────────────────────────────────────────
// Ticket Messages — Conversation thread
// ─────────────────────────────────────────────────────────────

const TicketMessage = sequelize.define('TicketMessage', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    senderType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isIn: [['farmer', 'agent', 'system']] }
    },
    senderId: { type: DataTypes.UUID },
    message: { type: DataTypes.TEXT, allowNull: false },
    attachments: { type: DataTypes.JSONB, defaultValue: [] },
    isInternalNote: { type: DataTypes.BOOLEAN, defaultValue: false },
    isTranslated: { type: DataTypes.BOOLEAN, defaultValue: false },
    originalLanguage: { type: DataTypes.STRING },
}, {
    tableName: 'ticket_messages',
    underscored: true,
    timestamps: true,
    updatedAt: false  // Messages are immutable
});

// ─────────────────────────────────────────────────────────────
// Quick Reply Templates
// ─────────────────────────────────────────────────────────────

const ReplyTemplate = sequelize.define('ReplyTemplate', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    contentEn: { type: DataTypes.TEXT },
    contentHi: { type: DataTypes.TEXT },
    contentTe: { type: DataTypes.TEXT },
    subjectEn: { type: DataTypes.STRING },
    subjectHi: { type: DataTypes.STRING },
    subjectTe: { type: DataTypes.STRING },
    variables: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
    tableName: 'reply_templates',
    underscored: true,
    timestamps: true
});

// ─────────────────────────────────────────────────────────────
// Notification Logs
// ─────────────────────────────────────────────────────────────

const NotificationLog = sequelize.define('NotificationLog', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    channel: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isIn: [['email', 'sms', 'in_app', 'all']] }
    },
    targetType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isIn: [['all', 'specific', 'state', 'district', 'language', 'open_tickets', 'pending_orders', 'custom']] }
    },
    targetFilter: { type: DataTypes.JSONB, defaultValue: {} },
    targetIds: { type: DataTypes.JSONB, defaultValue: [] },
    sentCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    failedCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    scheduledAt: { type: DataTypes.DATE },
    sentAt: { type: DataTypes.DATE },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending',
        validate: { isIn: [['pending', 'sending', 'sent', 'failed', 'scheduled']] }
    },
}, {
    tableName: 'notification_logs',
    underscored: true,
    timestamps: true
});

// ─────────────────────────────────────────────────────────────
// Agent Performance — Daily metrics
// ─────────────────────────────────────────────────────────────

const AgentPerformance = sequelize.define('AgentPerformance', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    ticketsAssigned: { type: DataTypes.INTEGER, defaultValue: 0 },
    ticketsResolved: { type: DataTypes.INTEGER, defaultValue: 0 },
    avgResponseMins: { type: DataTypes.INTEGER, defaultValue: 0 },
    avgResolutionMins: { type: DataTypes.INTEGER, defaultValue: 0 },
    slaMetCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    slaBreachedCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    ratingSum: { type: DataTypes.DECIMAL, defaultValue: 0 },
    ratingCount: { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
    tableName: 'agent_performance',
    underscored: true,
    timestamps: false,
    indexes: [{ unique: true, fields: ['agent_id', 'date'] }]
});

// ─────────────────────────────────────────────────────────────
// SLA Configuration
// ─────────────────────────────────────────────────────────────

const SLAConfig = sequelize.define('SLAConfig', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    priority: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isIn: [['critical', 'high', 'medium', 'low']] }
    },
    firstResponseMins: { type: DataTypes.INTEGER, allowNull: false },
    resolutionMins: { type: DataTypes.INTEGER, allowNull: false },
    escalateAfterMins: { type: DataTypes.INTEGER, allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
    tableName: 'sla_config',
    underscored: true,
    timestamps: true
});

export {
    AdminUser,
    SupportTicket,
    TicketMessage,
    ReplyTemplate,
    NotificationLog,
    AgentPerformance,
    SLAConfig
};
