import { getSupabaseClient } from '@kissan/shared';

class OrderRepository {
  constructor() { this.db = getSupabaseClient(); this.orderTable = 'marketplace_orders'; this.itemTable = 'marketplace_order_items'; }

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
    const { data: orders, error } = await this.db.from(this.orderTable).select('*').eq('userId', userId).order('created_at', { ascending: false });
    if (error) throw error;
    // Fetch items for each order
    for (const order of (orders || [])) {
      const { data: items } = await this.db.from(this.itemTable).select('*').eq('orderId', order.id);
      order.items = items || [];
    }
    return orders || [];
  }

  async findAll() {
    const { data: orders, error } = await this.db.from(this.orderTable).select('*').order('created_at', { ascending: false });
    if (error) throw error;
    for (const order of (orders || [])) {
      const { data: items } = await this.db.from(this.itemTable).select('*').eq('orderId', order.id);
      order.items = items || [];
    }
    return orders || [];
  }

  async update(id, updates) {
    const { data, error } = await this.db.from(this.orderTable).update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }
}

export default new OrderRepository();
