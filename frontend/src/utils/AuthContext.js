import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [tenant, setTenant] = useState(JSON.parse(localStorage.getItem('tenant') || 'null'));

  const login = (token, tenant) => {
    localStorage.setItem('token', token);
    localStorage.setItem('tenant', JSON.stringify(tenant));
    setToken(token);
    setTenant(tenant);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tenant');
    setToken(null);
    setTenant(null);
  };

  return (
    <AuthContext.Provider value={{ token, tenant, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};