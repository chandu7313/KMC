import { getSupabaseClient } from '@kissan/shared';

class FertilizerOrderRepository {
  constructor() {
    this.db = getSupabaseClient();
    this.orderTable = 'fertilizer_orders';
    this.itemTable = 'fertilizer_order_items';
    this.fertilizerTable = 'fertilizers';
  }

  async createOrder(data) {
    const { data: order, error } = await this.db.from(this.orderTable).insert(data).select().single();
    if (error) throw error;
    return order;
  }

  async createOrderItems(items) {
    const { data, error } = await this.db.from(this.itemTable).insert(items).select();
    if (error) throw error;
    return data;
  }

  async findById(id) {
    const { data, error } = await this.db.from(this.orderTable).select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async findByUser(userId) {
    const { data: orders, error } = await this.db
      .from(this.orderTable).select('*')
      .eq('userId', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;

    for (const order of (orders || [])) {
      const { data: items } = await this.db
        .from(this.itemTable).select('*')
        .eq('orderId', order.id);

      // Attach fertilizer details to each item
      for (const item of (items || [])) {
        const { data: fertilizer } = await this.db
          .from(this.fertilizerTable).select('*')
          .eq('id', item.fertilizerId).single();
        item.fertilizerId = fertilizer || item.fertilizerId;
      }
      order.items = items || [];
    }
    return orders || [];
  }

  async findAll() {
    const { data: orders, error } = await this.db
      .from(this.orderTable).select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;

    for (const order of (orders || [])) {
      // Attach user info
      const { data: user } = await this.db
        .from('users').select('name, phone')
        .eq('id', order.userId).single();
      order.userId = user || order.userId;

      // Attach items with fertilizer details
      const { data: items } = await this.db
        .from(this.itemTable).select('*')
        .eq('orderId', order.id);

      for (const item of (items || [])) {
        const { data: fertilizer } = await this.db
          .from(this.fertilizerTable).select('*')
          .eq('id', item.fertilizerId).single();
        item.fertilizerId = fertilizer || item.fertilizerId;
      }
      order.items = items || [];
    }
    return orders || [];
  }

  async update(id, updates) {
    const { data, error } = await this.db.from(this.orderTable).update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  /** Decrement stock for a fertilizer (direct DB access — Option A) */
  async decrementStock(fertilizerId, quantity) {
    const { data: fertilizer, error } = await this.db
      .from(this.fertilizerTable).select('stock')
      .eq('id', fertilizerId).single();
    if (error) throw error;
    if (!fertilizer) return;

    const newStock = Math.max(0, (fertilizer.stock || 0) - quantity);
    await this.db.from(this.fertilizerTable).update({ stock: newStock }).eq('id', fertilizerId);
  }
}

export default new FertilizerOrderRepository();
