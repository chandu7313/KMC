import jwt from 'jsonwebtoken';
import { User, AdminUser } from '../models/index.js';

const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.json({ success: false, message: 'Not Authorized. Login Again' });
        }

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if (!tokenDecode.id) {
            return res.json({ success: false, message: 'Not Authorized. Login Again' });
        }

        let user = await AdminUser.findByPk(tokenDecode.id, {
            attributes: ['id', 'role']
        });

        if (!user) {
            user = await User.findByPk(tokenDecode.id, {
                attributes: ['id', 'role']
            });
        }

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const allowedRoles = ['admin', 'super_admin', 'tech_admin', 'agri_expert', 'ecommerce_manager', 'order_manager', 'support_agent', 'support_manager', 'content_manager', 'finance_manager', 'field_agent'];

        if (!allowedRoles.includes(user.role)) {
            return res.json({ success: false, message: 'Not Authorized. Admin Access Required' });
        }

        req.userId = tokenDecode.id;
        req.body.userId = tokenDecode.id;
        next();

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export default adminAuth;
