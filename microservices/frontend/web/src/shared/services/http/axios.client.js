import axios from 'axios';

// Get API URL from environment variable, default to localhost for development
const baseURL = import.meta.env.REACT_APP_API_URL || 'http://localhost';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default apiClient;

// Request Interceptor: Attach Auth Token if needed
apiClient.interceptors.request.use(
  (config) => {
    // In a real scenario, you might get this from Zustand or localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add Request ID for tracing (matches nginx conf)
    config.headers['X-Request-ID'] = crypto.randomUUID?.() || Date.now().toString();
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Global Error Handling
apiClient.interceptors.response.use(
  (response) => {
    // Direct return of data if successful
    return response.data;
  },
  (error) => {
    // Global handling of 401 Unauthorized, etc.
    if (error.response?.status === 401) {
      // e.g. trigger logout
      console.warn('Unauthorized access, maybe redirect to login');
    }
    
    // Normalize error format
    const customError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      status: error.response?.status,
      data: error.response?.data,
    };
    
    return Promise.reject(customError);
  }
);
