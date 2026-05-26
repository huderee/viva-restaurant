import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // Эхлэлд token байгаа эсэхийг шалгах
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      // Token-г verify хийж хэрэглэгчийн мэдээлэл авах
      fetchUserData(token);
    } else {
      setInitializing(false);
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      api.setToken(token);
      const data = await api.get('/auth/me');
      setUser(data.user);
      setIsAuthenticated(true);
    } catch (err) {
      if (err.message !== 'Unauthorized') {
        console.error('Auth check error:', err);
      }
      logout();
    } finally {
      setInitializing(false);
    }
  };

  const login = useCallback(async (username, password) => {
    try {
      const data = await api.post('/auth/login', { username, password });
      if (data.token) {
        api.setToken(data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        return { ok: true, user: data.user };
      }
      return { ok: false, message: 'Нэвтрэх амжилтгүй' };
    } catch (err) {
      return { ok: false, message: err.message || 'Нэвтрэхэд алдаа гарлаа' };
    }
  }, []);

  // Public customer бүртгэл
  const register = useCallback(async ({ username, password, name, email, phone }) => {
    try {
      const data = await api.post('/auth/register-customer', {
        username, password, name, email, phone: phone || ''
      });
      if (data.token) {
        api.setToken(data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        return { ok: true, user: data.user };
      }
      return { ok: false, message: 'Бүртгэл амжилтгүй' };
    } catch (err) {
      return { ok: false, message: err.message || 'Бүртгэхэд алдаа гарлаа' };
    }
  }, []);

  const logout = useCallback(() => {
    api.setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // 🔑 Generic API request wrapper — components can call any endpoint via context
  const apiRequest = useCallback(async (endpoint, options = {}) => {
    const method = (options.method || 'GET').toUpperCase();
    if (method === 'GET')    return api.get(endpoint, options.signal);
    if (method === 'POST')   return api.post(endpoint, options.body);
    if (method === 'PUT')    return api.put(endpoint, options.body);
    if (method === 'DELETE') return api.delete(endpoint);
    throw new Error(`Unsupported method: ${method}`);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      initializing,
      login,
      register,
      logout,
      apiRequest
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
