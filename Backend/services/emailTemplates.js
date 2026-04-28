// ─────────────────────────────────────────────────────────────
// Kissan Mithar Consultancy — Call Booking Email Templates
// ─────────────────────────────────────────────────────────────
// Two branded HTML templates:
//   1. FARMER_BOOKING_TEMPLATE  → Sent to farmer on call confirmation
//   2. ADMIN_BOOKING_TEMPLATE   → Sent to admin on new call booking
//
// Placeholder tokens: {{farmerName}}, {{expertName}}, {{date}},
//   {{time}}, {{farmerPhone}}, {{bookingRef}}, {{farmerEmail}}
// ─────────────────────────────────────────────────────────────

/**
 * Email template sent to the farmer when their call is confirmed.
 * 
 * Placeholders:
 *   {{farmerName}}  — Farmer's full name
 *   {{expertName}}  — Expert/Doctor name
 *   {{date}}        — Formatted date string
 *   {{time}}        — Formatted time string
 *   {{farmerPhone}} — Farmer's phone number
 *   {{bookingRef}}  — Booking reference ID (e.g. KM-2847)
 */
export const FARMER_BOOKING_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Call Confirmed — Kissan Mithar</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet" type="text/css">
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      font-family: 'Open Sans', Arial, sans-serif;
      background-color: #F1F8E9;
      -webkit-text-size-adjust: 100%;
    }
    table, td { border-collapse: collapse; }
    img { border: 0; outline: none; text-decoration: none; }
    .wrapper {
      width: 100%;
      background-color: #F1F8E9;
      padding: 40px 0;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }
    .header {
      background: linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%);
      padding: 28px 30px;
      text-align: center;
    }
    .header-text {
      color: #ffffff;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .content {
      padding: 36px 30px 30px;
      color: #333333;
    }
    .greeting {
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 20px;
      color: #333333;
    }
    .checkmark {
      text-align: center;
      font-size: 48px;
      margin: 10px 0 6px;
    }
    .confirm-title {
      text-align: center;
      font-size: 20px;
      font-weight: 700;
      color: #1B5E20;
      margin-bottom: 24px;
    }
    .info-box {
      background-color: #E8F5E9;
      border: 1px solid #C8E6C9;
      border-radius: 10px;
      padding: 22px 24px;
      margin-bottom: 24px;
    }
    .info-row {
      padding: 7px 0;
      font-size: 15px;
      line-height: 1.5;
      color: #333333;
    }
    .info-label {
      font-weight: 600;
      color: #1B5E20;
    }
    .checklist {
      margin: 0 0 24px 0;
      padding: 0 0 0 6px;
    }
    .checklist-title {
      font-size: 15px;
      font-weight: 600;
      color: #333333;
      margin-bottom: 10px;
    }
    .checklist-item {
      font-size: 14px;
      line-height: 1.8;
      color: #555555;
      padding-left: 4px;
    }
    .cancel-note {
      font-size: 13px;
      color: #777777;
      line-height: 1.6;
      padding: 14px 0;
      border-top: 1px solid #E0E0E0;
      margin-top: 10px;
    }
    .footer {
      background-color: #F9FBE7;
      padding: 20px 30px;
      text-align: center;
      border-top: 1px solid #E8F5E9;
    }
    .footer-text {
      font-size: 13px;
      color: #689F38;
      line-height: 1.5;
    }
    @media only screen and (max-width: 620px) {
      .container { width: 94% !important; margin: 0 3%; }
      .content { padding: 24px 20px 20px !important; }
      .info-box { padding: 16px 18px !important; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
      <tr>
        <td valign="top" align="center">
          <table class="container" cellspacing="0" cellpadding="0" border="0">

            <!-- HEADER -->
            <tr>
              <td class="header">
                <span class="header-text">Kissan Mithar 🌿</span>
              </td>
            </tr>

            <!-- BODY -->
            <tr>
              <td class="content">
                <p class="greeting">Dear {{farmerName}},</p>

                <div class="checkmark">✅</div>
                <div class="confirm-title">Your call has been confirmed!</div>

                <!-- Booking Info Box -->
                <div class="info-box">
                  <div class="info-row">
                    <span class="info-label">👨‍⚕️ Expert:</span>&nbsp; {{expertName}}
                  </div>
                  <div class="info-row">
                    <span class="info-label">📅 Date:</span>&nbsp; {{date}}
                  </div>
                  <div class="info-row">
                    <span class="info-label">🕙 Time:</span>&nbsp; {{time}}
                  </div>
                  <div class="info-row">
                    <span class="info-label">📞 We will call you on:</span>&nbsp; {{farmerPhone}}
                  </div>
                  <div class="info-row">
                    <span class="info-label">🔖 Booking ID:</span>&nbsp; #{{bookingRef}}
                  </div>
                </div>

                <!-- Checklist -->
                <div class="checklist-title">📋 Please keep ready:</div>
                <div class="checklist">
                  <div class="checklist-item">• Your recent crop photos</div>
                  <div class="checklist-item">• Farm location details</div>
                  <div class="checklist-item">• Any soil reports if available</div>
                </div>

                <!-- Cancel note -->
                <div class="cancel-note">
                  Need to cancel or reschedule? Reply to this email or call our helpline.<br/>
                  — Kissan Mithar Consultancy
                </div>
              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td class="footer">
                <span class="footer-text">
                  Kissan Mithar Consultancy | Helping farmers grow better 🌾
                </span>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
`;


/**
 * Email template sent to the admin when a new call is booked.
 *
 * Placeholders:
 *   {{farmerName}}  — Farmer's full name
 *   {{farmerPhone}} — Farmer's phone number
 *   {{farmerEmail}} — Farmer's email address
 *   {{expertName}}  — Expert/Doctor name
 *   {{date}}        — Formatted date string
 *   {{time}}        — Formatted time string
 *   {{bookingRef}}  — Booking reference ID (e.g. KM-2847)
 *   {{bookedAt}}    — Human-readable timestamp of when the booking was made
 */
export const ADMIN_BOOKING_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>New Call Booking — Kissan Mithar Admin</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet" type="text/css">
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      font-family: 'Open Sans', Arial, sans-serif;
      background-color: #ECEFF1;
      -webkit-text-size-adjust: 100%;
    }
    table, td { border-collapse: collapse; }
    .wrapper {
      width: 100%;
      background-color: #ECEFF1;
      padding: 40px 0;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }
    .header {
      background: linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%);
      padding: 24px 30px;
      text-align: center;
    }
    .header-text {
      color: #ffffff;
      font-size: 22px;
      font-weight: 700;
    }
    .content {
      padding: 30px;
      color: #333333;
    }
    .page-title {
      font-size: 20px;
      font-weight: 700;
      color: #1B5E20;
      margin-bottom: 16px;
      text-align: center;
    }
    .alert-box {
      background-color: #FFF8E1;
      border: 1px solid #FFE082;
      border-left: 4px solid #FF8F00;
      border-radius: 8px;
      padding: 14px 18px;
      margin-bottom: 22px;
      font-size: 14px;
      color: #E65100;
      font-weight: 600;
    }
    .section-label {
      font-size: 13px;
      font-weight: 700;
      color: #9E9E9E;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 10px;
      padding-bottom: 6px;
      border-bottom: 2px solid #E8F5E9;
    }
    .detail-box {
      background-color: #FAFAFA;
      border: 1px solid #EEEEEE;
      border-radius: 10px;
      padding: 18px 22px;
      margin-bottom: 20px;
    }
    .detail-row {
      padding: 6px 0;
      font-size: 15px;
      line-height: 1.5;
      color: #333333;
    }
    .detail-label {
      font-weight: 600;
      color: #424242;
    }
    .booking-box {
      background-color: #E8F5E9;
      border: 1px solid #C8E6C9;
      border-radius: 10px;
      padding: 18px 22px;
      margin-bottom: 22px;
    }
    .action-btn {
      display: inline-block;
      background: linear-gradient(135deg, #1B5E20 0%, #388E3C 100%);
      color: #ffffff;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 600;
      text-align: center;
      margin-top: 6px;
    }
    .action-wrapper {
      text-align: center;
      margin: 10px 0 8px;
    }
    .footer {
      background-color: #F5F5F5;
      padding: 18px 30px;
      text-align: center;
      border-top: 1px solid #EEEEEE;
    }
    .footer-text {
      font-size: 12px;
      color: #9E9E9E;
    }
    @media only screen and (max-width: 620px) {
      .container { width: 94% !important; margin: 0 3%; }
      .content { padding: 20px !important; }
      .detail-box, .booking-box { padding: 14px 16px !important; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
      <tr>
        <td valign="top" align="center">
          <table class="container" cellspacing="0" cellpadding="0" border="0">

            <!-- HEADER -->
            <tr>
              <td class="header">
                <span class="header-text">Kissan Mithar — Admin Alerts 🔔</span>
              </td>
            </tr>

            <!-- BODY -->
            <tr>
              <td class="content">

                <div class="page-title">New Call Booking Request</div>

                <!-- Alert -->
                <div class="alert-box">
                  ⚠️ Action Required: A farmer has booked a consultation call
                </div>

                <!-- Farmer Details -->
                <div class="section-label">Farmer Details</div>
                <div class="detail-box">
                  <div class="detail-row">
                    <span class="detail-label">👤 Farmer:</span>&nbsp; {{farmerName}}
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📱 Phone:</span>&nbsp; {{farmerPhone}}
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📧 Email:</span>&nbsp; {{farmerEmail}}
                  </div>
                </div>

                <!-- Booking Details -->
                <div class="section-label">Booking Details</div>
                <div class="booking-box">
                  <div class="detail-row">
                    <span class="detail-label">👨‍⚕️ Expert:</span>&nbsp; {{expertName}}
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📅 Date:</span>&nbsp; {{date}}
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">🕙 Time:</span>&nbsp; {{time}}
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">🔖 Ref ID:</span>&nbsp; #{{bookingRef}}
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">⏰ Booked:</span>&nbsp; {{bookedAt}}
                  </div>
                </div>

                <!-- Action Button -->
                <div class="action-wrapper">
                  <a href="{{adminDashboardUrl}}" class="action-btn" target="_blank">
                    View in Admin Dashboard →
                  </a>
                </div>

              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td class="footer">
                <span class="footer-text">
                  Kissan Mithar Admin Alerts — Internal use only
                </span>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
`;
