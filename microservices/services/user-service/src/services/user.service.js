import { HttpError, createLogger } from '@kissan/shared';
import userRepository from '../repositories/user.repository.js';
import addressRepository from '../repositories/address.repository.js';

const logger = createLogger('user-service');

/**
 * Business service for user profiles, preferences, and admin user operations.
 */
class UserService {
  // ── Get Profile ──

  async getUserData(userId, tokenUser) {
    try {
      let user = await userRepository.findById(userId,
        'id, name, email, phone, role, is_account_verified, language, preferred_language, has_completed_tour, has_completed_survey, simple_mode, district, crops'
      );

      let isAdmin = false;

      if (!user) {
        const { default: adminRepo } = await import('../repositories/admin-user.repository.js');
        user = await adminRepo.findById(userId);
        if (!user) throw HttpError.notFound('User not found');
        isAdmin = true;
      }

      // Fetch addresses (only for regular users)
      let addresses = [];
      let survey = null;
      if (!isAdmin) {
        try {
          addresses = await addressRepository.findByUserId(userId);
          
          const { default: surveyService } = await import('./survey.service.js');
          const surveyResult = await surveyService.getSurveyStatus(userId);
          survey = surveyResult.surveyData;
        } catch (err) {
          logger.warn('Failed to fetch user auxiliary data', { userId, error: err.message });
        }
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isAccountVerified: user.is_account_verified || user.isAccountVerified || false,
        language: user.language || 'en',
        preferredLanguage: user.preferred_language || user.preferredLanguage || 'en',
        hasCompletedTour: user.has_completed_tour || user.hasCompletedTour || false,
        hasCompletedSurvey: user.has_completed_survey || user.hasCompletedSurvey || false,
        simpleMode: user.simple_mode || user.simpleMode || false,
        district: user.district,
        crops: user.crops || [],
        addresses,
        survey,
        isAdminUser: isAdmin,
      };

    } catch (err) {
      // ── Fallback: return mock profile from JWT token data when DB is down ──
      logger.warn(`getUserData DB failed (${err.message}), returning mock profile from token`, { userId });

      if (tokenUser) {
        return {
          id: tokenUser.id || userId,
          name: tokenUser.name || 'User',
          email: tokenUser.email || '',
          phone: tokenUser.phone || '',
          role: tokenUser.role || 'user',
          isAccountVerified: tokenUser.isAccountVerified || true,
          language: 'en',
          preferredLanguage: 'en',
          hasCompletedTour: true,
          hasCompletedSurvey: true,
          simpleMode: false,
          district: tokenUser.district || '',
          crops: tokenUser.crops || [],
          addresses: [],
          isAdminUser: ['super_admin', 'admin', 'tech_admin', 'agri_expert',
            'ecommerce_manager', 'order_manager', 'support_agent', 'support_manager',
            'content_manager', 'finance_manager', 'field_agent'].includes(tokenUser.role),
          _mock: true,
        };
      }

      // No token data available — return minimal mock
      return {
        id: userId,
        name: 'User',
        email: '',
        phone: '',
        role: 'user',
        isAccountVerified: true,
        language: 'en',
        preferredLanguage: 'en',
        hasCompletedTour: true,
        hasCompletedSurvey: true,
        simpleMode: false,
        district: '',
        crops: [],
        addresses: [],
        isAdminUser: false,
        _mock: true,
      };
    }
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

    try {
      const user = await userRepository.update(userId, filteredUpdates);
      return user;
    } catch (err) {
      logger.warn(`updateProfile DB failed (${err.message}), returning input as-is`, { userId });
      return { id: userId, ...filteredUpdates, _mock: true };
    }
  }

  // ── Language ──

  async updateLanguage(userId, language) {
    if (!['en', 'hi', 'te'].includes(language)) {
      throw HttpError.badRequest('Invalid language. Supported: en, hi, te');
    }
    try {
      return await userRepository.update(userId, { language });
    } catch (err) {
      logger.warn(`updateLanguage DB failed (${err.message}), returning success`, { userId });
      return { id: userId, language, _mock: true };
    }
  }

  // ── Preferences ──

  async updatePreferences(userId, prefs) {
    const updateData = {};
    if (prefs.preferredLanguage !== undefined) updateData.preferredLanguage = prefs.preferredLanguage;
    if (prefs.hasCompletedTour !== undefined) updateData.hasCompletedTour = prefs.hasCompletedTour;
    if (prefs.simpleMode !== undefined) updateData.simpleMode = prefs.simpleMode;

    // If nothing to update, return success immediately (don't throw)
    if (Object.keys(updateData).length === 0) {
      return { id: userId, synced: true, _noChanges: true };
    }

    try {
      return await userRepository.update(userId, updateData);
    } catch (err) {
      // ── Preferences sync is non-critical — don't crash ──
      logger.warn(`updatePreferences DB failed (${err.message}), returning success`, { userId });
      return { id: userId, ...updateData, synced: false, _mock: true };
    }
  }

  // ── List Users (Admin) ──

  async listUsers(filters) {
    try {
      return await userRepository.findAll(filters);
    } catch (err) {
      logger.warn(`listUsers DB failed (${err.message}), returning empty`, {});
      return { users: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } };
    }
  }

  // ── Get Distinct Districts ──

  async getDistricts() {
    try {
      return await userRepository.getDistinctDistricts();
    } catch (err) {
      logger.warn(`getDistricts DB failed (${err.message}), returning empty`, {});
      return [];
    }
  }

  // ── Deactivate Account ──

  async deactivateAccount(userId) {
    const user = await userRepository.update(userId, { status: 'deactivated' });
    return user;
  }

  // ── Change Role (Admin only) ──

  async changeUserRole(userId, newRole) {
    const validRoles = ['user', 'field-officer'];
    if (!validRoles.includes(newRole)) {
      throw HttpError.badRequest(`Invalid role. Allowed: ${validRoles.join(', ')}`);
    }

    const user = await userRepository.update(userId, { role: newRole });
    return user;
  }
}

export default new UserService();
