import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

import type { Profile, UserRole } from "@/types/api";

const TOKEN_KEY = "auth-token";
const USER_KEY = "auth-user";

type AuthUser = Profile;

type RegisterInput = {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
};

type ProfileUpdateInput = Partial<
  Pick<AuthUser, "fullName" | "phone" | "avatarUrl">
>;

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: ProfileUpdateInput) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// No backend yet — this mocks auth locally and persists only the token/user
// on-device. Shaped exactly like `GET /api/profile` + `POST /api/auth/*` so
// wiring the real API later only touches this file, not any screen.
let mockUserId = 1;
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

        const parsedUser: AuthUser | null = storedUser ? JSON.parse(storedUser) : null;

        // A session persisted before a mock-user schema change (e.g. `role`
        // added in the 2026-07-10 auth rebuild) can be missing fields the
        // rest of the app assumes are always present. Drop it rather than
        // crash screens that read those fields.
        if (parsedUser && (!parsedUser.role || !parsedUser.email)) {
          await Promise.all([
            SecureStore.deleteItemAsync(TOKEN_KEY),
            SecureStore.deleteItemAsync(USER_KEY),
          ]);
        } else {
          if (storedToken) {
            setToken(storedToken);
          }
          if (parsedUser) {
            setUser(parsedUser);
          }
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

  const login = async (email: string, password: string) => {
    if (!email.trim() || !password.trim()) {
      throw new Error("Email and password are required");
    }

    await persistSession(createMockToken(), {
      id: mockUserId++,
      email,
      fullName: email.split("@")[0],
      phone: null,
      avatarUrl: null,
      role: "ROLE_USER" as UserRole,
      isActive: true,
      createdAt: new Date().toISOString(),
    });
  };

  const register = async ({ fullName, email, password, phone }: RegisterInput) => {
    if (!fullName.trim() || !email.trim() || password.trim().length < 6) {
      throw new Error("Full name, email, and a password of at least 6 characters are required");
    }

    // Real `POST /api/auth/register` returns a token directly — auto-login,
    // no separate login call and no OTP step.
    await persistSession(createMockToken(), {
      id: mockUserId++,
      email,
      fullName,
      phone: phone?.trim() || null,
      avatarUrl: null,
      role: "ROLE_USER" as UserRole,
      isActive: true,
      createdAt: new Date().toISOString(),
    });
  };

  const updateProfile = async (updates: ProfileUpdateInput) => {
    if (!user) return;
    await persistSession(token ?? createMockToken(), { ...user, ...updates });
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!currentPassword.trim()) {
      throw new Error("Current password is required to set new password");
    }
    if (newPassword.trim().length < 6) {
      throw new Error("New password must be at least 6 characters");
    }
    // Mocked — nothing to persist, the backend owns the password hash.
  };

  const forgotPassword = async (_email: string) => {
    // Mocked — always resolves with a generic confirmation, regardless of
    // whether the email is registered (matches the real endpoint's behavior).
  };

  const resetPassword = async (token: string, newPassword: string) => {
    if (!token.trim()) {
      throw new Error("Reset token is required");
    }
    if (newPassword.trim().length < 6) {
      throw new Error("New password must be at least 6 characters");
    }
    // Mocked — nothing to persist yet.
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
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        forgotPassword,
        resetPassword,
      }}
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
