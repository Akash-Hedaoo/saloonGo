import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, setAuthTokens, clearAuthTokens, isAuthenticated } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        if (isAuthenticated()) {
          const response = await authAPI.getCurrentUser();
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        clearAuthTokens();
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Customer signup
  const signupCustomer = async (userData) => {
    try {
      setError(null);
      const response = await authAPI.signupCustomer(userData);
      const { token, refreshToken, user } = response.data;
      
      setAuthTokens(token, refreshToken);
      setUser(user);
      
      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Signup failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Salon owner signup
  const signupSalonOwner = async (userData) => {
    try {
      setError(null);
      const response = await authAPI.signupSalonOwner(userData);
      const { token, refreshToken, salon } = response.data;
      
      setAuthTokens(token, refreshToken);
      setUser(salon);
      
      return { success: true, user: salon };
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Signup failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Customer login
  const loginCustomer = async (credentials) => {
    try {
      setError(null);
      const response = await authAPI.loginCustomer(credentials);
      const { token, refreshToken, user } = response.data;
      
      setAuthTokens(token, refreshToken);
      setUser(user);
      
      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Salon owner login
  const loginSalonOwner = async (credentials) => {
    try {
      setError(null);
      const response = await authAPI.loginSalonOwner(credentials);
      const { token, refreshToken, salon } = response.data;
      
      setAuthTokens(token, refreshToken);
      setUser(salon);
      
      return { success: true, user: salon };
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuthTokens();
      setUser(null);
      setError(null);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    signupCustomer,
    signupSalonOwner,
    loginCustomer,
    loginSalonOwner,
    logout,
    clearError,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 