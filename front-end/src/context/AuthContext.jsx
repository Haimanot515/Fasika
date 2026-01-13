import { createContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(storage.getUser());

  const login = (userData, token) => {
    storage.setToken(token);
    storage.setUser(userData);
    setUser(userData);
  };

  const logout = () => {
    storage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};