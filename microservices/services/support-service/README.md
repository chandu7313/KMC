# 🎧 support-service — Helpdesk, Tickets & SLA Management

> Complete customer service helpdesk with ticket lifecycle management, agent assignment, reply templates, SLA monitoring, and performance analytics.

## What This Service Does

- Ticket lifecycle management (create, assign, escalate, resolve, close)
- Threaded customer-agent messaging and internal private notes
- Automatic SLA monitoring and breach detection
- Support agent management and performance metrics
- Canned response / reply template management
- Full audit activity logs for all ticket interactions

## Port: 3011

## Database Tables Owned

| Model | Table | Purpose |
|-------|-------|---------|
| SupportTicket | support_tickets | Core support tickets with priority, status, assigned agent |
| TicketMessage | ticket_messages | Chat messages exchanged between farmer and agent |
| TicketActivity | ticket_activities | Audit log tracking status transitions and events |
| ReplyTemplate | reply_templates | Pre-defined canned replies for agents |
| SLAConfig | sla_configs | SLA deadline configurations by ticket priority |
| AgentPerformance | agent_performances | Metrics on agent response times and resolutions |

## API Endpoints

### Ticket Endpoints (`/api/support/tickets/*`)

| Method | Path (via Nginx) | Auth | Permission | Description |
|--------|-----------------|------|------------|-------------|
| GET | `/api/support/tickets/dashboard` | JWT | `support:read` | Overview dashboard of open/pending tickets |
| GET | `/api/support/tickets/` | JWT | `support:read` | List tickets with status and priority filters |
| POST | `/api/support/tickets/` | JWT | `support:write` | Create a new support ticket |
| GET | `/api/support/tickets/:id` | JWT | `support:read` | Get ticket details and conversation thread |
| PUT | `/api/support/tickets/:id` | JWT | `support:write` | Update ticket metadata |
| DELETE | `/api/support/tickets/:id` | JWT | `support:admin` | Delete support ticket |
| POST | `/api/support/tickets/:id/assign` | JWT | `support:admin` | Assign ticket to an agent |
| POST | `/api/support/tickets/:id/escalate` | JWT | `support:write` | Escalate ticket priority |
| POST | `/api/support/tickets/:id/resolve` | JWT | `support:write` | Mark ticket as resolved |
| POST | `/api/support/tickets/:id/close` | JWT | `support:write` | Close ticket |
| GET | `/api/support/tickets/:id/messages` | JWT | `support:read` | List all messages for ticket |
| POST | `/api/support/tickets/:id/messages` | JWT | `support:write` | Post a reply message |
| POST | `/api/support/tickets/:id/notes` | JWT | `support:write` | Add internal staff note |
| GET | `/api/support/tickets/:id/activity` | JWT | `support:read` | View audit trail of changes |

### Management Endpoints (`/api/support/manage/*`)

| Method | Path (via Nginx) | Auth | Permission | Description |
|--------|-----------------|------|------------|-------------|
| GET | `/api/support/manage/reports/dashboard` | JWT | `support:admin` | Executive support analytics |
| GET | `/api/support/manage/reports/agents` | JWT | `support:admin` | Agent efficiency reports |
| GET | `/api/support/manage/agents` | JWT | `support:admin` | List all support agents |
| POST | `/api/support/manage/agents` | JWT | `support:admin` | Onboard new support agent |
| PUT | `/api/support/manage/agents/:id` | JWT | `support:admin` | Update agent details |
| PUT | `/api/support/manage/agents/:id/status` | JWT | `support:write` | Update agent active/away status |
| GET | `/api/support/manage/settings/sla` | JWT | `support:admin` | Get SLA configuration thresholds |
| PUT | `/api/support/manage/settings/sla` | JWT | `support:admin` | Update SLA configuration thresholds |

## RabbitMQ Events Published

| Exchange | Event | When |
|----------|-------|------|
| `kissan.support` | `ticket.created` | New ticket opened by user |
| `kissan.support` | `ticket.assigned` | Ticket assigned to staff |
| `kissan.support` | `ticket.resolved` | Issue marked as resolved |
| `kissan.support` | `sla.breached` | SLA time limit expired without response |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Service port (default: 3011) |
| `JWT_SECRET` | Yes | Authentication secret |
| `SUPABASE_REST_URL` | Yes | PostgreSQL connection URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase API role key |
| `RABBITMQ_URL` | Yes | RabbitMQ AMQP URI |

## Testing

```bash
# Health check
curl http://localhost:3011/health

# Prometheus metrics
curl http://localhost:3011/metrics

# Create a ticket
curl -X POST http://localhost/api/support/tickets/ \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"subject": "App Crash on Scanning", "category": "technical", "priority": "high", "description": "App closes when opening camera."}'
```
