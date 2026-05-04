import express from "express";
import cors from "cors"
import 'dotenv/config';
import cookieParser from "cookie-parser";

import connectCloudinary from "./config/cloudinary.js";
import { connectDB, sequelize } from "./config/database.js";
import './models/index.js'; // Register all models + relationships

import authRouter from './routes/authRoutes.js'
import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import marketRouter from "./routes/marketRoutes.js";
import blogRouter from "./routes/blogRoutes.js";
import successRouter from "./routes/successRoutes.js";
import fertilizerRouter from "./routes/fertilizerRoutes.js";
import equipmentRouter from "./routes/equipmentRoutes.js";
import soilRouter from "./routes/soilRoutes.js";
import productRouter from "./routes/productRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import surveyRouter from "./routes/surveyRoutes.js";
import orchardRouter from "./routes/orchardRequestRoutes.js";
import cropDoctorRouter from "./routes/cropDoctorRoutes.js";
import supportRouter from "./routes/supportRoutes.js";
import startCronJobs from "./config/cron.js";

const app = express();
const port = process.env.PORT || 4000;

// Initialize Cloudinary
connectCloudinary();

// Connect DB, sync models, then start cron
(async () => {
    await connectDB();
    // Sync models with existing DB tables (does NOT drop or alter existing columns)
    await sequelize.sync({ alter: false });
    console.log('✅ Sequelize models synced with database.');
    startCronJobs(); // Start background jobs
})();

const allowedOrigins = [
    'http://localhost:5173',
    process.env.ALLOWED_ORIGINS
].filter(Boolean);

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc)
        if (!origin) return callback(null, true);
        // Allow all localhost origins (for Flutter web dev server on random ports)
        if (origin.startsWith('http://localhost')) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        callback(null, true); // Allow all in dev mode
    },
    credentials: true
}))


//API Endpoints
app.get('/', (req, res) => res.send("API Working"))
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/admin', adminRouter)
app.use('/api/market', marketRouter)
app.use('/api/blog', blogRouter)
app.use('/api/success', successRouter)
app.use('/api/fertilizer', fertilizerRouter)
app.use('/api/equipment', equipmentRouter)
app.use('/api/soil', soilRouter) // Changed from /api/soil-tests to /api/soil as per request
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/survey', surveyRouter);
app.use('/api/orchard', orchardRouter);
app.use('/api/crop-doctor', cropDoctorRouter);
app.use('/api/support', supportRouter);

app.listen(port, () => console.log(`Server started on PORT:${port}`));