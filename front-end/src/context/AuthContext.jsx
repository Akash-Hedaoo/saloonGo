import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, setAuthTokens, clearAuthTokens, isAuthenticated } from '../services/api';

const AuthContext = createContext();

export { AuthContext };

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
        console.log('AuthContext: Checking authentication status...');
        
        // For hackathon prototype, just check if we have tokens
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (accessToken && refreshToken) {
          console.log('AuthContext: Tokens found, getting current user...');
          try {
            const response = await authAPI.getCurrentUser();
            console.log('AuthContext: Current user response:', response.data);
            setUser(response.data.user);
          } catch (error) {
            console.log('AuthContext: Could not get current user, using stored data');
            // For hackathon, just use stored user data if available
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
              setUser(JSON.parse(storedUser));
            }
          }
        } else {
          console.log('AuthContext: No tokens found');
        }
      } catch (error) {
        console.error('AuthContext: Auth check failed:', error);
        // Don't clear tokens for hackathon prototype
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
      
      // Store user data in localStorage for hackathon prototype
      localStorage.setItem('user', JSON.stringify(salon));
      
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
      
      // Store user data in localStorage for hackathon prototype
      localStorage.setItem('user', JSON.stringify(salon));
      
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
      localStorage.removeItem('user'); // Clear stored user data
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