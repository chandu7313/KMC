import { models } from '@kissan/shared';

const { Expert, ExpertBooking, ExpertReview, User } = models;

class ExpertRepository {
  // ── Experts ──
  async findAll({ page = 1, limit = 20, specialization, available } = {}) {
    const where = { isActive: true };
    if (specialization) where.specialization = specialization;
    if (available !== undefined) where.isAvailable = available;

    const offset = (page - 1) * limit;

    const { rows, count } = await Expert.findAndCountAll({
      where,
      order: [['rating', 'DESC']],
      limit,
      offset,
      raw: true
    });

    return { experts: rows, total: count };
  }

  async findById(id) {
    return Expert.findByPk(id, { raw: true });
  }

  async findByUserId(userId) {
    return Expert.findOne({ where: { userId }, raw: true });
  }

  async create(data) {
    const expert = await Expert.create(data);
    return expert.get({ plain: true });
  }

  async update(id, updates) {
    const [_, [updatedExpert]] = await Expert.update(updates, {
      where: { id },
      returning: true,
      raw: true
    });
    return updatedExpert;
  }

  async delete(id) {
    await Expert.update({ isActive: false }, { where: { id } });
  }

  // ── Bookings ──
  async createBooking(data) {
    const booking = await ExpertBooking.create(data);
    return booking.get({ plain: true });
  }

  async findBookingById(id) {
    return ExpertBooking.findByPk(id, {
      include: [{ model: Expert, as: 'expert' }]
    }).then(result => result ? result.get({ plain: true }) : null);
  }

  async findBookingsByFarmer(farmerId, { page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;

    const { rows, count } = await ExpertBooking.findAndCountAll({
      where: { farmerId },
      include: [{ model: Expert, as: 'expert', attributes: ['name', 'specialization', 'profileImage'] }],
      order: [['scheduledAt', 'DESC']],
      limit,
      offset
    });

    return { bookings: rows.map(r => r.get({ plain: true })), total: count };
  }

  async findBookingsByExpert(expertId, { page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;

    const { rows, count } = await ExpertBooking.findAndCountAll({
      where: { expertId },
      order: [['scheduledAt', 'DESC']],
      limit,
      offset,
      raw: true
    });

    return { bookings: rows, total: count };
  }

  async updateBooking(id, updates) {
    const [_, [updatedBooking]] = await ExpertBooking.update(updates, {
      where: { id },
      returning: true,
      raw: true
    });
    return updatedBooking;
  }

  async countBookings(where = {}) {
    return ExpertBooking.count({ where });
  }

  // ── Reviews ──
  async createReview(data) {
    const review = await ExpertReview.create(data);
    return review.get({ plain: true });
  }

  async findReviewsByExpert(expertId) {
    return ExpertReview.findAll({
      where: { expertId },
      order: [['created_at', 'DESC']],
      raw: true
    });
  }

  async getAverageRating(expertId) {
    const result = await ExpertReview.sum('rating', { where: { expertId } });
    const count = await ExpertReview.count({ where: { expertId } });
    if (!count) return 0;
    return result / count;
  }
}

export default new ExpertRepository();
