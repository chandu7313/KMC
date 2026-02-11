import MarketPrice from "../models/marketPriceModel.js";

// Get all market prices with filtering
export const getMarketPrices = async (req, res) => {
    try {
        const { crop, district } = req.query;
        const query = {};
        if (crop) query.crop = crop;
        if (district) query.district = district;

        const prices = await MarketPrice.find(query).sort({ lastUpdated: -1 });
        res.json({ success: true, prices });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Add new market price
export const addMarketPrice = async (req, res) => {
    try {
        const { crop, variety, district, unit, price, change } = req.body;

        const newPrice = new MarketPrice({
            crop,
            variety,
            district,
            unit,
            price,
            change
        });

        await newPrice.save();
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

        res.json({ success: true, message: "Market price deleted successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
