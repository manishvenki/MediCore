import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authService, LoginCredentials } from '../services/authService';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('medicore_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('medicore_token');
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifyExistingAuth = async () => {
      const savedToken = localStorage.getItem('medicore_token');
      if (savedToken) {
        try {
          const freshUser = await authService.getMe();
          setUser(freshUser);
          localStorage.setItem('medicore_user', JSON.stringify(freshUser));
        } catch (error) {
          console.warn('Session expired or invalid, clearing local session.');
          localStorage.removeItem('medicore_token');
          localStorage.removeItem('medicore_user');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    verifyExistingAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const authData = await authService.login(credentials);
    setToken(authData.token);
    setUser(authData.user);
    localStorage.setItem('medicore_token', authData.token);
    localStorage.setItem('medicore_user', JSON.stringify(authData.user));
  };

  const logout = () => {
    localStorage.removeItem('medicore_token');
    localStorage.removeItem('medicore_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
