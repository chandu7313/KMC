import env from '../config/env.js';

/**
 * OTP service — generates, sends, and verifies OTPs via SMS.
 */
class OtpService {
  generateOtp() {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  async sendSmsOtp(phone, otp) {
    if (!env.enableSms) {
      console.log(`[DEV] OTP for ${phone}: ${otp}`);
      return { success: true };
    }

    try {
      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'Authorization': env.fast2smsApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route: 'otp',
          variables_values: otp,
          numbers: phone,
        }),
      });

      const data = await response.json();
      return { success: data.return === true };
    } catch (error) {
      console.error('SMS send failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  validateOtp(storedOtp, inputOtp, expireAt) {
    if (!storedOtp || storedOtp === '' || storedOtp !== inputOtp) {
      return { valid: false, message: 'Invalid OTP' };
    }
    if (expireAt < Date.now()) {
      return { valid: false, message: 'OTP has expired' };
    }
    return { valid: true };
  }
}

export default new OtpService();
