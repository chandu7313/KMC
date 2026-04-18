import { User } from '../models/index.js';

// Add products to user cart
const addToCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body;
        
        const user = await User.findByPk(userId, { attributes: ['cartData'] });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        let cartData = user.cartData || {};

        if (cartData[itemId]) {
            cartData[itemId] += 1;
        } else {
            cartData[itemId] = 1;
        }

        await User.update({ cartData }, { where: { id: userId } });

        res.json({ success: true, message: "Added To Cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Update user cart
const updateCart = async (req, res) => {
    try {
        const { userId, itemId, quantity } = req.body;
        
        const user = await User.findByPk(userId, { attributes: ['cartData'] });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        let cartData = user.cartData || {};

        cartData[itemId] = quantity;

        await User.update({ cartData }, { where: { id: userId } });

        res.json({ success: true, message: "Cart Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Get user cart
const getUserCart = async (req, res) => {
    try {
        const { userId } = req.body;
        
        const user = await User.findByPk(userId, { attributes: ['cartData'] });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ success: true, cartData: user.cartData || {} });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { addToCart, updateCart, getUserCart };
