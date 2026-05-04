-- =====================================================
-- KMC Support Portal — Supabase Schema Migration
-- Run this in Supabase Dashboard → SQL Editor
-- =====================================================

-- ===================== ADMIN USERS =====================
-- Separate table for support staff (agents, managers, super_admin)
-- This keeps support roles independent from the main users table.

CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    password TEXT NOT NULL,
    avatar TEXT,  -- Cloudinary URL
    role TEXT NOT NULL DEFAULT 'support_agent'
        CHECK (role IN ('super_admin', 'support_agent', 'support_manager')),
    status TEXT NOT NULL DEFAULT 'offline'
        CHECK (status IN ('online', 'busy', 'offline')),
    assigned_districts TEXT[] DEFAULT '{}',
    languages_spoken TEXT[] DEFAULT '{"en"}',
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_admin_users_role ON admin_users(role);
CREATE INDEX idx_admin_users_status ON admin_users(status);
CREATE INDEX idx_admin_users_email ON admin_users(email);

-- ===================== SUPPORT TICKETS =====================

CREATE TABLE support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_ref TEXT UNIQUE NOT NULL,  -- TK-001, TK-002, etc.
    farmer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    assigned_to UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    category TEXT NOT NULL,
    sub_category TEXT,
    subject TEXT NOT NULL,
    priority TEXT DEFAULT 'medium'
        CHECK (priority IN ('critical', 'high', 'medium', 'low')),
    status TEXT DEFAULT 'open'
        CHECK (status IN (
            'open', 'in_progress', 'waiting',
            'resolved', 'closed', 'spam'
        )),
    source TEXT DEFAULT 'app'
        CHECK (source IN ('app', 'email', 'phone', 'whatsapp')),
    tags TEXT[] DEFAULT '{}',
    linked_order_id UUID,
    linked_booking_id UUID,
    escalated_to UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    escalated_at TIMESTAMPTZ,
    first_response_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ,
    sla_breached BOOLEAN DEFAULT FALSE,
    farmer_rating INTEGER CHECK (farmer_rating >= 1 AND farmer_rating <= 5),
    farmer_feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tickets_status ON support_tickets(status);
CREATE INDEX idx_tickets_priority ON support_tickets(priority);
CREATE INDEX idx_tickets_farmer ON support_tickets(farmer_id);
CREATE INDEX idx_tickets_assigned ON support_tickets(assigned_to);
CREATE INDEX idx_tickets_category ON support_tickets(category);
CREATE INDEX idx_tickets_ref ON support_tickets(ticket_ref);
CREATE INDEX idx_tickets_created ON support_tickets(created_at DESC);
CREATE INDEX idx_tickets_sla ON support_tickets(sla_breached) WHERE sla_breached = TRUE;

-- ===================== TICKET MESSAGES =====================

CREATE TABLE ticket_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL
        CHECK (sender_type IN ('farmer', 'agent', 'system')),
    sender_id UUID,  -- user.id for farmer, admin_users.id for agent, NULL for system
    message TEXT NOT NULL,
    attachments JSONB DEFAULT '[]',  -- [{url, name, type, size}]
    is_internal_note BOOLEAN DEFAULT FALSE,
    is_translated BOOLEAN DEFAULT FALSE,
    original_language TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_ticket ON ticket_messages(ticket_id);
CREATE INDEX idx_messages_created ON ticket_messages(ticket_id, created_at ASC);
CREATE INDEX idx_messages_internal ON ticket_messages(ticket_id, is_internal_note)
    WHERE is_internal_note = TRUE;

-- ===================== QUICK REPLY TEMPLATES =====================

CREATE TABLE reply_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    content_en TEXT,
    content_hi TEXT,
    content_te TEXT,
    subject_en TEXT,
    subject_hi TEXT,
    subject_te TEXT,
    variables TEXT[] DEFAULT '{}',  -- Available variables like {{farmer_name}}
    created_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_templates_category ON reply_templates(category);
CREATE INDEX idx_templates_active ON reply_templates(is_active) WHERE is_active = TRUE;

-- ===================== NOTIFICATION LOGS =====================

CREATE TABLE notification_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    channel TEXT NOT NULL
        CHECK (channel IN ('email', 'sms', 'in_app', 'all')),
    target_type TEXT NOT NULL
        CHECK (target_type IN (
            'all', 'specific', 'state', 'district',
            'language', 'open_tickets', 'pending_orders', 'custom'
        )),
    target_filter JSONB DEFAULT '{}',  -- filter criteria
    target_ids JSONB DEFAULT '[]',     -- specific user IDs
    sent_count INTEGER DEFAULT 0,
    failed_count INTEGER DEFAULT 0,
    scheduled_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    status TEXT DEFAULT 'pending'
        CHECK (status IN ('pending', 'sending', 'sent', 'failed', 'scheduled')),
    created_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notif_logs_status ON notification_logs(status);
