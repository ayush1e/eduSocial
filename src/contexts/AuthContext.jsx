import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/apiService';

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

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');

    console.log('AuthContext initialization - Token exists:', !!token);
    console.log('AuthContext initialization - User data:', userData);

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log('Parsed user object:', parsedUser);

        // Check if this is the old nested format
        if (parsedUser.tokenType && parsedUser.user) {
          console.log('Detected old nested format, migrating to new format...');
          // Extract the actual user data and update storage
          const actualUser = parsedUser.user;
          localStorage.setItem('user', JSON.stringify(actualUser));
          setUser(actualUser);
          console.log('Migration completed. New user data:', actualUser);
        } else {
          // Already in new format or direct format
          console.log('Using direct format user data');
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []); const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      const { token, user: userInfo, ...rest } = response;

      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userInfo)); // Store only the user data
      setUser(userInfo); // Set only the user data

      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      const { token, user: userInfo, ...rest } = response;

      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userInfo)); // Store only the user data
      setUser(userInfo); // Set only the user data

      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
