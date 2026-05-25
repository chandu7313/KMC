import { successResponse, HttpError, models } from '@kissan/shared';
import { Op } from 'sequelize';

const { ExpertV2, ExpertSlot, ExpertConsultation } = models;

// ── GET Experts ──
export const getExpertsFromSupabase = async (req, res, next) => {
  try {
    const { topic, available } = req.query;
    
    const whereClause = { isActive: true };
    if (available === 'true') {
      whereClause.availabilityStatus = { [Op.in]: ['available', 'busy'] };
    }

    const experts = await ExpertV2.findAll({ where: whereClause, raw: true });
    
    const mappedExperts = experts.map(e => ({
      id: e.id,
      name: e.name,
      specialty: e.specialty,
      photoUrl: e.photoUrl,
      rating: parseFloat(e.rating).toString(),
      consultCount: e.experienceYears * 10,
      tags: e.tags,
      availabilityStatus: e.availabilityStatus,
      nextAvailableAt: e.nextAvailableAt
    }));
    
    return successResponse(res, mappedExperts, 'Experts retrieved');
  } catch (err) { next(err); }
};

// ── GET Expert Profile ──
export const getExpertProfileFromSupabase = async (req, res, next) => {
  try {
    const { id } = req.params;
    const expert = await ExpertV2.findByPk(id, { raw: true });
    if (!expert) throw HttpError.notFound('Expert not found');
    
    const slots = await ExpertSlot.findAll({
      where: {
        expertId: id,
        isBooked: false,
        slotDatetime: { [Op.gte]: new Date() }
      },
      order: [['slotDatetime', 'ASC']],
      limit: 5,
      raw: true
    });

    const mappedExpert = {
      id: expert.id,
      name: expert.name,
      specialty: expert.specialty,
      photoUrl: expert.photoUrl,
      description: expert.description,
      rating: parseFloat(expert.rating).toString(),
      consultCount: expert.experienceYears * 10,
      tags: expert.tags,
      languages: expert.languages,
      slots: slots.map(s => ({
        id: s.id,
        slotDatetime: s.slotDatetime,
        durationMinutes: s.durationMinutes
      }))
    };

    return successResponse(res, { expert: mappedExpert }, 'Profile retrieved');
  } catch (err) { next(err); }
};

// ── BOOK Consultation ──
export const bookConsultation = async (req, res, next) => {
  try {
    const { expertId, topic, callType, phone, notes } = req.body;
    const farmerId = req.user?.id || '00000000-0000-0000-0000-000000000000';
    
    let slotId = null;
    let slotTime = new Date();
    slotTime.setHours(slotTime.getHours() + 1);
    
    if (expertId) {
      const slot = await ExpertSlot.findOne({
        where: {
          expertId,
          isBooked: false,
          slotDatetime: { [Op.gte]: new Date() }
        },
        order: [['slotDatetime', 'ASC']]
      });
        
      if (!slot) {
        throw HttpError.conflict('NO_SLOTS_AVAILABLE');
      }
      
      slotId = slot.id;
      slotTime = slot.slotDatetime;
      await slot.update({ isBooked: true });
    }

    const bookingRef = 'KM-' + Math.random().toString(36).substring(2, 6).toUpperCase();

    const booking = await ExpertConsultation.create({
      bookingRef,
      userId: farmerId,
      expertId,
      slotId,
      topic,
      callType,
      farmerPhone: phone,
      notes,
      status: 'confirmed'
    });
      
    let expertName = 'Auto-Assigned Expert';
    if (expertId) {
      const expert = await ExpertV2.findByPk(expertId, { attributes: ['name'], raw: true });
      if (expert) expertName = expert.name;
    }

    const mappedBooking = {
      id: booking.id,
      bookingRef: booking.bookingRef,
      expertName,
      slotDatetime: booking.scheduledAt,
      topic: booking.topic,
      farmerPhone: booking.farmerPhone,
      callType: booking.callType
    };

    return successResponse(res, { booking: mappedBooking }, 'Call booked successfully');
  } catch (err) { next(err); }
};

// ── GET My Consultations ──
export const getMyConsultations = async (req, res, next) => {
  try {
    const farmerId = req.user?.id || '00000000-0000-0000-0000-000000000000';
    
    const consultations = await ExpertConsultation.findAll({
      where: { userId: farmerId },
      include: [{ model: ExpertV2, as: 'expert', attributes: ['name'] }],
      order: [['scheduledAt', 'DESC']]
    });

    const mapped = consultations.map(c => ({
      id: c.id,
      createdAt: c.scheduledAt,
      expertName: c.expert?.name || 'Unknown Expert',
      topic: c.topic,
      status: c.status,
      callType: c.callType
    }));

    return successResponse(res, mapped, 'Consultations retrieved');
  } catch (err) { next(err); }
};

// ── GET Consultation Notes ──
export const getConsultationNotes = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const note = await ExpertConsultation.findByPk(id, {
      attributes: ['expertNotes', 'recommendations', 'durationActualMinutes', 'farmerRating', 'topic', 'scheduledAt'],
      include: [{ model: ExpertV2, as: 'expert', attributes: ['name'] }]
    });

    if (!note) {
      return successResponse(res, {
        expertNotes: null,
        recommendations: [],
      }, 'Notes retrieved');
    }

    const mapped = {
      expertNotes: note.expertNotes,
      recommendations: note.recommendations,
      durationActualMinutes: note.durationActualMinutes,
      farmerRating: note.farmerRating,
      topic: note.topic,
      createdAt: note.scheduledAt,
      expertName: note.expert?.name
    };

    return successResponse(res, mapped, 'Notes retrieved');
  } catch (err) { next(err); }
};

// ── CANCEL Consultation ──
export const cancelConsultation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const consultation = await ExpertConsultation.findByPk(id);
    if (!consultation) throw HttpError.notFound('Consultation not found');

    await consultation.update({ 
      status: 'cancelled',
      cancelReason: reason,
      cancelledAt: new Date()
    });
    
    return successResponse(res, consultation, 'Consultation cancelled');
  } catch (err) { next(err); }
};

// ── RATE Consultation ──
export const rateConsultation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    
    const consultation = await ExpertConsultation.findByPk(id);
    if (!consultation) throw HttpError.notFound('Consultation not found');

    await consultation.update({
      farmerRating: rating,
      ratedAt: new Date()
    });
    
    return successResponse(res, consultation, 'Rating submitted');
  } catch (err) { next(err); }
};
