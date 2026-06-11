import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';
import api from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const res = await authService.getProfile();
          setUser(res.data);
        } catch (error) {
          console.error('Failed to fetch profile', error);
          localStorage.removeItem('accessToken');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    const { accessToken, ...userData } = res.data;
    localStorage.setItem('accessToken', accessToken);
    setUser(userData);
    return res;
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    const { accessToken, ...newUserData } = res.data;
    localStorage.setItem('accessToken', accessToken);
    setUser(newUserData);
    return res;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem('accessToken');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
