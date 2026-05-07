import { getSupabaseClient } from '@kissan/shared';

class EquipmentOrderRepository {
  constructor() {
    this.db = getSupabaseClient();
    this.orderTable = 'equipment_orders';
    this.itemTable = 'equipment_order_items';
    this.equipmentTable = 'equipments';
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

      for (const item of (items || [])) {
        const { data: equipment } = await this.db
          .from(this.equipmentTable).select('*')
          .eq('id', item.equipmentId).single();
        item.equipmentId = equipment || item.equipmentId;
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

      // Attach items with equipment details
      const { data: items } = await this.db
        .from(this.itemTable).select('*')
        .eq('orderId', order.id);

      for (const item of (items || [])) {
        const { data: equipment } = await this.db
          .from(this.equipmentTable).select('*')
          .eq('id', item.equipmentId).single();
        item.equipmentId = equipment || item.equipmentId;
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

  /** Decrement stock for an equipment (direct DB access — Option A) */
  async decrementStock(equipmentId, quantity) {
    const { data: equipment, error } = await this.db
      .from(this.equipmentTable).select('stock')
      .eq('id', equipmentId).single();
    if (error) throw error;
    if (!equipment) return;

    const newStock = Math.max(0, (equipment.stock || 0) - quantity);
    await this.db.from(this.equipmentTable).update({ stock: newStock }).eq('id', equipmentId);
  }
}

export default new EquipmentOrderRepository();
