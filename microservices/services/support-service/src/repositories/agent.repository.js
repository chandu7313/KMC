import { models } from '@kissan/shared';

const { AdminUser } = models;

class AgentRepository {
  async findAll() {
    return AdminUser.findAll({
      order: [['name', 'ASC']],
      raw: true
    });
  }

  async findActive() {
    return AdminUser.findAll({
      attributes: ['id', 'name', 'avatar', 'status', 'role', 'email', 'phone'],
      where: { isActive: true },
      raw: true
    });
  }

  async findById(id) {
    return AdminUser.findByPk(id, { raw: true });
  }

  async findByEmail(email) {
    return AdminUser.findOne({ where: { email }, raw: true });
  }

  async create(data) {
    const agent = await AdminUser.create(data);
    return agent.get({ plain: true });
  }

  async update(id, updates) {
    const [_, [updatedAgent]] = await AdminUser.update(updates, {
      where: { id },
      returning: true,
      raw: true
    });
    return updatedAgent;
  }
}

export default new AgentRepository();
