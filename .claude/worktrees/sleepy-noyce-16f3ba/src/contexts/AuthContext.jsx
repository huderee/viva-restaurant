import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState(''); // Алдааны мессеж хадгалах

  // Эхлэхэд токен шалгах
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      setIsAuthenticated(true);
    }
    setInitializing(false);
  }, []);

  // Нэвтрэх функц (backend руу хүсэлт илгээнэ)
  const login = async (username, password) => {
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (data.success) {
        localStorage.setItem('admin_token', data.token);
        setIsAuthenticated(true);
        return true;
      } else {
        setError(data.message || 'Нэвтрэхэд алдаа гарлаа');
        return false;
      }
    } catch (err) {
      setError('Сервертэй холбогдож чадсангүй');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setError('');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, initializing, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}