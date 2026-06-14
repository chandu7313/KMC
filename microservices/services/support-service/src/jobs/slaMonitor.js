import { createLogger } from '@kissan/shared';
import ticketRepo from '../repositories/ticket.repository.js';

const logger = createLogger('support-service');

const SLA_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

const checkSLABreaches = async () => {
  try {
    const breachedTickets = await ticketRepo.findBreachedNotMarked();

    if (!breachedTickets?.length) return;

    logger.info(`SLA monitor found ${breachedTickets.length} breached tickets`);

    for (const ticket of breachedTickets) {
      const ticketRef = ticket.ticketRef || ticket.ticket_ref;

      // Mark as breached
      await ticketRepo.updateTicket(ticket.id, { slaBreached: true });

      // Log activity
      await ticketRepo.createActivity({
        ticketId: ticket.id,
        agentName: 'System',
        action: 'sla_breached',
        description: `SLA breached for ${ticket.priority} priority ticket`,
        metadata: {
          dueAt: ticket.slaDueAt || ticket.sla_due_at,
          breachedAt: new Date().toISOString(),
        },
      });

      // Auto-escalate priority
      let newPriority = null;
      if (ticket.priority === 'medium') newPriority = 'high';
      else if (ticket.priority === 'high') newPriority = 'critical';

      if (newPriority) {
        await ticketRepo.updateTicket(ticket.id, { priority: newPriority });
        await ticketRepo.createActivity({
          ticketId: ticket.id,
          agentName: 'System',
          action: 'auto_escalated',
          description: `Auto-escalated from ${ticket.priority} to ${newPriority} due to SLA breach`,
        });
        logger.warn('SLA breached — auto-escalated', { ticketRef, oldPriority: ticket.priority, newPriority });
      } else {
        logger.warn('SLA breached', { ticketRef, priority: ticket.priority });
      }
    }
  } catch (error) {
    logger.error('SLA monitor error', { error: error.message, stack: error.stack });
  }
};

export const startSLAMonitor = () => {
  logger.info('SLA monitor started — checking every 5 minutes');
  // Run initial check after 30s (let DB connections settle)
  setTimeout(checkSLABreaches, 30 * 1000);
  // Then run every 5 minutes
  setInterval(checkSLABreaches, SLA_CHECK_INTERVAL);
};

export default { startSLAMonitor };
