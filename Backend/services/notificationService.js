// ─────────────────────────────────────────────────────────────
// Kissan Mithar Consultancy — Notification Service
// ─────────────────────────────────────────────────────────────
// Handles all 4 booking notifications:
//   1. SMS to Farmer    → controlled by ENABLE_SMS env flag
//   2. SMS to Admin     → controlled by ENABLE_SMS env flag
//   3. Email to Farmer  → always active
//   4. Email to Admin   → always active
//
// Each notification is wrapped in its own try/catch so one
// failure never blocks the others.
// ─────────────────────────────────────────────────────────────

import axios from 'axios';
import nodemailer from 'nodemailer';
import { FARMER_BOOKING_TEMPLATE, ADMIN_BOOKING_TEMPLATE } from './emailTemplates.js';

// ─────────────────────────────────────
// Email Transporter (Nodemailer)
// ─────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false, // true for 465, false for 587 (STARTTLS)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ─────────────────────────────────────────────────────────────
// SMS FUNCTIONS (Fast2SMS — Quick SMS route, no DLT required)
// ─────────────────────────────────────────────────────────────

/**
 * Send booking confirmation SMS to the farmer.
 */
const sendSMSToFarmer = async (phone, expertName, date, time) => {
  const message =
    `Dear Farmer, your call with ${expertName} is confirmed ` +
    `for ${date} at ${time}. We will call you on this number. ` +
    `- Kissan Mithar Consultancy`;

  const response = await axios.post(
    'https://www.fast2sms.com/dev/bulkV2',
    {
      route: 'q',
      message: message,
      language: 'english',
      flash: 0,
      numbers: phone.replace('+91', ''),
    },
    {
      headers: { authorization: process.env.FAST2SMS_API_KEY },
    }
  );

  if (!response.data || response.data.return !== true) {
    throw new Error(response.data?.message || 'Fast2SMS API error');
  }

  return response.data;
};

/**
 * Send new-booking alert SMS to the admin.
 */
const sendSMSToAdmin = async (farmerName, farmerPhone, expertName, date, time, bookingRef) => {
  const message =
    `New Call Booking! ` +
    `Farmer: ${farmerName} (${farmerPhone}) ` +
    `booked call with ${expertName} ` +
    `on ${date} at ${time}. ` +
    `Ref: ${bookingRef} ` +
    `- Kissan Mithar`;

  const adminPhone = process.env.ADMIN_PHONE;
  if (!adminPhone) {
    throw new Error('ADMIN_PHONE not configured in .env');
  }

  const response = await axios.post(
    'https://www.fast2sms.com/dev/bulkV2',
    {
      route: 'q',
      message: message,
      language: 'english',
      flash: 0,
      numbers: adminPhone.replace('+91', ''),
    },
    {
      headers: { authorization: process.env.FAST2SMS_API_KEY },
    }
  );

  if (!response.data || response.data.return !== true) {
    throw new Error(response.data?.message || 'Fast2SMS API error');
  }

  return response.data;
};

// ─────────────────────────────────────────────────────────────
// EMAIL FUNCTIONS (Nodemailer)
// ─────────────────────────────────────────────────────────────

/**
 * Replaces all {{placeholder}} tokens in a template string.
 */
const fillTemplate = (template, data) => {
  let result = template;
  for (const [key, value] of Object.entries(data)) {
    // Replace all occurrences of {{key}}
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value || '');
  }
  return result;
};

/**
 * Send booking confirmation email to the farmer.
 */
