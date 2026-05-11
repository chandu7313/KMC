/**
 * Auth Interceptor
 * Ensures credentials (cookies) are sent with every request.
 * In the future, this can handle token refresh logic.
 */

export const setupAuthInterceptor = (axiosInstance) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      // Cookies are sent automatically via withCredentials
      // Add any custom headers here if needed in the future
      return config;
    },
    (error) => Promise.reject(error)
  );
};
