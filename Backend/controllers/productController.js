import productModel from "../models/Product.js";

// Add Product (Admin)
const addProduct = async (req, res) => {
    try {
        const { name, description, shortDescription, category, subCategory, price, stock, specifications, isFeatured } = req.body;
        const images = req.files.map(file => file.path); // Assuming multer-cloudinary is used

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

        const product = new productModel(productData);
        await product.save();

        res.json({ success: true, message: "Product Added" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// List Products
const listProducts = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Remove Product (Admin)
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id);
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
        const product = await productModel.findById(productId);
        res.json({ success: true, product });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { addProduct, listProducts, removeProduct, singleProduct };
