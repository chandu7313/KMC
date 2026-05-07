import { getSupabaseClient } from '@kissan/shared';

class DiagnosisRepository {
  constructor() {
    this.db = getSupabaseClient();
    this.table = 'crop_diagnoses';
  }

  async create(data) {
    const { data: record, error } = await this.db.from(this.table).insert(data).select().single();
    if (error) throw error;
    return record;
  }

  async findById(id) {
    const { data, error } = await this.db.from(this.table).select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async findByFarmer(farmerId, { limit = 20, offset = 0 } = {}) {
    const { data, error } = await this.db
      .from(this.table)
      .select('id, imageUrl, cropName, fieldName, diseaseName, severity, confidence, isHealthy, created_at')
      .eq('farmerId', farmerId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    if (error) throw error;
    return data || [];
  }

  async getStats() {
    const { count: total } = await this.db.from(this.table).select('*', { count: 'exact', head: true });
    const { count: diseased } = await this.db.from(this.table).select('*', { count: 'exact', head: true }).eq('isHealthy', false);
    return { total, diseased, healthy: (total || 0) - (diseased || 0) };
  }
}

export default new DiagnosisRepository();
