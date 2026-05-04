import { Op } from 'sequelize';
import { sequelize } from '../config/database.js';
import {
    User, SupportTicket, TicketMessage, AdminUser,
    SoilReport, CropDiagnosis, Booking,
    MarketplaceOrder, AgentPerformance, SLAConfig
} from '../models/index.js';

// ═══════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════

export const getDashboardStats = async (req, res) => {
    try {
        const today = new Date(); today.setHours(0,0,0,0);

        const [total, open, inProgress, resolvedToday, allTickets, agents] = await Promise.all([
            SupportTicket.count(),
            SupportTicket.count({ where: { status: 'open' } }),
            SupportTicket.count({ where: { status: 'in_progress' } }),
            SupportTicket.count({ where: { status: 'resolved', resolvedAt: { [Op.gte]: today } } }),
            SupportTicket.findAll({
                where: { firstResponseAt: { [Op.ne]: null } },
                attributes: ['firstResponseAt', 'createdAt'],
                limit: 500, order: [['createdAt', 'DESC']]
            }),
            AdminUser.findAll({ where: { isActive: true }, attributes: ['id','name','avatar','status','role'] })
        ]);

        // Avg response time
        let avgResponseHrs = 0;
        if (allTickets.length) {
            const totalMins = allTickets.reduce((sum, t) => {
                return sum + (new Date(t.firstResponseAt) - new Date(t.createdAt)) / 60000;
            }, 0);
            avgResponseHrs = Math.round((totalMins / allTickets.length / 60) * 10) / 10;
        }

        // Satisfaction
        const ratingResult = await SupportTicket.findAll({
            where: { farmerRating: { [Op.ne]: null } },
            attributes: [
                [sequelize.fn('AVG', sequelize.col('farmer_rating')), 'avgRating'],
                [sequelize.fn('COUNT', sequelize.col('farmer_rating')), 'count']
            ], raw: true
        });
        const satisfaction = ratingResult[0]?.avgRating ? Math.round(ratingResult[0].avgRating * 10) / 10 : 4.5;

        // Ticket volume last 7 days
        const sevenDaysAgo = new Date(); sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const volumeData = await SupportTicket.findAll({
            where: { createdAt: { [Op.gte]: sevenDaysAgo } },
            attributes: [
                [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: [sequelize.fn('DATE', sequelize.col('created_at'))],
            order: [[sequelize.fn('DATE', sequelize.col('created_at')), 'ASC']],
            raw: true
        });

        // Category breakdown
        const categoryData = await SupportTicket.findAll({
            attributes: ['category', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
            group: ['category'], raw: true
        });

        // Recent activity (last 10 events)
        const recentTickets = await SupportTicket.findAll({
            include: [
                { model: User, as: 'Farmer', attributes: ['name'] },
                { model: AdminUser, as: 'AssignedAgent', attributes: ['name'] }
            ],
            order: [['updatedAt', 'DESC']], limit: 10
        });

        // Agent stats
        const agentStats = await Promise.all(agents.map(async (agent) => {
            const openCount = await SupportTicket.count({ where: { assignedTo: agent.id, status: { [Op.in]: ['open','in_progress','waiting'] } } });
            const resolvedCount = await SupportTicket.count({ where: { assignedTo: agent.id, status: 'resolved', resolvedAt: { [Op.gte]: today } } });
            return { ...agent.toJSON(), openTickets: openCount, resolvedToday: resolvedCount };
        }));

        res.json({
            success: true,
            stats: { total, open, inProgress, resolvedToday, avgResponseHrs, satisfaction },
            volumeData, categoryData,
            recentActivity: recentTickets,
            agents: agentStats
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ═══════════════════════════════════════════
// TICKETS
// ═══════════════════════════════════════════

export const getTickets = async (req, res) => {
    try {
        const { page = 1, limit = 25, status, priority, category, assignedTo, search, dateFrom, dateTo, sort = 'createdAt', order = 'DESC' } = req.query;
        const where = {};
        if (status && status !== 'all') where.status = status;
        if (priority && priority !== 'all') where.priority = priority;
        if (category) where.category = category;
        if (assignedTo) where.assignedTo = assignedTo;
        if (req.userRole === 'support_agent') where.assignedTo = req.userId;
        if (search) {
            where[Op.or] = [
                { ticketRef: { [Op.iLike]: `%${search}%` } },
                { subject: { [Op.iLike]: `%${search}%` } },
                { '$Farmer.name$': { [Op.iLike]: `%${search}%` } },
                { '$Farmer.phone$': { [Op.iLike]: `%${search}%` } }
            ];
        }
        if (dateFrom || dateTo) {
            where.createdAt = {};
            if (dateFrom) where.createdAt[Op.gte] = new Date(dateFrom);
            if (dateTo) where.createdAt[Op.lte] = new Date(dateTo);
        }

        const offset = (parseInt(page) - 1) * parseInt(limit);
        const { count, rows } = await SupportTicket.findAndCountAll({
            where, offset, limit: parseInt(limit),
            include: [
                { model: User, as: 'Farmer', attributes: ['id','name','phone','email','district'] },
                { model: AdminUser, as: 'AssignedAgent', attributes: ['id','name','avatar'] }
            ],
            order: [[sort, order]],
            subQuery: false
        });

        res.json({ success: true, tickets: rows, total: count, page: parseInt(page), totalPages: Math.ceil(count / parseInt(limit)) });
    } catch (error) {
        console.error('Get tickets error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createTicket = async (req, res) => {
    try {
        const { farmerId, category, subCategory, subject, priority, source, message, assignedTo } = req.body;
        const ticket = await SupportTicket.create({
            farmerId, category, subCategory, subject,
            priority: priority || 'medium',
            source: source || 'app',
            assignedTo: assignedTo || null
        });

        if (message) {
            await TicketMessage.create({
                ticketId: ticket.id,
                senderType: farmerId ? 'farmer' : 'agent',
                senderId: farmerId || req.userId,
                message
            });
        }

        const fullTicket = await SupportTicket.findByPk(ticket.id, {
            include: [
                { model: User, as: 'Farmer', attributes: ['id','name','phone','email'] },
                { model: AdminUser, as: 'AssignedAgent', attributes: ['id','name'] }
            ]
        });
        res.json({ success: true, ticket: fullTicket });
    } catch (error) {
        console.error('Create ticket error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getTicketById = async (req, res) => {
    try {
        const ticket = await SupportTicket.findByPk(req.params.id, {
            include: [
                { model: User, as: 'Farmer', attributes: ['id','name','phone','email','district','language','createdAt','crops'] },
                { model: AdminUser, as: 'AssignedAgent', attributes: ['id','name','avatar','email','phone'] },
                { model: AdminUser, as: 'EscalatedToAgent', attributes: ['id','name'] }
            ]
        });
        if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });

        // Get SLA config for this priority
        const sla = await SLAConfig.findOne({ where: { priority: ticket.priority } });
        res.json({ success: true, ticket, sla });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateTicket = async (req, res) => {
    try {
        const ticket = await SupportTicket.findByPk(req.params.id);
        if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });

        const { status, priority, category, subCategory, tags, assignedTo } = req.body;
        const updates = {};
        if (status) {
            updates.status = status;
            if (status === 'resolved' && !ticket.resolvedAt) updates.resolvedAt = new Date();
            if (status === 'closed' && !ticket.closedAt) updates.closedAt = new Date();
        }
        if (priority) updates.priority = priority;
        if (category) updates.category = category;
        if (subCategory !== undefined) updates.subCategory = subCategory;
        if (tags) updates.tags = tags;
        if (assignedTo) updates.assignedTo = assignedTo;

        await ticket.update(updates);

        if (status) {
            await TicketMessage.create({
                ticketId: ticket.id, senderType: 'system', senderId: null,
                message: `Ticket status changed to "${status}" by agent`
            });
        }

        res.json({ success: true, ticket });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteTicket = async (req, res) => {
    try {
        const ticket = await SupportTicket.findByPk(req.params.id);
        if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
        await ticket.destroy();
        res.json({ success: true, message: 'Ticket deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const assignTicket = async (req, res) => {
    try {
        const { agentId } = req.body;
        const ticket = await SupportTicket.findByPk(req.params.id);
        if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
        const agent = await AdminUser.findByPk(agentId);
        if (!agent) return res.status(404).json({ success: false, message: 'Agent not found' });

        await ticket.update({ assignedTo: agentId, status: ticket.status === 'open' ? 'in_progress' : ticket.status });
        await TicketMessage.create({
            ticketId: ticket.id, senderType: 'system', senderId: null,
            message: `Ticket assigned to ${agent.name}`
        });
        res.json({ success: true, ticket });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const escalateTicket = async (req, res) => {
    try {
        const { managerId } = req.body;
        const ticket = await SupportTicket.findByPk(req.params.id);
        if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });

        await ticket.update({
            escalatedTo: managerId || null,
            escalatedAt: new Date(),
            priority: ticket.priority === 'low' ? 'medium' : ticket.priority === 'medium' ? 'high' : 'critical'
        });
        const manager = managerId ? await AdminUser.findByPk(managerId) : null;
        await TicketMessage.create({
            ticketId: ticket.id, senderType: 'system', senderId: null,
            message: `Ticket escalated${manager ? ` to ${manager.name}` : ''}. Priority raised to ${ticket.priority}.`
        });
        res.json({ success: true, ticket });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ═══════════════════════════════════════════
// MESSAGES
// ═══════════════════════════════════════════

export const getTicketMessages = async (req, res) => {
    try {
        const messages = await TicketMessage.findAll({
            where: { ticketId: req.params.id },
            order: [['createdAt', 'ASC']]
        });
        res.json({ success: true, messages });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const sendReply = async (req, res) => {
    try {
        const { message, attachments, updateStatus } = req.body;
        const ticket = await SupportTicket.findByPk(req.params.id);
        if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });

        const msg = await TicketMessage.create({
            ticketId: ticket.id, senderType: 'agent', senderId: req.userId,
            message, attachments: attachments || []
        });

        const updates = {};
        if (!ticket.firstResponseAt) updates.firstResponseAt = new Date();
        if (updateStatus === 'resolved') { updates.status = 'resolved'; updates.resolvedAt = new Date(); }
        else if (updateStatus === 'closed') { updates.status = 'closed'; updates.closedAt = new Date(); }
        else if (ticket.status === 'open') { updates.status = 'in_progress'; }
        if (Object.keys(updates).length) await ticket.update(updates);

        res.json({ success: true, message: msg, ticket });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const addInternalNote = async (req, res) => {
    try {
        const { message } = req.body;
        const note = await TicketMessage.create({
            ticketId: req.params.id, senderType: 'agent', senderId: req.userId,
            message, isInternalNote: true
        });
        res.json({ success: true, note });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
