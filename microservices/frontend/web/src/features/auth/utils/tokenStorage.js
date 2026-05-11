/**
 * Token/Session Storage Utilities
 * Centralized helpers for managing auth-related localStorage data.
 */
import { STORAGE_KEYS } from '../../../shared/utils/constants';

/**
 * Get the preferences to sync with the backend after login
 */
export const getLocalPreferences = () => {
  return {
    preferredLanguage: localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'en',
    hasCompletedTour:
      localStorage.getItem(STORAGE_KEYS.KMC_TOUR_COMPLETED) === 'true' ||
      localStorage.getItem(STORAGE_KEYS.TOUR_COMPLETED) === 'true',
    simpleMode: localStorage.getItem(STORAGE_KEYS.FARMER_MODE) === 'true',
  };
};

/**
 * Clear all auth-related storage on logout
 */
export const clearAuthStorage = () => {
  // We don't clear language or tour preferences on logout
  // Those are device-level settings, not user-level
};
