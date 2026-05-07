import { getSupabaseClient } from '@kissan/shared';

class MarketPriceRepository {
  constructor() { this.db = getSupabaseClient(); this.table = 'market_prices'; }

  async findAll({ crop, district } = {}) {
    let q = this.db.from(this.table).select('*').order('arrivalDate', { ascending: false });
    if (crop) q = q.ilike('cropName', `%${crop}%`);
    if (district) q = q.ilike('district', `%${district}%`);
    const { data, error } = await q;
    if (error) throw error;
    return data || [];
  }

  async findById(id) {
    const { data, error } = await this.db.from(this.table).select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async create(priceData) {
    const { data, error } = await this.db.from(this.table).insert(priceData).select().single();
    if (error) throw error;
    return data;
  }

  async update(id, updates) {
    const { data, error } = await this.db.from(this.table).update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  async delete(id) {
    const { error } = await this.db.from(this.table).delete().eq('id', id);
    if (error) throw error;
    return true;
  }

  async findByCrop(crop) {
    const { data, error } = await this.db.from(this.table).select('*').ilike('cropName', crop).order('modalPrice', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async findLatest(crop, district) {
    const { data, error } = await this.db.from(this.table).select('*')
      .ilike('cropName', `%${crop}%`).ilike('district', `%${district}%`)
      .order('arrivalDate', { ascending: false }).limit(1).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async findTrend(crop, district, days = 30) {
    const since = new Date(); since.setDate(since.getDate() - days);
    const { data, error } = await this.db.from(this.table).select('*')
      .ilike('cropName', `%${crop}%`).ilike('district', `%${district}%`)
      .gte('arrivalDate', since.toISOString()).order('arrivalDate', { ascending: true });
    if (error) throw error;
    return data || [];
  }
}

export default new MarketPriceRepository();