const sendEmailToFarmer = async ({ farmerName, farmerEmail, farmerPhone, expertName, date, time, bookingRef }) => {
  const html = fillTemplate(FARMER_BOOKING_TEMPLATE, {
    farmerName,
    expertName,
    date,
    time,
    farmerPhone,
    bookingRef,
  });

  const mailOptions = {
    from: `"Kissan Mithar Consultancy" <${process.env.EMAIL_USER}>`,
    to: farmerEmail,
    subject: `✅ Call Confirmed with ${expertName} — Kissan Mithar`,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('Farmer email sent:', info.messageId);
  return info;
};

/**
 * Send new-booking alert email to the admin.
 */
const sendEmailToAdmin = async ({ farmerName, farmerPhone, farmerEmail, expertName, date, time, bookingRef }) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    throw new Error('ADMIN_EMAIL not configured in .env');
  }

  // Human-readable "booked at" timestamp
  const bookedAt = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  // Admin dashboard link (update domain in production)
  const adminDashboardUrl =
    process.env.ADMIN_DASHBOARD_URL
      ? `${process.env.ADMIN_DASHBOARD_URL}/admin/consultations/${bookingRef}`
      : `#`;

  const html = fillTemplate(ADMIN_BOOKING_TEMPLATE, {
    farmerName,
    farmerPhone,
    farmerEmail,
    expertName,
    date,
    time,
    bookingRef,
    bookedAt,
    adminDashboardUrl,
  });

  const mailOptions = {
    from: `"Kissan Mithar Alerts" <${process.env.EMAIL_USER}>`,
    to: adminEmail,
    subject: `🔔 New Call Booking — ${farmerName} | Ref: #${bookingRef}`,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('Admin email sent:', info.messageId);
  return info;
};

// ─────────────────────────────────────────────────────────────
// MAIN EXPORT — sendBookingNotifications
// ─────────────────────────────────────────────────────────────
// Sends all 4 notifications. Each one is independent — if one
// fails, the rest still execute. Returns a results object.
// ─────────────────────────────────────────────────────────────

const sendBookingNotifications = async ({
  farmerName,
  farmerPhone,
  farmerEmail,
  expertName,
  date,
  time,
  bookingRef,
}) => {
  const results = {
    farmerSMS: null,
    adminSMS: null,
    farmerEmail: null,
    adminEmail: null,
  };

  // ─────────────────────────────────────
  // SMS SECTION (controlled by env flag)
  // ─────────────────────────────────────
  if (process.env.ENABLE_SMS === 'true') {
    // SMS to Farmer
    try {
      await sendSMSToFarmer(farmerPhone, expertName, date, time);
      results.farmerSMS = 'sent';
    } catch (err) {
      results.farmerSMS = 'failed: ' + err.message;
      console.error('Farmer SMS failed:', err.message);
      // Do not throw — continue to next notification
    }

    // SMS to Admin
    try {
      await sendSMSToAdmin(farmerName, farmerPhone, expertName, date, time, bookingRef);
      results.adminSMS = 'sent';
    } catch (err) {
      results.adminSMS = 'failed: ' + err.message;
      console.error('Admin SMS failed:', err.message);
    }
  } else {
    results.farmerSMS = 'disabled';
    results.adminSMS = 'disabled';
    console.log('📵 SMS disabled via ENABLE_SMS flag');
  }

  // ─────────────────────────────────────
  // EMAIL SECTION (always active)
  // ─────────────────────────────────────

  // Email to Farmer
  try {
    await sendEmailToFarmer({
      farmerName,
      farmerEmail,
      farmerPhone,
      expertName,
      date,
      time,
      bookingRef,
    });
    results.farmerEmail = 'sent';
  } catch (err) {
    results.farmerEmail = 'failed: ' + err.message;
    console.error('Farmer email failed:', err.message);
  }

  // Email to Admin
  try {
    await sendEmailToAdmin({
      farmerName,
      farmerPhone,
      farmerEmail,
      expertName,
      date,
      time,
      bookingRef,
    });
    results.adminEmail = 'sent';
  } catch (err) {
    results.adminEmail = 'failed: ' + err.message;
    console.error('Admin email failed:', err.message);
  }

  // Log final result
  console.log('📋 Notification results:', results);
  return results;
};

export default sendBookingNotifications;
