import axios from 'axios';
import { createLogger, HttpError } from '@kissan/shared';
import marketRepo from '../repositories/market.repository.js';

const logger = createLogger('datagov-service');

class DataGovService {
  constructor() {
    this.apiKey = process.env.DATA_GOV_API_KEY;
    // Default to a known APMC daily mandi prices resource ID if not set
    this.resourceId = process.env.DATA_GOV_RESOURCE_ID || '9ef84268-d588-465a-a308-a864a43d0070';
    this.baseUrl = 'https://api.data.gov.in/resource';
  }

  async syncMarketPrices() {
    if (!this.apiKey) {
      logger.error('DATA_GOV_API_KEY is not set in environment variables');
      throw HttpError.internalServer('Data.gov API key not configured');
    }

    try {
      logger.info('Starting Market Price Sync from Data.gov.in');
      
      const response = await axios.get(`${this.baseUrl}/${this.resourceId}`, {
        params: {
          'api-key': this.apiKey.trim(),
          format: 'json',
          limit: 100 // Fetch latest 100 records for the sync
        }
      });

      if (response.data && response.data.records && response.data.records.length > 0) {
        let syncedCount = 0;
        
        for (const record of response.data.records) {
          try {
            const priceData = {
              cropName: this.normalizeCropName(record.commodity),
              variety: record.variety || 'Unknown',
              district: record.district,
              mandi: record.market,
              minPrice: parseFloat(record.min_price),
              maxPrice: parseFloat(record.max_price),
              modalPrice: parseFloat(record.modal_price),
              arrivalDate: record.arrival_date ? new Date(record.arrival_date.split('/').reverse().join('-')) : new Date()
            };

            // Basic validation
            if (!priceData.cropName || !priceData.district || isNaN(priceData.modalPrice)) {
              continue;
            }

            // Insert into the database using repository
            await marketRepo.create(priceData);
            syncedCount++;
          } catch (err) {
            logger.warn(`Failed to insert record: ${err.message}`);
          }
        }
        
        logger.info(`Successfully synced ${syncedCount} market price records`);
        return { success: true, message: `Synced ${syncedCount} records`, count: syncedCount };
      } else {
        throw new Error('No records found in the API response');
      }

    } catch (error) {
      logger.error(`Error syncing market prices: ${error.message}`);
      throw HttpError.internalServer(`Failed to sync with Data.gov: ${error.message}`);
    }
  }

  // Helper to normalize commodity names from Data.gov to match our existing data
  normalizeCropName(commodity) {
    if (!commodity) return 'Unknown';
    const name = commodity.toLowerCase().trim();
    if (name.includes('wheat')) return 'Wheat';
    if (name.includes('rice') || name.includes('paddy')) return 'Rice';
    if (name.includes('cotton')) return 'Cotton';
    if (name.includes('maize')) return 'Maize';
    if (name.includes('soyabean')) return 'Soybean';
    if (name.includes('mustard')) return 'Mustard';
    if (name.includes('onion')) return 'Onion';
    if (name.includes('tomato')) return 'Tomato';
    return commodity.charAt(0).toUpperCase() + commodity.slice(1).toLowerCase();
  }
}

export default new DataGovService();
