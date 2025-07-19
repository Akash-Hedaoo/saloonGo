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

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
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