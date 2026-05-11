import mongoose from 'mongoose';
import productModel from './models/Product.js';
import 'dotenv/config';
import connectDB from './config/mongodb.js';

const seedProducts = async () => {
    try {
        await connectDB();

        console.log("Clearing existing products...");
        await productModel.deleteMany({});

        const categories = [
            'Fertilizers',
            'Seeds',
            'Pesticides',
            'Tractors',
            'Plows & Harrows',
            'Seed Drills',
            'Sprayers',
            'Combine Harvesters'
        ];

        const placeholderImages = {
            'Fertilizers': "https://res.cloudinary.com/dwyxsncuz/image/upload/v1739268508/urea_fertilizer_vck8h6.jpg",
            'Seeds': "https://res.cloudinary.com/dwyxsncuz/image/upload/v1739268508/maize_seeds_p1l9w8.jpg",
            'Pesticides': "https://res.cloudinary.com/dwyxsncuz/image/upload/v1739268508/neem_cake_v2n1j4.jpg",
            'Tractors': "https://res.cloudinary.com/dwyxsncuz/image/upload/v1739268508/mahindra_tractor_y0jv7t.jpg",
            'Sprayers': "https://res.cloudinary.com/dwyxsncuz/image/upload/v1739268508/knapsack_sprayer_q1m8v9.jpg"
        };

        const products = [];

        categories.forEach(category => {
            const mainCategory = ['Fertilizers', 'Seeds', 'Pesticides'].includes(category) ? 'Fertilizers' : 'Equipments';
            const img = placeholderImages[category] || placeholderImages[mainCategory === 'Fertilizers' ? 'Fertilizers' : 'Tractors'];

            for (let i = 1; i <= 15; i++) {
                const price = Math.floor(Math.random() * (category.includes('Tractor') ? 500000 : 2000)) + 500;
                products.push({
                    name: `${category} Model ${String.fromCharCode(64 + i)}${i}`,
                    description: `Professional grade ${category.toLowerCase()} for advanced farming. Highly durable and reliable for long-term use. Optimized for Indian soil conditions. Features advanced efficiency and ergonomic design.`,
                    shortDescription: `Top-quality ${category.toLowerCase()} for your farm.`,
                    category: category,
                    subCategory: category, // Keep subCategory same as category for easier filtering in split pages
                    price: price,
                    discountedPrice: Math.floor(price * 0.9),
                    images: [img, img, img, img], // 4 photos per product as requested
                    stock: Math.floor(Math.random() * 100) + 10,
                    ratings: (Math.random() * 1.5 + 3.5).toFixed(1),
                    numReviews: Math.floor(Math.random() * 200) + 5,
                    isFeatured: i === 1
                });
            }
        });

        await productModel.insertMany(products);
        console.log(`Successfully seeded ${products.length} products!`);
        process.exit(0);

    } catch (error) {
        console.error("Error seeding products:", error);
        process.exit(1);
    }
};

seedProducts();
