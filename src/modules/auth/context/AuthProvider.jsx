import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Al cargar la app, revisamos si ya hay un token guardado
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const loginSession = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const logoutSession = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loginSession, logoutSession, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};