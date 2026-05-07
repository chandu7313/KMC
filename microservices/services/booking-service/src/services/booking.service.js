import { HttpError, createLogger } from '@kissan/shared';
import { publishEvent, EXCHANGES } from '@kissan/events';
import bookingRepo from '../repositories/booking.repository.js';

const logger = createLogger('booking-service');

class BookingService {
  async createBooking(data) {
    const { farmerId, fullName, phone, village, district, visitDate, purpose } = data;
    if (!farmerId || !fullName || !phone || !village || !district || !visitDate || !purpose) {
      throw HttpError.badRequest('Missing required booking details');
    }
    const booking = await bookingRepo.create({ farmerId, fullName, phone, village, district, visitDate, purpose, status: 'Pending' });
    await publishEvent(EXCHANGES.BOOKINGS || 'bookings', 'booking.created', {
      bookingId: booking.id, farmerId, district, visitDate,
    }).catch(() => {});
    return booking;
  }

  async getUserBookings(farmerId) { return bookingRepo.findByFarmer(farmerId); }

  async getBookingById(id) {
    const booking = await bookingRepo.findById(id);
    if (!booking) throw HttpError.notFound('Booking not found');
    return booking;
  }

  async getAllBookings(filters) { return bookingRepo.findAll(filters); }

  async updateBooking(id, updates) {
    const existing = await bookingRepo.findById(id);
    if (!existing) throw HttpError.notFound('Booking not found');
    const updated = await bookingRepo.update(id, updates);
    if (updates.status && updates.status !== existing.status) {
      await publishEvent(EXCHANGES.BOOKINGS || 'bookings', 'booking.status_updated', {
        bookingId: id, status: updates.status, farmerId: existing.farmerId,
      }).catch(() => {});
    }
    return updated;
  }

  async cancelBooking(id, farmerId) {
    const booking = await bookingRepo.findById(id);
    if (!booking) throw HttpError.notFound('Booking not found');
    if (booking.farmerId !== farmerId) throw HttpError.forbidden('Not your booking');
    if (booking.status === 'Completed') throw HttpError.badRequest('Cannot cancel completed booking');
    return bookingRepo.update(id, { status: 'Cancelled' });
  }
}

export default new BookingService();
