import { HttpError, createLogger } from '@kissan/shared';
import { publishEvent, EXCHANGES, USER_EVENTS } from '@kissan/events';
import userRepository from '../repositories/user.repository.js';
import addressRepository from '../repositories/address.repository.js';

const logger = createLogger('user-service');

class UserService {
  // ── Get Profile ──

  async getUserData(userId) {
    let user = await userRepository.findById(userId,
      'id, name, email, phone, role, isAccountVerified, language, preferredLanguage, hasCompletedTour, hasCompletedSurvey, simpleMode, district, crops'
    );

    let isAdmin = false;

    if (!user) {
      const { default: adminRepo } = await import('../repositories/admin-user.repository.js');
      user = await adminRepo.findById(userId);
      if (!user) throw HttpError.notFound('User not found');
      isAdmin = true;
    }

    // Fetch addresses (only for regular users)
    const addresses = !isAdmin ? await addressRepository.findByUserId(userId) : [];

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isAccountVerified: user.isAccountVerified || false,
      language: user.language || 'en',
      preferredLanguage: user.preferredLanguage || 'en',
      hasCompletedTour: user.hasCompletedTour || false,
      hasCompletedSurvey: user.hasCompletedSurvey || false,
      simpleMode: user.simpleMode || false,
      district: user.district,
      crops: user.crops || [],
      addresses,
      isAdminUser: isAdmin,
    };
  }

  // ── Update Profile ──

  async updateProfile(userId, updates) {
    const allowedFields = ['name', 'phone', 'district', 'crops', 'avatar'];
    const filteredUpdates = {};
    for (const key of allowedFields) {
      if (updates[key] !== undefined) filteredUpdates[key] = updates[key];
    }

    if (Object.keys(filteredUpdates).length === 0) {
      throw HttpError.badRequest('No valid fields to update');
    }

    const user = await userRepository.update(userId, filteredUpdates);

    await publishEvent(EXCHANGES.USER, USER_EVENTS.PROFILE_UPDATED, {
      userId,
      fields: Object.keys(filteredUpdates),
    });

    return user;
  }

  // ── Language ──

  async updateLanguage(userId, language) {
    if (!['en', 'hi', 'te'].includes(language)) {
      throw HttpError.badRequest('Invalid language. Supported: en, hi, te');
    }
    return userRepository.update(userId, { language });
  }

  // ── Preferences ──

  async updatePreferences(userId, prefs) {
    const updateData = {};
    if (prefs.preferredLanguage !== undefined) updateData.preferredLanguage = prefs.preferredLanguage;
    if (prefs.hasCompletedTour !== undefined) updateData.hasCompletedTour = prefs.hasCompletedTour;
    if (prefs.simpleMode !== undefined) updateData.simpleMode = prefs.simpleMode;

    if (Object.keys(updateData).length === 0) {
      throw HttpError.badRequest('No valid preferences to update');
    }

    return userRepository.update(userId, updateData);
  }

  // ── List Users (Admin) ──

  async listUsers(filters) {
    return userRepository.findAll(filters);
  }

  // ── Get Distinct Districts ──

  async getDistricts() {
    return userRepository.getDistinctDistricts();
  }

  // ── Deactivate Account ──

  async deactivateAccount(userId) {
    const user = await userRepository.update(userId, { status: 'deactivated' });

    await publishEvent(EXCHANGES.USER, USER_EVENTS.ACCOUNT_DEACTIVATED, {
      userId,
    });

    return user;
  }

  // ── Change Role (Admin only) ──

  async changeUserRole(userId, newRole) {
    const validRoles = ['user', 'field-officer'];
    if (!validRoles.includes(newRole)) {
      throw HttpError.badRequest(`Invalid role. Allowed: ${validRoles.join(', ')}`);
    }

    const user = await userRepository.update(userId, { role: newRole });

    await publishEvent(EXCHANGES.USER, USER_EVENTS.ROLE_CHANGED, {
      userId,
      newRole,
    });

    return user;
  }
}

export default new UserService();
