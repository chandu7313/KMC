import { Product } from '../models/index.js';

// Add Product (Admin)
const addProduct = async (req, res) => {
    try {
        const { name, description, shortDescription, category, subCategory, price, stock, specifications, isFeatured } = req.body;
        const images = req.files ? req.files.map(file => file.path) : []; // Assuming multer-cloudinary is used

        const productData = {
            name,
            description,
            shortDescription,
            category,
            subCategory,
            price: Number(price),
            stock: Number(stock),
            images,
            specifications: specifications ? JSON.parse(specifications) : {},
            isFeatured: isFeatured === 'true'
        };

        await Product.create(productData);

        res.json({ success: true, message: "Product Added" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// List Products
const listProducts = async (req, res) => {
    try {
        const products = await Product.findAll();

        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Remove Product (Admin)
const removeProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.body.id);
        
        if (!product) {
             return res.json({ success: false, message: "Product not found" });
        }
        
        await product.destroy();

        res.json({ success: true, message: "Product Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Single Product Info
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await Product.findByPk(productId);

        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        res.json({ success: true, product });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { addProduct, listProducts, removeProduct, singleProduct };
