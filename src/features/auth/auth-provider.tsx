// import { PropsWithChildren, createContext, useContext, useMemo, useState, createElement } from "react";

// type AuthContextValue = {
//   isAuthenticated: boolean;
//   loginWithToken: (token: string) => void;
//   logout: () => void;
//   token: string | null;
// };

// const AuthContext = createContext<AuthContextValue | null>(null);

// export function AuthProvider({ children }: PropsWithChildren) {
//   const [token, setToken] = useState<string | null>(null);

//   const value = useMemo<AuthContextValue>(
//     () => ({
//       isAuthenticated: Boolean(token),
//       loginWithToken: setToken,
//       logout: () => setToken(null),
//       token,
//     }),
//     [token],
//   );

//   return createElement(AuthContext.Provider, { value }, children);
// }

// export function useAuth() {
//   const context = useContext(AuthContext);

//   if (!context) {
//     throw new Error("useAuth must be used inside AuthProvider");
//   }

//   return context;
// }


import React, { createContext, useContext, useState, useEffect } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  user: any | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
  const loadToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('jwt');
      if (storedToken) {
        setToken(storedToken);
      }
    } catch (e) {
      console.error('Failed to load token', e);
    } finally {
      setIsLoading(false); // always runs now, even on error
    }
  };
  loadToken();
}, []);

  const login = async (email: string, password: string) => {
    // Call your Spring Boot /login endpoint
    const response = await fetch('YOUR_BACKEND_URL/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      const jwt = data.token;
      if (typeof window !== 'undefined') await AsyncStorage.setItem('jwt', jwt);
      setToken(jwt);
      setUser(data.user); // if backend returns user info
      router.replace('./../(tabs)'); // navigate to main tabs
    } else {
      throw new Error(data.message || 'Login failed');
    }
  };

  const logout = async () => {
    if (typeof window !== 'undefined') await AsyncStorage.removeItem('jwt');
    setToken(null);
    setUser(null);
    router.replace('/(auth)/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};