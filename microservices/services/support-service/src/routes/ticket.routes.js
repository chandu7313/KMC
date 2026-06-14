import express from 'express';
import { authenticate, authorize } from '@kissan/shared';
import * as tCtrl from '../controllers/ticket.controller.js';

const router = express.Router();

// All ticket routes require auth
router.use(authenticate);

// Dashboard
router.get('/dashboard', authorize(['support:read']), tCtrl.getDashboard);

// Tickets CRUD
router.get('/', authorize(['support:read']), tCtrl.getTickets);
router.post('/', authorize(['support:write']), tCtrl.createTicket);
router.get('/:id', authorize(['support:read']), tCtrl.getTicketById);
router.put('/:id', authorize(['support:write']), tCtrl.updateTicket);
router.delete('/:id', authorize(['support:admin']), tCtrl.deleteTicket);

// Assignment & escalation
router.post('/:id/assign', authorize(['support:admin']), tCtrl.assignTicket);
router.post('/:id/escalate', authorize(['support:write']), tCtrl.escalateTicket);
router.post('/:id/resolve', authorize(['support:write']), tCtrl.resolveTicket);
router.post('/:id/close', authorize(['support:write']), tCtrl.closeTicket);

// Messages
router.get('/:id/messages', authorize(['support:read']), tCtrl.getMessages);
router.post('/:id/messages', authorize(['support:write']), tCtrl.sendReply);
router.post('/:id/notes', authorize(['support:write']), tCtrl.addInternalNote);

// Activity
router.get('/:id/activity', authorize(['support:read']), tCtrl.getActivity);

export default router;
