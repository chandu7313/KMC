/**
 * Error Interceptor
 * Centralized error handling for all API responses.
 * - 401: Redirect to login
 * - 403: Show forbidden message
 * - 500: Show generic server error
 */
import { toast } from 'react-toastify';

export const setupErrorInterceptor = (axiosInstance) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;

      switch (status) {
        case 401:
          // Only redirect if not already on login page
          if (!window.location.pathname.includes('/login')) {
            toast.error('Session expired. Please login again.');
            // Allow the calling code to handle redirect if needed
          }
          break;
        case 403:
          toast.error('Access denied. You do not have permission.');
          break;
        case 429:
          toast.warning('Too many requests. Please slow down.');
          break;
        case 500:
          toast.error('Server error. Please try again later.');
          break;
        default:
          // Let individual API calls handle their own specific errors
          break;
      }

      return Promise.reject(error);
    }
  );
};
