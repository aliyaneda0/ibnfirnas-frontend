import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "auth-token";
const USER_KEY = "auth-user";

type AuthUser = {
  id: string;
  name?: string;
  email?: string;
  phone: string;
  location?: string;
};

type RegisterInput = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Omit<AuthUser, "id">>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// No backend yet — this mocks auth locally and persists only the token/user on-device.
function createMockToken() {
  return `mock-token-${Date.now()}`;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const [storedToken, storedUser] = await Promise.all([
          SecureStore.getItemAsync(TOKEN_KEY),
          SecureStore.getItemAsync(USER_KEY),
        ]);

        if (storedToken) {
          setToken(storedToken);
        }
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error("Failed to load auth session", e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrap();
  }, []);

  const persistSession = async (nextToken: string, nextUser: AuthUser) => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, nextToken);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(nextUser));
    } catch (e) {
      // Don't block the session on a storage failure — the user stays logged in for this run.
      console.error("Failed to persist auth session", e);
    }
    setToken(nextToken);
    setUser(nextUser);
  };

  const login = async (phone: string, password: string) => {
    if (!phone.trim() || !password.trim()) {
      throw new Error("Phone and password are required");
    }

    await persistSession(createMockToken(), {
      id: phone,
      phone,
    });
  };

  const register = async ({ name, email, phone, password }: RegisterInput) => {
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      throw new Error("All fields are required");
    }

    // No backend yet — this just simulates account creation. It does not log
    // the user in; the OTP verification screen routes them to Login instead.
  };

  const updateProfile = async (updates: Partial<Omit<AuthUser, "id">>) => {
    if (!user) return;
    await persistSession(token ?? createMockToken(), { ...user, ...updates });
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
    } catch (e) {
      console.error("Failed to clear auth session", e);
    }
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, register, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
