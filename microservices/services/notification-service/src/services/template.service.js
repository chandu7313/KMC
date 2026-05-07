/**
 * Email templates — extracted from monolith config/emailTemplates.js.
 * All templates use branded Kissan Mithar Consultancy styling.
 */

const BRAND_COLOR = '#22D172';
const BRAND_NAME = 'Kissan Mithar Consultancy';

const baseWrapper = (content) => `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>${BRAND_NAME}</title>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">
  <style>
    body { margin: 0; padding: 0; font-family: 'Open Sans', sans-serif; background: #E5E5E5; }
    table, td { border-collapse: collapse; }
    .container { width: 100%; max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; }
    .header { background: ${BRAND_COLOR}; padding: 20px; text-align: center; color: white; font-size: 22px; font-weight: bold; }
    .content { padding: 30px; color: #333333; font-size: 14px; line-height: 150%; }
    .otp-box { background: ${BRAND_COLOR}; color: #fff; font-size: 24px; font-weight: bold; text-align: center; padding: 15px; border-radius: 8px; margin: 20px 0; letter-spacing: 6px; }
    .footer { padding: 20px; text-align: center; font-size: 12px; color: #777777; background: #f9f9f9; }
    .detail-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .detail-table th, .detail-table td { border: 1px solid #eee; padding: 12px; text-align: left; }
    .detail-table th { background: #f9f9f9; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">${BRAND_NAME}</div>
    <div class="content">${content}</div>
    <div class="footer">
      ${BRAND_NAME} — The Direct-to-Farm Marketplace<br/>
      &copy; ${new Date().getFullYear()} All rights reserved.
    </div>
  </div>
</body>
</html>`;

// ── Email Verification ──
export const getEmailVerifyTemplate = (email, otp) => {
  return baseWrapper(`
    <h2 style="margin: 0 0 16px;">Verify your email</h2>
    <p>You're one step away from verifying your account for: <strong style="color: #4C83EE;">${email}</strong></p>
    <p><strong>Use the OTP below to verify your account:</strong></p>
    <div class="otp-box">${otp}</div>
    <p>This OTP is valid for <strong>24 hours</strong>.</p>
    <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
  `);
};

// ── Password Reset ──
export const getPasswordResetTemplate = (email, otp) => {
  return baseWrapper(`
    <h2 style="margin: 0 0 16px;">Forgot your password?</h2>
    <p>We received a password reset request for: <strong style="color: #4C83EE;">${email}</strong></p>
    <p><strong>Use the OTP below to reset your password:</strong></p>
    <div class="otp-box">${otp}</div>
    <p>This OTP is valid for <strong>15 minutes</strong>.</p>
    <p style="color: #999; font-size: 12px;">If you didn't request this, your account is safe. No changes have been made.</p>
  `);
};

// ── Order Confirmation ──
export const getOrderConfirmationTemplate = ({ name, orderId, address, amount, paymentMethod }) => {
  return baseWrapper(`
    <h2 style="margin: 0 0 16px;">Order Confirmed! 🎉</h2>
    <p>Hello <strong>${name}</strong>,</p>
    <p>Thank you for your order! We've received it and are getting it ready.</p>
    <table class="detail-table">
      <tr><th>Order ID</th><td>#${orderId}</td></tr>
      <tr><th>Amount</th><td>₹${amount}</td></tr>
      <tr><th>Payment</th><td>${paymentMethod}</td></tr>
      <tr><th>Delivery Address</th><td>${address}</td></tr>
    </table>
    <p>If you have questions, reply to this email or contact our support team.</p>
  `);
};

// ── Booking Confirmation ──
export const getBookingConfirmationTemplate = ({ name, date, time, expertName, type }) => {
  return baseWrapper(`
    <h2 style="margin: 0 0 16px;">Consultation Booked! ✅</h2>
    <p>Hello <strong>${name}</strong>,</p>
    <p>Your consultation has been scheduled successfully.</p>
    <table class="detail-table">
      <tr><th>Date</th><td>${date}</td></tr>
      <tr><th>Time</th><td>${time}</td></tr>
      <tr><th>Expert</th><td>${expertName || 'To be assigned'}</td></tr>
      <tr><th>Type</th><td>${type || 'General Consultation'}</td></tr>
    </table>
    <p>Our expert will reach out to you before the scheduled time.</p>
  `);
};

// ── Welcome Email ──
export const getWelcomeTemplate = (name) => {
  return baseWrapper(`
    <h2 style="margin: 0 0 16px;">Welcome to Kissan Mithar! 🌾</h2>
    <p>Hello <strong>${name}</strong>,</p>
    <p>Welcome to Kissan Mithar Consultancy — your trusted agriculture partner.</p>
    <p>Here's what you can do:</p>
    <ul>
      <li>🔬 Get AI-powered crop disease detection</li>
      <li>🧪 Submit soil tests for expert analysis</li>
      <li>📊 Track real-time market prices</li>
      <li>🛒 Shop from our agricultural marketplace</li>
      <li>👨‍🌾 Book expert consultations</li>
    </ul>
    <p>Start exploring now!</p>
  `);
};

// ── Support Ticket ──
export const getTicketCreatedTemplate = ({ name, ticketId, subject, priority }) => {
  return baseWrapper(`
    <h2 style="margin: 0 0 16px;">Support Ticket Created</h2>
    <p>Hello <strong>${name}</strong>,</p>
    <p>We've received your support request and will get back to you shortly.</p>
    <table class="detail-table">
      <tr><th>Ticket ID</th><td>#${ticketId}</td></tr>
      <tr><th>Subject</th><td>${subject}</td></tr>
      <tr><th>Priority</th><td>${priority}</td></tr>
    </table>
    <p>Our support team typically responds within 24 hours.</p>
  `);
};
