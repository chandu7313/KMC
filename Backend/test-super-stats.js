import 'dotenv/config';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { AdminUser } from './models/index.js';

const testEndpoint = async () => {
    try {
        const user = await AdminUser.findOne({ where: { role: 'super_admin' } });
        if (!user) {
            console.log("No super admin found");
            return;
        }
        
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'fallbacksecret');
        const res = await axios.get('http://localhost:4000/api/admin/super-stats', {
            headers: { Cookie: `token=${token}` }
        });
        console.log("Success:", res.data);
    } catch (e) {
        console.error("Error details:", e.response?.data || e.message);
    }
}

testEndpoint();