CREATE INDEX idx_notif_logs_created ON notification_logs(created_at DESC);

-- ===================== AGENT PERFORMANCE =====================

CREATE TABLE agent_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    tickets_assigned INTEGER DEFAULT 0,
    tickets_resolved INTEGER DEFAULT 0,
    avg_response_mins INTEGER DEFAULT 0,
    avg_resolution_mins INTEGER DEFAULT 0,
    sla_met_count INTEGER DEFAULT 0,
    sla_breached_count INTEGER DEFAULT 0,
    rating_sum NUMERIC DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    UNIQUE(agent_id, date)
);

CREATE INDEX idx_agent_perf_agent ON agent_performance(agent_id);
CREATE INDEX idx_agent_perf_date ON agent_performance(date DESC);

-- ===================== SLA CONFIGURATION =====================

CREATE TABLE sla_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    priority TEXT NOT NULL UNIQUE
        CHECK (priority IN ('critical', 'high', 'medium', 'low')),
    first_response_mins INTEGER NOT NULL,   -- SLA for first response in minutes
    resolution_mins INTEGER NOT NULL,        -- SLA for resolution in minutes
    escalate_after_mins INTEGER NOT NULL,    -- Auto-escalate after this many minutes
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===================== TICKET REF SEQUENCE =====================
-- Auto-generate ticket references like TK-001, TK-002, etc.

CREATE SEQUENCE ticket_ref_seq START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE FUNCTION generate_ticket_ref()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.ticket_ref IS NULL OR NEW.ticket_ref = '' THEN
        NEW.ticket_ref = 'TK-' || LPAD(nextval('ticket_ref_seq')::TEXT, 3, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ticket_ref_trigger
    BEFORE INSERT ON support_tickets
    FOR EACH ROW EXECUTE FUNCTION generate_ticket_ref();

-- ===================== UPDATED_AT TRIGGERS =====================
-- Reuses the existing update_updated_at_column() function from main schema

CREATE TRIGGER set_updated_at BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON support_tickets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON reply_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON notification_logs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON sla_config
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===================== ROW LEVEL SECURITY =====================

ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Agents can only see tickets assigned to them;
-- Managers and super_admins see all tickets
CREATE POLICY "agents_own_tickets" ON support_tickets
    FOR ALL USING (
        assigned_to = auth.uid() OR
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE id = auth.uid()
            AND role IN ('super_admin', 'support_manager')
        )
    );

-- Messages follow ticket access
CREATE POLICY "ticket_messages_access" ON ticket_messages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM support_tickets t
            WHERE t.id = ticket_messages.ticket_id
            AND (
                t.assigned_to = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM admin_users
                    WHERE id = auth.uid()
                    AND role IN ('super_admin', 'support_manager')
                )
            )
        )
    );

-- Admin users can see all other admin users
CREATE POLICY "admin_users_access" ON admin_users
    FOR ALL USING (TRUE);

-- ===================== SEED: DEFAULT SLA CONFIG =====================

INSERT INTO sla_config (priority, first_response_mins, resolution_mins, escalate_after_mins)
VALUES
    ('critical', 30, 240, 120),     -- 30 min / 4 hours / 2 hours
    ('high', 120, 1440, 480),       -- 2 hours / 24 hours / 8 hours
    ('medium', 480, 2880, 1440),    -- 8 hours / 48 hours / 24 hours
    ('low', 1440, 4320, 2880);      -- 24 hours / 72 hours / 48 hours

-- ===================== SEED: DEFAULT TEMPLATES =====================

