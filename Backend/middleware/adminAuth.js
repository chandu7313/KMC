import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

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

        const user = await userModel.findById(tokenDecode.id);

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        if (user.role !== 'admin') {
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
