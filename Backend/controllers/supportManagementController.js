import { Op } from 'sequelize';
import bcrypt from 'bcryptjs';
import { sequelize } from '../config/database.js';
import {
    User, SupportTicket, TicketMessage, AdminUser,
    ReplyTemplate, NotificationLog, AgentPerformance, SLAConfig,
    SoilReport, CropDiagnosis, Booking, MarketplaceOrder
} from '../models/index.js';

// ═══════════════════════════════════════════
// FARMERS
// ═══════════════════════════════════════════

export const getSupportFarmers = async (req, res) => {
    try {
        const { page = 1, limit = 25, search, district, status, sort = 'createdAt', order = 'DESC' } = req.query;
        const where = { role: 'user' };
        if (district) where.district = district;
        if (search) {
            where[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { phone: { [Op.iLike]: `%${search}%` } },
                { email: { [Op.iLike]: `%${search}%` } }
            ];
        }

        const offset = (parseInt(page) - 1) * parseInt(limit);
        const { count, rows } = await User.findAndCountAll({
            where, offset, limit: parseInt(limit),
            attributes: ['id','name','email','phone','district','language','isAccountVerified','createdAt'],
            order: [[sort, order]]
        });

        // Get order counts for each farmer
        const farmersWithStats = await Promise.all(rows.map(async (farmer) => {
            const orderCount = await MarketplaceOrder.count({ where: { userId: farmer.id } });
            const ticketCount = await SupportTicket.count({ where: { farmerId: farmer.id } });
            return { ...farmer.toJSON(), orderCount, ticketCount };
        }));

        res.json({ success: true, farmers: farmersWithStats, total: count, page: parseInt(page), totalPages: Math.ceil(count / parseInt(limit)) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getFarmerProfile = async (req, res) => {
    try {
        const farmer = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password','otp','otpExpireAt','verifyOtp','verifyOtpExpireAt','resetOtp','resetOtpExpireAt'] }
        });
        if (!farmer) return res.status(404).json({ success: false, message: 'Farmer not found' });

        const [orders, tickets, soilReports, diagnoses, bookings] = await Promise.all([
            MarketplaceOrder.findAll({ where: { userId: farmer.id }, order: [['createdAt','DESC']], limit: 10 }),
            SupportTicket.findAll({ where: { farmerId: farmer.id }, order: [['createdAt','DESC']], limit: 10,
                include: [{ model: AdminUser, as: 'AssignedAgent', attributes: ['id','name'] }] }),
            SoilReport.findAll({ where: { farmerId: farmer.id }, order: [['createdAt','DESC']], limit: 10 }),
            CropDiagnosis.findAll({ where: { farmerId: farmer.id }, order: [['createdAt','DESC']], limit: 10 }),
            Booking.findAll({ where: { farmerId: farmer.id }, order: [['createdAt','DESC']], limit: 10 })
        ]);

        const stats = {
            totalOrders: await MarketplaceOrder.count({ where: { userId: farmer.id } }),
            totalTickets: await SupportTicket.count({ where: { farmerId: farmer.id } }),
            openTickets: await SupportTicket.count({ where: { farmerId: farmer.id, status: { [Op.in]: ['open','in_progress','waiting'] } } }),
            soilTests: await SoilReport.count({ where: { farmerId: farmer.id } }),
            diseaseScans: await CropDiagnosis.count({ where: { farmerId: farmer.id } }),
            callBookings: await Booking.count({ where: { farmerId: farmer.id } })
        };

        res.json({ success: true, farmer, stats, orders, tickets, soilReports, diagnoses, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getFarmerActivity = async (req, res) => {
    try {
        const farmerId = req.params.id;
        const [orders, tickets, soilReports, diagnoses, bookings] = await Promise.all([
            MarketplaceOrder.findAll({ where: { userId: farmerId }, attributes: ['id','totalAmount','status','createdAt'], order: [['createdAt','DESC']] }),
            SupportTicket.findAll({ where: { farmerId }, attributes: ['id','ticketRef','subject','status','createdAt'], order: [['createdAt','DESC']] }),
            SoilReport.findAll({ where: { farmerId }, attributes: ['id','soilStatus','suitabilityPct','createdAt'], order: [['createdAt','DESC']] }),
            CropDiagnosis.findAll({ where: { farmerId }, attributes: ['id','createdAt'], order: [['createdAt','DESC']] }),
            Booking.findAll({ where: { farmerId }, attributes: ['id','purpose','status','visitDate','createdAt'], order: [['createdAt','DESC']] })
        ]);

        // Merge into timeline
        const activity = [
            ...orders.map(o => ({ type: 'order', data: o, date: o.createdAt })),
            ...tickets.map(t => ({ type: 'ticket', data: t, date: t.createdAt })),
            ...soilReports.map(s => ({ type: 'soil_report', data: s, date: s.createdAt })),
            ...diagnoses.map(d => ({ type: 'disease_scan', data: d, date: d.createdAt })),
            ...bookings.map(b => ({ type: 'booking', data: b, date: b.createdAt })),
        ].sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json({ success: true, activity });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const blockFarmer = async (req, res) => {
    try {
        const farmer = await User.findByPk(req.params.id);
        if (!farmer) return res.status(404).json({ success: false, message: 'Farmer not found' });
        await farmer.update({ isAccountVerified: !farmer.isAccountVerified });
        res.json({ success: true, message: farmer.isAccountVerified ? 'Farmer unblocked' : 'Farmer blocked' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const sendFarmerMessage = async (req, res) => {
    try {
        // Placeholder - integrates with existing notification service
        res.json({ success: true, message: 'Message sent to farmer' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ═══════════════════════════════════════════
// BOOKINGS
// ═══════════════════════════════════════════

export const getSupportBookings = async (req, res) => {
    try {
        const { page = 1, limit = 25, status, search, dateFrom, dateTo } = req.query;
        const where = {};
        if (status) where.status = status;
        if (dateFrom || dateTo) {
            where.visitDate = {};
            if (dateFrom) where.visitDate[Op.gte] = new Date(dateFrom);
            if (dateTo) where.visitDate[Op.lte] = new Date(dateTo);
        }
        if (search) {
            where[Op.or] = [
                { fullName: { [Op.iLike]: `%${search}%` } },
                { phone: { [Op.iLike]: `%${search}%` } }
            ];
        }

        const offset = (parseInt(page) - 1) * parseInt(limit);
        const { count, rows } = await Booking.findAndCountAll({
            where, offset, limit: parseInt(limit),
            include: [
                { model: User, as: 'Farmer', attributes: ['id','name','phone','email'] }
            ],
            order: [['visitDate', 'ASC']]
        });

        // Today's bookings
        const today = new Date(); today.setHours(0,0,0,0);
        const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate()+1);
        const todayBookings = await Booking.count({ where: { visitDate: { [Op.gte]: today, [Op.lt]: tomorrow } } });
        const upcomingBookings = await Booking.count({ where: { visitDate: { [Op.gte]: tomorrow }, status: { [Op.in]: ['Pending','Confirmed'] } } });
        const completedBookings = await Booking.count({ where: { status: 'Completed' } });
        const cancelledBookings = await Booking.count({ where: { status: 'Cancelled' } });

        res.json({
            success: true, bookings: rows, total: count,
            page: parseInt(page), totalPages: Math.ceil(count / parseInt(limit)),
            stats: { today: todayBookings, upcoming: upcomingBookings, completed: completedBookings, cancelled: cancelledBookings }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateSupportBooking = async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.id);
        if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
        await booking.update(req.body);
        res.json({ success: true, booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const sendBookingReminder = async (req, res) => {
    try {
        res.json({ success: true, message: 'Reminder sent' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ═══════════════════════════════════════════
// TEMPLATES
// ═══════════════════════════════════════════

export const getTemplates = async (req, res) => {
    try {
        const { category } = req.query;
        const where = { isActive: true };
        if (category) where.category = category;
        const templates = await ReplyTemplate.findAll({ where, order: [['category','ASC'],['name','ASC']] });
        res.json({ success: true, templates });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createTemplate = async (req, res) => {
    try {
        const template = await ReplyTemplate.create({ ...req.body, createdBy: req.userId });
        res.json({ success: true, template });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateTemplate = async (req, res) => {
    try {
        const template = await ReplyTemplate.findByPk(req.params.id);
        if (!template) return res.status(404).json({ success: false, message: 'Template not found' });
        await template.update(req.body);
        res.json({ success: true, template });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteTemplate = async (req, res) => {
    try {
        const template = await ReplyTemplate.findByPk(req.params.id);
        if (!template) return res.status(404).json({ success: false, message: 'Template not found' });
        await template.update({ isActive: false });
        res.json({ success: true, message: 'Template deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ═══════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════

export const sendSupportNotification = async (req, res) => {
    try {
        const { title, message, channel, targetType, targetFilter, targetIds, scheduledAt } = req.body;
        const log = await NotificationLog.create({
            title, message, channel: channel || 'email',
            targetType: targetType || 'all',
            targetFilter: targetFilter || {},
            targetIds: targetIds || [],
            scheduledAt: scheduledAt || null,
            status: scheduledAt ? 'scheduled' : 'sent',
            sentAt: scheduledAt ? null : new Date(),
            createdBy: req.userId
        });
        res.json({ success: true, notification: log });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getNotificationHistory = async (req, res) => {
    try {
        const { page = 1, limit = 25 } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);
        const { count, rows } = await NotificationLog.findAndCountAll({
            offset, limit: parseInt(limit),
            include: [{ model: AdminUser, as: 'Sender', attributes: ['id','name'] }],
            order: [['createdAt', 'DESC']]
        });
        res.json({ success: true, notifications: rows, total: count, page: parseInt(page), totalPages: Math.ceil(count / parseInt(limit)) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ═══════════════════════════════════════════
// REPORTS
// ═══════════════════════════════════════════

export const getReportsDashboard = async (req, res) => {
    try {
        const { from, to } = req.query;
        const dateFilter = {};
        if (from) dateFilter[Op.gte] = new Date(from);
        if (to) dateFilter[Op.lte] = new Date(to);
        const where = Object.keys(dateFilter).length ? { createdAt: dateFilter } : {};

        const [totalCreated, avgResolution, firstResponse, slaBreach, byCategory, byStatus] = await Promise.all([
            SupportTicket.count({ where }),
            SupportTicket.findAll({ where: { ...where, resolvedAt: { [Op.ne]: null } },
                attributes: [[sequelize.literal('AVG(EXTRACT(EPOCH FROM (resolved_at - created_at))/3600)'), 'avgHrs']], raw: true }),
            SupportTicket.findAll({ where: { ...where, firstResponseAt: { [Op.ne]: null } },
                attributes: [[sequelize.literal('AVG(EXTRACT(EPOCH FROM (first_response_at - created_at))/3600)'), 'avgHrs']], raw: true }),
            SupportTicket.count({ where: { ...where, slaBreached: true } }),
            SupportTicket.findAll({ where, attributes: ['category', [sequelize.fn('COUNT','id'),'count']], group: ['category'], raw: true }),
            SupportTicket.findAll({ where, attributes: ['status', [sequelize.fn('COUNT','id'),'count']], group: ['status'], raw: true })
        ]);

        res.json({
            success: true,
            report: {
                totalCreated,
                avgResolutionHrs: Math.round((avgResolution[0]?.avgHrs || 0) * 10) / 10,
                avgFirstResponseHrs: Math.round((firstResponse[0]?.avgHrs || 0) * 10) / 10,
                slaBreachCount: slaBreach,
                byCategory, byStatus
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAgentPerformanceReport = async (req, res) => {
    try {
        const agents = await AdminUser.findAll({
            where: { isActive: true, role: { [Op.in]: ['support_agent','support_manager'] } },
            attributes: ['id','name','avatar','role','status']
        });

        const report = await Promise.all(agents.map(async (agent) => {
            const assigned = await SupportTicket.count({ where: { assignedTo: agent.id } });
            const resolved = await SupportTicket.count({ where: { assignedTo: agent.id, status: 'resolved' } });
            const ratings = await SupportTicket.findAll({
                where: { assignedTo: agent.id, farmerRating: { [Op.ne]: null } },
                attributes: [[sequelize.fn('AVG', sequelize.col('farmer_rating')),'avg'],[sequelize.fn('COUNT','id'),'cnt']],
                raw: true
            });
            const slaMet = await SupportTicket.count({ where: { assignedTo: agent.id, slaBreached: false, status: { [Op.in]: ['resolved','closed'] } } });
            const slaTotal = await SupportTicket.count({ where: { assignedTo: agent.id, status: { [Op.in]: ['resolved','closed'] } } });

            return {
                ...agent.toJSON(), ticketsAssigned: assigned, ticketsResolved: resolved,
                rating: Math.round((ratings[0]?.avg || 0) * 10) / 10,
                ratingCount: parseInt(ratings[0]?.cnt || 0),
                slaMetPct: slaTotal ? Math.round((slaMet / slaTotal) * 100) : 100
            };
        }));

        res.json({ success: true, agents: report });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getTicketAnalytics = async (req, res) => {
    try {
        const thirtyDaysAgo = new Date(); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const volumeTrend = await SupportTicket.findAll({
            where: { createdAt: { [Op.gte]: thirtyDaysAgo } },
            attributes: [
                [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: [sequelize.fn('DATE', sequelize.col('created_at'))],
            order: [[sequelize.fn('DATE', sequelize.col('created_at')), 'ASC']],
            raw: true
        });

        const satisfaction = await SupportTicket.findAll({
            where: { farmerRating: { [Op.ne]: null } },
            attributes: ['farmerRating', [sequelize.fn('COUNT','id'),'count']],
            group: ['farmerRating'], raw: true
        });

        res.json({ success: true, volumeTrend, satisfaction });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const exportReportData = async (req, res) => {
    try {
        const tickets = await SupportTicket.findAll({
            include: [
                { model: User, as: 'Farmer', attributes: ['name','phone','district'] },
                { model: AdminUser, as: 'AssignedAgent', attributes: ['name'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json({ success: true, data: tickets });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ═══════════════════════════════════════════
// AGENTS
// ═══════════════════════════════════════════

export const getAgents = async (req, res) => {
    try {
        const agents = await AdminUser.findAll({ order: [['name','ASC']] });
        const today = new Date(); today.setHours(0,0,0,0);

        const agentsWithStats = await Promise.all(agents.map(async (agent) => {
            const openTickets = await SupportTicket.count({ where: { assignedTo: agent.id, status: { [Op.in]: ['open','in_progress','waiting'] } } });
            const resolvedToday = await SupportTicket.count({ where: { assignedTo: agent.id, status: 'resolved', resolvedAt: { [Op.gte]: today } } });
            const ratings = await SupportTicket.findAll({
                where: { assignedTo: agent.id, farmerRating: { [Op.ne]: null } },
                attributes: [[sequelize.fn('AVG', sequelize.col('farmer_rating')),'avg']],
                raw: true
            });
            const a = agent.toJSON();
            delete a.password;
            return { ...a, openTickets, resolvedToday, rating: Math.round((ratings[0]?.avg || 0) * 10) / 10 };
        }));

        res.json({ success: true, agents: agentsWithStats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createAgent = async (req, res) => {
    try {
        const { name, email, phone, password, role, assignedDistricts, languagesSpoken } = req.body;
        const existing = await AdminUser.findOne({ where: { email } });
        if (existing) return res.status(400).json({ success: false, message: 'Email already exists' });

        const hashedPassword = await bcrypt.hash(password || 'agent123', 10);
        const agent = await AdminUser.create({
            name, email, phone, password: hashedPassword,
            role: role || 'support_agent',
            assignedDistricts: assignedDistricts || [],
            languagesSpoken: languagesSpoken || ['en']
        });

        const result = agent.toJSON();
        delete result.password;
        res.json({ success: true, agent: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateAgent = async (req, res) => {
    try {
        const agent = await AdminUser.findByPk(req.params.id);
        if (!agent) return res.status(404).json({ success: false, message: 'Agent not found' });

        const updates = { ...req.body };
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        } else {
            delete updates.password;
        }
        await agent.update(updates);

        const result = agent.toJSON();
        delete result.password;
        res.json({ success: true, agent: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateAgentStatus = async (req, res) => {
    try {
        const agent = await AdminUser.findByPk(req.params.id);
        if (!agent) return res.status(404).json({ success: false, message: 'Agent not found' });
        await agent.update({ status: req.body.status });
        res.json({ success: true, agent: { id: agent.id, status: agent.status } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ═══════════════════════════════════════════
// SLA CONFIG
// ═══════════════════════════════════════════

export const getSLAConfig = async (req, res) => {
    try {
        const config = await SLAConfig.findAll({ order: [['firstResponseMins', 'ASC']] });
        res.json({ success: true, config });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateSLAConfig = async (req, res) => {
    try {
        const { configs } = req.body; // Array of {priority, firstResponseMins, resolutionMins, escalateAfterMins}
        if (!configs || !Array.isArray(configs)) {
            return res.status(400).json({ success: false, message: 'configs array required' });
        }
        for (const c of configs) {
            await SLAConfig.upsert({
                priority: c.priority,
                firstResponseMins: c.firstResponseMins,
                resolutionMins: c.resolutionMins,
                escalateAfterMins: c.escalateAfterMins
            });
        }
        const config = await SLAConfig.findAll({ order: [['firstResponseMins', 'ASC']] });
        res.json({ success: true, config });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
