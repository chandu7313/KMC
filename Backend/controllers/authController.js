import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/index.js'
import sendSMS from '../config/fast2sms.js'
import transporter from '../config/nodemailer.js'
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from '../config/emailTemplates.js'

// --- MOBILE OTP FUNCTIONS ---

export const sendOtp = async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone) return res.json({ success: false, message: "Phone number is required" });

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        const otpExpireAt = Date.now() + 5 * 60 * 1000;

        // Check if user exists
        const existingUser = await User.findOne({ where: { phone } });

        let isNewUser = false;

        if (existingUser) {
            await existingUser.update({ otp, otpExpireAt });
        } else {
            isNewUser = true;
            await User.create({
                name: "KMC Farmer",
                phone,
                email: `temp_${phone}@agridust.com`,
                otp,
                otpExpireAt
            });
        }

        console.log(`OTP for ${phone}: ${otp}`);
        const smsResponse = await sendSMS(phone, otp);

        if (smsResponse.success) {
            return res.json({ success: true, isNewUser, message: "OTP sent successfully" });
        } else {
            return res.json({ success: false, message: "Failed to send OTP", error: smsResponse.error });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const verifyOtp = async (req, res) => {
    try {
        const { phone, otp, name } = req.body;
        if (!phone || !otp) return res.json({ success: false, message: "Phone and OTP are required" });

        const user = await User.findOne({ where: { phone } });

        if (!user) return res.json({ success: false, message: "User not found" });

        if (user.otp === '' || user.otp !== otp) return res.json({ success: false, message: "Invalid OTP" });
        if (user.otpExpireAt < Date.now()) return res.json({ success: false, message: "OTP Expired" });

        const updateData = {
            isAccountVerified: true,
            otp: '',
            otpExpireAt: 0
        };

        // If name is provided (for new users), update it
        if (name && name !== "User") {
            updateData.name = name;
        }

        await user.update(updateData);

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        const isProduction = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
        res.cookie('token', token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({ success: true, message: "Login Successful" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const autoLogin = async (req, res) => {
    try {
        const { role } = req.body;
        let user;
        
        const adminRoles = [
            'super_admin', 'admin', 'tech_admin', 'agri_expert', 
            'ecommerce_manager', 'order_manager', 'support_agent', 
            'support_manager', 'content_manager', 'finance_manager', 'field_agent'
        ];

        if (adminRoles.includes(role)) {
            const { AdminUser } = await import('../models/index.js');
            const email = `${role}_test@agridust.com`;
            user = await AdminUser.findOne({ where: { email } });
            
            if (!user) {
                user = await AdminUser.create({ 
                    name: `${role.replace('_', ' ').toUpperCase()} TEST`, 
                    email: email, 
                    password: "hashed_password_here", 
                    role: role, 
                    status: 'online' 
                });
            }
        } else if (role === 'farmer') {
             user = await User.findOne({ where: { email: 'amit@example.com' } });
             if (!user) {
                 user = await User.create({ name: "Amit Kumar", email: "amit@example.com", phone: "8888888888", role: 'user', district: "Pune", crops: ["Wheat"], isAccountVerified: true });
             }
        } else if (role === 'field-officer') {
             user = await User.findOne({ where: { email: 'john.fo@agridust.com' } });
             if (!user) {
                 user = await User.create({ name: "John Officer", email: "john.fo@agridust.com", phone: "7777777777", role: 'field-officer', isAccountVerified: true });
             }
        }
        
        if (!user) return res.json({ success: false, message: "User not found" });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })
        const isProduction = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
        res.cookie('token', token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.json({ success: true, message: "Auto Login Successful", user, role })
    } catch(error) {
        return res.json({ success: false, message: error.message });
    }
}

// --- EMAIL/PASSWORD FUNCTIONS ---

export const register = async (req, res) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) return res.json({ success: false, message: "Missing Details" });

    try {
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) return res.json({ success: false, message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({ name, email, password: hashedPassword });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })
        const isProduction = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
        res.cookie('token', token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.json({ success: true })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) return res.json({ success: false, message: "Email and password are required" });

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) return res.json({ success: false, message: "Invalid email" });

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.json({ success: false, message: "Invalid password" });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })
        const isProduction = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
        res.cookie('token', token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.json({ success: true, message: "Login Successful" })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const logout = async (req, res) => {
    try {
        const isProduction = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
        res.clearCookie('token', {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "strict",
        })
        return res.json({ success: true, message: "Logged Out" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const sendVerifyOtp = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findByPk(userId);

        if (user.isAccountVerified) return res.json({ success: false, message: "Account Already Verified" });

        const otp = String(Math.floor(100000 + Math.random() * 900000))

        await user.update({
            verifyOtp: otp,
            verifyOtpExpireAt: Date.now() + 24 * 60 * 60 * 1000
        });

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Account Verification OTP",
            html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        }
        await transporter.sendMail(mailOption)
        res.json({ success: true, message: "Verification OTP sent on your Email" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body
    if (!userId || !otp) return res.json({ success: false, message: "Missing Details" });

    try {
        const user = await User.findByPk(userId);

        if (!user) return res.json({ success: false, message: "User not found" });

        if (user.verifyOtp === '' || user.verifyOtp !== otp) return res.json({ success: false, message: "Invalid OTP" });
        if (user.verifyOtpExpireAt < Date.now()) return res.json({ success: false, message: "OTP Expired" });

        await user.update({
            isAccountVerified: true,
            verifyOtp: '',
            verifyOtpExpireAt: 0
        });

        return res.json({ success: true, message: "Email verified Successfully" })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const isAuthenticated = async (req, res) => {
    try { return res.json({ success: true }); }
    catch (error) { res.json({ success: false, message: error.message }); }
}

export const sendResetOtp = async (req, res) => {
    const { email } = req.body
    if (!email) return res.json({ success: false, message: "Email is required" });

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) return res.json({ success: false, message: "User not found" });

        const otp = String(Math.floor(100000 + Math.random() * 900000))

        await user.update({
            resetOtp: otp,
            resetOtpExpireAt: Date.now() + 15 * 60 * 1000
        });

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Password Reset OTP",
            html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        }
        await transporter.sendMail(mailOption)
        res.json({ success: true, message: "OTP sent to your Email" })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body
    if (!email || !otp || !newPassword) return res.json({ success: false, message: "Email, OTP and newPassword is required" });

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) return res.json({ success: false, message: "User not found" });

        if (user.resetOtp === "" || user.resetOtp !== otp) return res.json({ success: false, message: "Invalid OTP" });
        if (user.resetOtpExpireAt < Date.now()) return res.json({ success: false, message: "OTP Expired" });

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        await user.update({
            password: hashedPassword,
            resetOtp: '',
            resetOtpExpireAt: 0
        });

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Password Reset",
            text: `Your Password is Reset Successfully as you Requested.`
        }
        await transporter.sendMail(mailOption)
        res.json({ success: true, message: "Password has been Reset Successfully" })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}