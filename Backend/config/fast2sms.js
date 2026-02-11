import axios from "axios";
import 'dotenv/config';

/**
 * Sends an SMS using Fast2SMS Quick SMS route (No DLT registration required).
 * @param {string} numbers - Comma separated mobile numbers.
 * @param {string} otp - The OTP code to send.
 */
const sendSMS = async (numbers, otp) => {
    try {
        const apiKey = process.env.FAST2SMS_API_KEY;

        if (!apiKey) {
            console.warn("FAST2SMS_API_KEY is missing in .env. Skipping SMS send.");
            return { success: false, message: "API Key missing" };
        }

        // Using Quick SMS route ('q') as it doesn't require personal DLT registration
        // Documentation: https://www.fast2sms.com/quick-sms-api
        const options = {
            method: 'GET',
            url: 'https://www.fast2sms.com/dev/bulkV2',
            params: {
                "authorization": apiKey,
                "route": "q",
                "message": `Your AgriDust OTP is ${otp}. Valid for 5 minutes.`,
                "language": "english",
                "flash": "0",
                "numbers": numbers,
            }
        };

        const response = await axios(options);

        if (response.data && response.data.return === true) {
            return { success: true, data: response.data };
        } else {
            console.error("Fast2SMS API Response Error:", response.data);
            return { success: false, error: response.data.message || "Unknown API error" };
        }

    } catch (error) {
        console.error("Fast2SMS Connection Error:", error.response?.data || error.message);
        return { success: false, error: error.message };
    }
};

export default sendSMS;
