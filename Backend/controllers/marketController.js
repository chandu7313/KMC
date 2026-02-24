import MarketPrice from "../models/MarketPrice.js";
import MarketHistory from "../models/marketHistoryModel.js";
import { syncMandiData } from "../services/marketSyncService.js";
import { getTrend, getRecommendation } from "../services/marketAnalyticsService.js";
import { clearMarketCache } from "../middleware/marketMiddleware.js";

// Get all market prices with filtering
export const getMarketPrices = async (req, res) => {
    try {
        const { crop, district } = req.query;
        const filter = {};
        if (crop) filter.cropName = new RegExp(crop, 'i');
        if (district) filter.district = new RegExp(district, 'i');

        const prices = await MarketPrice.find(filter).sort({ arrivalDate: -1 });
        res.json({ success: true, prices });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Add new market price
export const addMarketPrice = async (req, res) => {
    try {
        const { cropName, variety, district, mandi, unit, price, minPrice, maxPrice, arrivalDate } = req.body;

        const newPrice = new MarketPrice({
            cropName,
            variety,
            district,
            mandi,
            unit,
            modalPrice: price,
            minPrice,
            maxPrice,
            arrivalDate: arrivalDate || new Date()
        });

        await newPrice.save();

        // Invalidate cache for this crop
        clearMarketCache(cropName);

        res.json({ success: true, message: "Market price added successfully", price: newPrice });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Update market price
export const updateMarketPrice = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        updateData.lastUpdated = Date.now();

        const updatedPrice = await MarketPrice.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedPrice) {
            return res.json({ success: false, message: "Market price not found" });
        }

        // Invalidate cache for this crop
        clearMarketCache(updatedPrice.cropName);

        res.json({ success: true, message: "Market price updated successfully", price: updatedPrice });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Delete market price
export const deleteMarketPrice = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPrice = await MarketPrice.findByIdAndDelete(id);

        if (!deletedPrice) {
            return res.json({ success: false, message: "Market price not found" });
        }

        // Invalidate cache for this crop
        clearMarketCache(deletedPrice.cropName);

        res.json({ success: true, message: "Market price deleted successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Sync market data (Simulation)
export const syncMarketData = async (req, res) => {
    try {
        const result = await syncMandiData();
        res.json(result);
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get Price Trends and Recommendation
export const getMarketAnalytics = async (req, res) => {
    try {
        const { crop, district } = req.query;
        if (!crop || !district) {
            return res.json({ success: false, message: "Crop and District are required" });
        }

        const trendData = await getTrend(crop, district);
        const recommendation = getRecommendation(trendData);

        res.json({
            success: true,
            crop,
            district,
            trends: trendData.success ? trendData : null, // Assuming structure compatibility or adjustment
            recommendation
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get District Comparison for a Crop
export const getCropComparison = async (req, res) => {
    try {
        const { crop } = req.params;
        const prices = await MarketPrice.find({ cropName: crop }).sort({ modalPrice: -1 });
        res.json({ success: true, prices });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// GET /api/market/realtime?crop=Rice&district=Gadwal
export const getRealTimePrice = async (req, res) => {
    try {
        const { crop, district } = req.query;
        if (!crop || !district) {
            return res.json({ success: false, message: "Crop and District are required" });
        }

        const priceData = await MarketPrice.findOne({
            cropName: new RegExp(crop, 'i'),
            district: new RegExp(district, 'i')
        }).sort({ arrivalDate: -1 });

        if (!priceData) {
            return res.json({ success: false, message: "No real-time data found for this combination" });
        }

        res.json({ success: true, data: priceData });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// GET /api/market/trend?crop=Rice&district=Gadwal
export const getMarketTrend = async (req, res) => {
    try {
        const { crop, district } = req.query;
        if (!crop || !district) {
            return res.json({ success: false, message: "Crop and District are required" });
        }

        const trendData = await getTrend(crop, district);
        res.json(trendData);
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// GET /api/market/recommendation?crop=Rice&district=Gadwal
export const getAdvisoryRecommendation = async (req, res) => {
    try {
        const { crop, district } = req.query;
        if (!crop || !district) {
            return res.json({ success: false, message: "Crop and District are required" });
        }

        const trendData = await getTrend(crop, district);
        const recommendation = getRecommendation(trendData);

        res.json({
            success: true,
            crop,
            district,
            ...recommendation
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
