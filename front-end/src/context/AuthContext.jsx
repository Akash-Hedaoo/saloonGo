import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Dummy users for demo
  const dummyUsers = {
    customers: [
      { email: 'john@example.com', password: 'Password123', name: 'John Doe', phone: '+1234567890', id: 'cust1', userType: 'customer' },
      { email: 'jane@example.com', password: 'Password123', name: 'Jane Smith', phone: '+1234567891', id: 'cust2', userType: 'customer' },
      { email: 'demo@customer.com', password: 'demo123', name: 'Demo Customer', phone: '+1234567892', id: 'cust3', userType: 'customer' }
    ],
    salonOwners: [
      { email: 'salon@elite.com', password: 'Password123', name: 'Elite Beauty Salon', phone: '+1234567893', id: 'salon1', userType: 'salonOwner' },
      { email: 'glamour@studio.com', password: 'Password123', name: 'Glamour Studio', phone: '+1234567894', id: 'salon2', userType: 'salonOwner' },
      { email: 'demo@salon.com', password: 'demo123', name: 'Demo Salon', phone: '+1234567895', id: 'salon3', userType: 'salonOwner' }
    ]
  };

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        console.log('AuthContext: Checking authentication status...');
        
        // Check for stored user data
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('accessToken');
        
        if (storedUser && storedToken) {
          console.log('AuthContext: Found stored user data');
          setUser(JSON.parse(storedUser));
        } else {
          console.log('AuthContext: No stored user data found');
        }
      } catch (error) {
        console.error('AuthContext: Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Unified login function
  const login = async (credentials) => {
    try {
      setError(null);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { email, password, userType } = credentials;
      const users = userType === 'customer' ? dummyUsers.customers : dummyUsers.salonOwners;
      
      const foundUser = users.find(user => 
        user.email === email && user.password === password
      );
      
      if (foundUser) {
        // Create a token (in real app, this would come from server)
        const token = `dummy_token_${Date.now()}`;
        const refreshToken = `dummy_refresh_${Date.now()}`;
        
        // Store tokens and user data
        localStorage.setItem('accessToken', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(foundUser));
        
        setUser(foundUser);
        
        return { success: true, user: foundUser };
      } else {
        setError('Invalid email or password');
        return { success: false, error: 'Invalid email or password' };
      }
    } catch (error) {
      const errorMessage = 'Login failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Unified signup function
  const signup = async (userData) => {
    try {
      setError(null);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { email, password, name, phone, userType } = userData;
      const users = userType === 'customer' ? dummyUsers.customers : dummyUsers.salonOwners;
      
      // Check if user already exists
      const existingUser = users.find(user => user.email === email);
      if (existingUser) {
        setError('User with this email already exists');
        return { success: false, error: 'User with this email already exists' };
      }
      
      // Create new user
      const newUser = {
        id: `${userType === 'customer' ? 'cust' : 'salon'}${Date.now()}`,
        email,
        password,
        name,
        phone,
        userType,
        createdAt: new Date().toISOString()
      };
      
      // Add to dummy users (in real app, this would be saved to database)
      users.push(newUser);
      
      // Create tokens
      const token = `dummy_token_${Date.now()}`;
      const refreshToken = `dummy_refresh_${Date.now()}`;
      
      // Store tokens and user data
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      setUser(newUser);
      
      return { success: true, user: newUser };
    } catch (error) {
      const errorMessage = 'Signup failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Salon owner signup function
  const signupSalonOwner = async (userData) => {
    try {
      setError(null);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { email, password, fullName, phoneNumber, salonName, salonAddress, servicesOffered, openHours, city, state, pincode } = userData;
      
      // Check if user already exists
      const existingUser = dummyUsers.salonOwners.find(user => user.email === email);
      if (existingUser) {
        setError('A salon with this email already exists');
        return { success: false, error: 'A salon with this email already exists' };
      }
      
      // Create new salon owner
      const newSalonOwner = {
        id: `salon${Date.now()}`,
        email,
        password,
        name: fullName,
        phone: phoneNumber,
        userType: 'salonOwner',
        salonName,
        salonAddress,
        servicesOffered,
        openHours,
        city,
        state,
        pincode,
        createdAt: new Date().toISOString()
      };
      
      // Add to dummy users
      dummyUsers.salonOwners.push(newSalonOwner);
      
      // Create tokens
      const token = `dummy_token_${Date.now()}`;
      const refreshToken = `dummy_refresh_${Date.now()}`;
      
      // Store tokens and user data
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(newSalonOwner));
      
      setUser(newSalonOwner);
      
      return { success: true, user: newSalonOwner };
    } catch (error) {
      const errorMessage = 'Salon registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Logout
  const logout = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all stored data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
      setError(null);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Get current user (for API compatibility)
  const getCurrentUser = () => {
    return user;
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    signupSalonOwner,
    logout,
    clearError,
    getCurrentUser,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 