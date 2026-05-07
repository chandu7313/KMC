import { getSupabaseClient } from '@kissan/shared';

class SoilReportRepository {
  constructor() {
    this.db = getSupabaseClient();
    this.table = 'soil_reports';
    this.reminderTable = 'soil_reminders';
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

  async findByFarmer(farmerId) {
    const { data, error } = await this.db.from(this.table).select('*').eq('farmerId', farmerId).order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async findAll() {
    const { data, error } = await this.db.from(this.table).select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async update(id, updates) {
    const { data, error } = await this.db.from(this.table).update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  // Soil Reminders
  async createReminder(data) {
    const { data: record, error } = await this.db.from(this.reminderTable).insert(data).select().single();
    if (error) throw error;
    return record;
  }

  async findReminderByReport(reportId) {
    const { data, error } = await this.db.from(this.reminderTable).select('*').eq('reportId', reportId).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async updateReminder(id, updates) {
    const { data, error } = await this.db.from(this.reminderTable).update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }
}

export default new SoilReportRepository();
