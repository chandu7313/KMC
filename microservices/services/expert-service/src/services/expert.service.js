import { HttpError, createLogger } from '@kissan/shared';
import expertRepo from '../repositories/expert.repository.js';

const logger = createLogger('expert-service');

class ExpertService {
  // ── Directory ──
  async listExperts(filters) {
    return expertRepo.findAll(filters);
  }

  async getExpertById(id) {
    const expert = await expertRepo.findById(id);
    if (!expert) throw HttpError.notFound('Expert not found');
    const reviews = await expertRepo.findReviewsByExpert(id);
    return { expert, reviews };
  }

  async createExpert(data) {
    logger.info({ userId: data.userId }, 'Creating expert profile');
    const existing = await expertRepo.findByUserId(data.userId);
    if (existing) throw HttpError.conflict('Expert profile already exists for this user');
    return expertRepo.create({
      userId: data.userId,
      name: data.name,
      specialization: data.specialization,
      bio: data.bio || '',
      experience: data.experience || 0,
      languages: data.languages || ['Telugu', 'Hindi'],
      profileImage: data.profileImage || null,
      rating: 0,
      isAvailable: true,
      isActive: true,
      hourlyRate: data.hourlyRate || 0,
      location: data.location || '',
    });
  }

  async updateExpert(id, updates, actorId) {
    const expert = await expertRepo.findById(id);
    if (!expert) throw HttpError.notFound('Expert not found');
    if (expert.userId !== actorId) throw HttpError.forbidden('Cannot update another expert\'s profile');
    const allowed = ['bio', 'specialization', 'experience', 'languages', 'profileImage', 'hourlyRate', 'location', 'isAvailable'];
    const fields = Object.fromEntries(Object.entries(updates).filter(([k]) => allowed.includes(k)));
    return expertRepo.update(id, fields);
  }

  async deleteExpert(id) {
    const expert = await expertRepo.findById(id);
    if (!expert) throw HttpError.notFound('Expert not found');
    await expertRepo.delete(id);
  }

  // ── Bookings ──
  async createBooking(data) {
    const expert = await expertRepo.findById(data.expertId);
    if (!expert) throw HttpError.notFound('Expert not found');
    if (!expert.isAvailable) throw HttpError.conflict('Expert is not currently available');
    logger.info({ expertId: data.expertId, farmerId: data.farmerId }, 'Creating expert booking');
    return expertRepo.createBooking({
      expertId: data.expertId,
      farmerId: data.farmerId,
      scheduledAt: data.scheduledAt,
      durationMins: data.durationMins || 30,
      consultationType: data.consultationType || 'video',
      topic: data.topic,
      notes: data.notes || '',
      status: 'pending',
    });
  }

  async getBooking(id) {
    const booking = await expertRepo.findBookingById(id);
    if (!booking) throw HttpError.notFound('Booking not found');
    return booking;
  }

  async getFarmerBookings(farmerId, filters) {
    return expertRepo.findBookingsByFarmer(farmerId, filters);
  }

  async getExpertBookings(expertId, filters) {
    return expertRepo.findBookingsByExpert(expertId, filters);
  }

  async updateBookingStatus(id, status, actorId) {
    const booking = await expertRepo.findBookingById(id);
    if (!booking) throw HttpError.notFound('Booking not found');
    const validTransitions = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['completed', 'cancelled'],
      completed: [],
      cancelled: [],
    };
    if (!validTransitions[booking.status]?.includes(status)) {
      throw HttpError.unprocessable(`Cannot transition booking from '${booking.status}' to '${status}'`);
    }
    const updates = { status };
    if (status === 'completed') updates.completedAt = new Date().toISOString();
    if (status === 'cancelled') { updates.cancelledAt = new Date().toISOString(); updates.cancelledBy = actorId; }
    return expertRepo.updateBooking(id, updates);
  }

  // ── Reviews ──
  async addReview(data) {
    const expert = await expertRepo.findById(data.expertId);
    if (!expert) throw HttpError.notFound('Expert not found');
    const totalBookings = await expertRepo.countBookings({ farmerId: data.farmerId, expertId: data.expertId, status: 'completed' });
    if (totalBookings === 0) throw HttpError.forbidden('You can only review experts after a completed consultation');
    const review = await expertRepo.createReview({
      expertId: data.expertId,
      farmerId: data.farmerId,
      rating: data.rating,
      comment: data.comment || '',
    });
    // Refresh average rating on the expert record
    const avg = await expertRepo.getAverageRating(data.expertId);
    await expertRepo.update(data.expertId, { rating: parseFloat(avg.toFixed(2)) });
    return review;
  }

  async getExpertReviews(expertId) {
    return expertRepo.findReviewsByExpert(expertId);
  }

  // ── Dashboard ──
  async getDashboardStats(expertId) {
    const [total, pending, completed] = await Promise.all([
      expertRepo.countBookings({ expertId }),
      expertRepo.countBookings({ expertId, status: 'pending' }),
      expertRepo.countBookings({ expertId, status: 'completed' }),
    ]);
    return { stats: { total, pending, completed } };
  }
}

export default new ExpertService();
