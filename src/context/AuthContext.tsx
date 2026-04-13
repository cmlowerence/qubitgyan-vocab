// src/context/AuthContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, Tokens, Role } from '../types';
import { apiClient } from '../api/client';
import { ENDPOINTS } from '../api/endpoints';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (tokens: Tokens) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const deriveRole = (rawUser: any): Role => {
    if (rawUser.is_superuser) return 'superadmin';
    if (rawUser.is_staff) return 'admin';
    return 'student';
  };

  const fetchUser = async () => {
    try {
      const { data } = await apiClient.get(ENDPOINTS.auth.me);
      setUser({ ...data, role: deriveRole(data) });
    } catch (error) {
      setUser(null);
      localStorage.clear();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (tokens: Tokens) => {
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    setIsLoading(true);
    await fetchUser();
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

