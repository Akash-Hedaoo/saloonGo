import axios from 'axios';

// Create axios instance with base configuration
const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle both 401 (Unauthorized) and 403 (Forbidden) as potential token issues
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          console.log('Attempting to refresh token...');
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { token: accessToken, refreshToken: newRefreshToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          console.log('Token refreshed successfully');
          
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } else {
          console.log('No refresh token available');
          throw new Error('No refresh token');
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Only redirect to login if refresh token fails
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  // Customer signup
  signupCustomer: (userData) => api.post('/auth/signup/customer', userData),
  
  // Salon owner signup
  signupSalonOwner: (userData) => api.post('/auth/signup/salonOwner', userData),
  
  // Customer login
  loginCustomer: (credentials) => api.post('/auth/login/customer', credentials),
  
  // Salon owner login
  loginSalonOwner: (credentials) => api.post('/auth/login/salonOwner', credentials),
  
  // Refresh token
  refreshToken: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  
  // Logout
  logout: () => api.post('/auth/logout'),
  
  // Get current user
  getCurrentUser: () => api.get('/auth/me'),
  
  // Test authentication
  testAuth: () => api.get('/auth/test-auth'),
};

// User Management API
export const userAPI = {
  // Customer profile
  getCustomerProfile: () => api.get('/user/customer/profile'),
  updateCustomerProfile: (profileData) => api.put('/user/customer/profile', profileData),
  updateCustomerPassword: (passwordData) => api.put('/user/customer/password', passwordData),
  uploadCustomerProfileImage: (formData) => api.post('/user/customer/profile-image', formData),
  
  // Salon owner profile
  getSalonProfile: () => api.get('/user/salon/profile'),
  updateSalonProfile: (profileData) => api.put('/user/salon/profile', profileData),
  updateSalonPassword: (passwordData) => api.put('/user/salon/password', passwordData),
  uploadSalonProfileImage: (formData) => api.post('/user/salon/profile-image', formData),
  updateSalonLiveStatus: (status) => api.put('/user/salon/live-status', { isLive: status }),
  
  // Account deactivation
  deactivateAccount: () => api.put('/user/deactivate'),
};

// Salon Management API
export const salonAPI = {
  // Get all salons for search
  getAllSalons: (params = {}) => api.get('/salon/all', { params }),
  
  // Get salon profile
  getSalonProfile: (salonId) => api.get(`/salon/profile/${salonId}`),
  
  // Update salon profile (for salon owners)
  updateSalonProfile: (salonId, profileData) => api.put(`/salon/profile/${salonId}`, profileData),
  
  // Update salon owner profile and sync with salon
  updateSalonOwnerProfile: (ownerId, profileData) => api.put(`/salon/owner-profile/${ownerId}`, profileData),
  
  // Get owner's salons
  getMySalons: () => api.get('/salon/my-salons'),
  
  // Salon services
  addService: (salonId, serviceData) => api.post(`/salon/${salonId}/services`, serviceData),
  updateService: (salonId, serviceId, serviceData) => api.put(`/salon/${salonId}/services/${serviceId}`, serviceData),
  deleteService: (salonId, serviceId) => api.delete(`/salon/${salonId}/services/${serviceId}`),
  
  // Salon availability
  updateAvailability: (salonId, availabilityData) => api.put(`/salon/${salonId}/availability`, availabilityData),
};

// Utility functions
export const setAuthTokens = (accessToken, refreshToken) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const clearAuthTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

export const getAuthTokens = () => ({
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
});

export const isAuthenticated = () => {
  return !!localStorage.getItem('accessToken');
};

export default api;