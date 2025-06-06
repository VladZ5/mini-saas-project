// client/src/context/AuthContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import API from '../utils/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create the context with default (empty) values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: async () => {},
  register: async () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // On mount, check localStorage for an existing token. If found, verify by calling /auth/me.
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      API.get('/auth/me')
        .then((res) => {
          // If /auth/me succeeds, we get the user data back
          setUser(res.data.data);
        })
        .catch(() => {
          // If it fails (e.g. token expired or invalid), clear everything
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        });
    }
  }, []);

  // log in with email/password → store token, fetch user
  const login = async (email: string, password: string) => {
    // 1. Call login endpoint
    const res = await API.post('/auth/login', { email, password });
    const newToken = res.data.token;

    // 2. Store token in localStorage and local state
    localStorage.setItem('token', newToken);
    setToken(newToken);

    try {
      // 3. Immediately call /auth/me to get full user data
      const meRes = await API.get('/auth/me');
      setUser(meRes.data.data);
    } catch {
      // If something goes wrong, clear state
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      throw new Error('Failed to fetch user after login');
    }
  };

  // register with name/email/password → store token, fetch user
  const register = async (name: string, email: string, password: string) => {
    // 1. Call register endpoint
    const res = await API.post('/auth/register', { name, email, password });
    const newToken = res.data.token;

    // 2. Store token in localStorage and local state
    localStorage.setItem('token', newToken);
    setToken(newToken);

    try {
      // 3. Immediately call /auth/me to get full user data
      const meRes = await API.get('/auth/me');
      setUser(meRes.data.data);
    } catch {
      // If something goes wrong, clear state
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      throw new Error('Failed to fetch user after registration');
    }
  };

  // log out: remove token and user from state
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
