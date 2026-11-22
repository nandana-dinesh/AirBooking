import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('airbooking_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('airbooking_access_token');
      if (token) {
        try {
          const res = await api.get('/auth/me/');
          setUser(res.data);
          localStorage.setItem('airbooking_user', JSON.stringify(res.data));
        } catch (err) {
          console.warn('Initial session check failed, using cached user if any', err);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const res = await api.post('/auth/login/', { username, password });
      const { access, refresh, user: userData } = res.data;
      localStorage.setItem('airbooking_access_token', access);
      localStorage.setItem('airbooking_refresh_token', refresh);
      localStorage.setItem('airbooking_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Unable to log in. Please verify your credentials.';
      return { success: false, error: errorMsg };
    }
  };

  const register = async (formData) => {
    try {
      const res = await api.post('/auth/register/', formData);
      return { success: true, data: res.data };
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail ||
        (err.response?.data && Object.values(err.response.data)[0]) ||
        'Registration failed. Please check form inputs.';
      return { success: false, error: Array.isArray(errorMsg) ? errorMsg[0] : errorMsg };
    }
  };

  const logout = () => {
    localStorage.removeItem('airbooking_access_token');
    localStorage.removeItem('airbooking_refresh_token');
    localStorage.removeItem('airbooking_user');
    setUser(null);
  };

  const refreshUserProfile = async () => {
    try {
      const res = await api.get('/auth/me/');
      setUser(res.data);
      localStorage.setItem('airbooking_user', JSON.stringify(res.data));
    } catch (err) {
      console.error('Failed to refresh user profile', err);
    }
  };

  const isAdmin = Boolean(
    user && (user.role === 'admin' || user.is_staff || user.is_superuser)
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        isAdmin,
        login,
        register,
        logout,
        refreshUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