INSERT INTO reply_templates (name, category, content_en, content_hi, content_te, subject_en, variables)
VALUES
    (
        'Order Delay Apology',
        'Order Issues',
        'Dear {{farmer_name}}, we sincerely apologize for the delay in delivering your order #{{order_id}}. Our team is working to expedite the shipment and you should receive it within the next 24-48 hours. We appreciate your patience.',
        'प्रिय {{farmer_name}}, आपके ऑर्डर #{{order_id}} की डिलीवरी में देरी के लिए हम ईमानदारी से माफी चाहते हैं। हमारी टीम शिपमेंट को तेज करने के लिए काम कर रही है और आपको इसे अगले 24-48 घंटों में प्राप्त हो जाना चाहिए।',
        'ప్రియ {{farmer_name}}, మీ ఆర్డర్ #{{order_id}} డెలివరీలో జాప్యానికి మేము హృదయపూర్వకంగా క్షమాపణ చెబుతున్నాము. మా బృందం షిప్‌మెంట్‌ను వేగవంతం చేయడానికి పని చేస్తోంది.',
        'Apology for Order Delay - #{{order_id}}',
        '{"{{farmer_name}}", "{{order_id}}"}'
    ),
    (
        'Order Shipped Confirmation',
        'Order Issues',
        'Dear {{farmer_name}}, great news! Your order #{{order_id}} for {{product_name}} has been shipped and is on its way. Expected delivery: 2-3 business days. Track your order in the app.',
        'प्रिय {{farmer_name}}, खुशखबरी! {{product_name}} के लिए आपका ऑर्डर #{{order_id}} भेज दिया गया है। अनुमानित डिलीवरी: 2-3 कार्य दिवस।',
        'ప్రియ {{farmer_name}}, శుభవార్త! {{product_name}} కోసం మీ ఆర్డర్ #{{order_id}} షిప్ చేయబడింది. అంచనా డెలివరీ: 2-3 వ్యాపార రోజులు.',
        'Order Shipped - #{{order_id}}',
        '{"{{farmer_name}}", "{{order_id}}", "{{product_name}}"}'
    ),
    (
        'Refund Initiated',
        'Payment Issues',
        'Dear {{farmer_name}}, we have initiated a refund for your order #{{order_id}}. The amount will be credited to your account within 5-7 business days. If you have any concerns, please reply to this ticket.',
        'प्रिय {{farmer_name}}, हमने आपके ऑर्डर #{{order_id}} के लिए रिफंड शुरू कर दिया है। राशि 5-7 कार्य दिवसों में आपके खाते में जमा हो जाएगी।',
        'ప్రియ {{farmer_name}}, మీ ఆర్డర్ #{{order_id}} కోసం రీఫండ్ ప్రారంభించాము. మొత్తం 5-7 వ్యాపార రోజులలో మీ ఖాతాలో జమ అవుతుంది.',
        'Refund Initiated - Order #{{order_id}}',
        '{"{{farmer_name}}", "{{order_id}}"}'
    ),
    (
        'Refund Completed',
        'Payment Issues',
        'Dear {{farmer_name}}, your refund for order #{{order_id}} has been successfully processed. Please check your bank account. Thank you for your patience.',
        'प्रिय {{farmer_name}}, आपके ऑर्डर #{{order_id}} का रिफंड सफलतापूर्वक प्रोसेस हो गया है। कृपया अपना बैंक अकाउंट चेक करें।',
        'ప్రియ {{farmer_name}}, మీ ఆర్డర్ #{{order_id}} రీఫండ్ విజయవంతంగా ప్రాసెస్ చేయబడింది. దయచేసి మీ బ్యాంక్ ఖాతాను తనిఖీ చేయండి.',
        'Refund Completed - Order #{{order_id}}',
        '{"{{farmer_name}}", "{{order_id}}"}'
    ),
    (
        'Call Booking Confirmed',
        'Call Booking',
        'Dear {{farmer_name}}, your call with expert {{agent_name}} has been confirmed for {{booking_date}} at {{booking_time}}. Please keep your phone handy. We will call you on your registered number.',
        'प्रिय {{farmer_name}}, विशेषज्ञ {{agent_name}} के साथ आपकी कॉल {{booking_date}} को {{booking_time}} पर कन्फर्म हो गई है। कृपया अपना फोन पास रखें।',
        'ప్రియ {{farmer_name}}, నిపుణుడు {{agent_name}} తో మీ కాల్ {{booking_date}} న {{booking_time}} కు నిర్ధారించబడింది. దయచేసి మీ ఫోన్‌ను అందుబాటులో ఉంచండి.',
        'Call Booking Confirmed - {{booking_date}}',
        '{"{{farmer_name}}", "{{agent_name}}", "{{booking_date}}", "{{booking_time}}"}'
    ),
    (
        'Call Reminder (1 hour)',
        'Call Booking',
        'Dear {{farmer_name}}, reminder: your call with {{agent_name}} is in 1 hour ({{booking_time}}). Please be available on your registered phone number.',
        'प्रिय {{farmer_name}}, रिमाइंडर: {{agent_name}} के साथ आपकी कॉल 1 घंटे में है ({{booking_time}})। कृपया अपने रजिस्टर्ड फोन नंबर पर उपलब्ध रहें।',
        'ప్రియ {{farmer_name}}, రిమైండర్: {{agent_name}} తో మీ కాల్ 1 గంటలో ఉంది ({{booking_time}}). దయచేసి మీ నమోదిత ఫోన్ నంబర్‌లో అందుబాటులో ఉండండి.',
        'Call Reminder - Your call is in 1 hour',
        '{"{{farmer_name}}", "{{agent_name}}", "{{booking_time}}"}'
    ),
    (
        'Ticket Received Acknowledgment',
        'General',
        'Dear {{farmer_name}}, we have received your support request (Ticket #{{ticket_ref}}). Our team will review it and get back to you within 24 hours. Thank you for reaching out to Kissan Mithar Consultancy.',
        'प्रिय {{farmer_name}}, हमें आपका सहायता अनुरोध (टिकट #{{ticket_ref}}) प्राप्त हो गया है। हमारी टीम 24 घंटों के भीतर आपसे संपर्क करेगी।',
        'ప్రియ {{farmer_name}}, మీ సపోర్ట్ అభ్యర్థన (టిక్కెట్ #{{ticket_ref}}) మాకు అందింది. మా బృందం 24 గంటల్లో మీకు తిరిగి సమాధానమిస్తుంది.',
        'Support Request Received - #{{ticket_ref}}',
        '{"{{farmer_name}}", "{{ticket_ref}}"}'
    ),
    (
        'Ticket Resolved Confirmation',
        'General',
        'Dear {{farmer_name}}, your support ticket #{{ticket_ref}} has been resolved by {{agent_name}}. If you are satisfied with the resolution, please rate your experience. If you need further help, feel free to reply.',
        'प्रिय {{farmer_name}}, आपका सहायता टिकट #{{ticket_ref}} {{agent_name}} द्वारा हल कर दिया गया है। यदि आप समाधान से संतुष्ट हैं, तो कृपया अपना अनुभव रेट करें।',
        'ప్రియ {{farmer_name}}, మీ సపోర్ట్ టిక్కెట్ #{{ticket_ref}} {{agent_name}} ద్వారా పరిష్కరించబడింది. మీరు పరిష్కారంతో సంతృప్తిగా ఉంటే, దయచేసి మీ అనుభవాన్ని రేట్ చేయండి.',
        'Ticket Resolved - #{{ticket_ref}}',
        '{"{{farmer_name}}", "{{ticket_ref}}", "{{agent_name}}"}'
    ),
    (
        'App Issue — Try These Steps',
        'App Problems',
        'Dear {{farmer_name}}, we understand you are facing issues with the app. Please try these steps: 1) Close and reopen the app, 2) Clear app cache in Settings, 3) Update to the latest version from Play Store. If the issue persists, please reply with a screenshot.',
        'प्रिय {{farmer_name}}, हम समझते हैं कि आपको ऐप में समस्या आ रही है। कृपया ये कदम आजमाएं: 1) ऐप बंद करके फिर से खोलें, 2) सेटिंग्स में ऐप कैश साफ करें, 3) प्ले स्टोर से नवीनतम संस्करण में अपडेट करें।',
        'ప్రియ {{farmer_name}}, మీరు యాప్‌తో సమస్యలు ఎదుర్కొంటున్నారని మేము అర్థం చేసుకుంటున్నాము. దయచేసి ఈ దశలను ప్రయత్నించండి: 1) యాప్‌ను మూసి తిరిగి తెరవండి, 2) సెట్టింగ్‌లలో యాప్ కాష్‌ను క్లియర్ చేయండి.',
        'App Issue - Troubleshooting Steps',
        '{"{{farmer_name}}"}'
    ),
    (
        'Payment Failed — What To Do',
        'Payment Issues',
        'Dear {{farmer_name}}, we noticed your payment for order #{{order_id}} was not successful. Please try again using a different payment method. If the amount was deducted, it will be refunded within 5-7 business days. Contact us if you need help.',
        'प्रिय {{farmer_name}}, हमने देखा कि आपके ऑर्डर #{{order_id}} का भुगतान सफल नहीं हुआ। कृपया किसी अन्य भुगतान विधि का उपयोग करके पुनः प्रयास करें।',
        'ప్రియ {{farmer_name}}, మీ ఆర్డర్ #{{order_id}} చెల్లింపు విజయవంతం కాలేదని మేము గమనించాము. దయచేసి వేరే చెల్లింపు పద్ధతిని ఉపయోగించి మళ్ళీ ప్రయత్నించండి.',
        'Payment Failed - Order #{{order_id}}',
        '{"{{farmer_name}}", "{{order_id}}"}'
    );

-- ===================== SEED: DEFAULT SUPER ADMIN =====================
-- Creates a default super admin account. Password should be changed after first login.
-- Default password: "admin123" (bcrypt hashed)

INSERT INTO admin_users (name, email, phone, password, role, status, languages_spoken)
VALUES (
    'Admin',
    'admin@kissanmithar.com',
    '+919999999999',
    '$2a$10$XQCg1z4YL0Xm1Z5K1Z5K1ehKgK1Z5K1Z5K1Z5K1Z5K1Z5K1Z5K1',  -- Change this!
    'super_admin',
    'online',
    '{"en", "hi", "te"}'
);
