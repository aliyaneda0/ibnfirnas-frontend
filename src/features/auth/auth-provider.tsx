import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";

import { apiRequest } from "@/lib/api";
import type { ApiEnvelope, AuthSession, Profile } from "@/types/api";

const TOKEN_KEY = "auth-token";
const USER_KEY = "auth-user";
const GOOGLE_WEB_CLIENT_ID =
  "282521229458-p7dk39mknn8dsc628bdc0q4qt6ba07bf.apps.googleusercontent.com";

const GOOGLE_ANDROID_CLIENT_ID =
  "282521229458-lujh1akh0qvnsugtahadjc4hc58otet9.apps.googleusercontent.com";

GoogleSignin.configure({
  webClientId:
    "282521229458-p7dk39mknn8dsc628bdc0q4qt6ba07bf.apps.googleusercontent.com",
  offlineAccess: true,
});

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

  googleLogin: () => Promise<void>;

  register: (input: RegisterInput) => Promise<void>;

  logout: () => Promise<void>;

  updateProfile: (updates: ProfileUpdateInput) => Promise<void>;

  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<void>;

  forgotPassword: (email: string) => Promise<void>;

  resetPassword: (token: string, newPassword: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    bootstrap();
  }, []);

  const bootstrap = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      const response = await apiRequest<ApiEnvelope<AuthUser>>("/api/auth/me", {
        method: "GET",
        token: storedToken,
      });

      setToken(storedToken);
      setUser(response.data);

      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(response.data));
    } catch (error) {
      console.log("Session expired");

      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);

      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const persistSession = async (jwt: string, profile: AuthUser) => {
    await SecureStore.setItemAsync(TOKEN_KEY, jwt);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(profile));

    setToken(jwt);
    setUser(profile);
  };

  const login = async (email: string, password: string) => {
    const auth = await apiRequest<ApiEnvelope<AuthSession>>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const jwt = auth.data.token;

    const profile = await apiRequest<ApiEnvelope<AuthUser>>("/api/auth/me", {
      method: "GET",
      token: jwt,
    });

    await persistSession(jwt, profile.data);
  };

  const googleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();

      const userInfo = await GoogleSignin.signIn();

      const idToken = userInfo.data?.idToken;

      if (!idToken) {
        throw new Error("No Google ID Token received");
      }

      const auth = await apiRequest<ApiEnvelope<AuthSession>>(
        "/api/auth/google",
        {
          method: "POST",
          body: JSON.stringify({
            idToken,
          }),
        },
      );

      const jwt = auth.data.token;

      const profile = await apiRequest<ApiEnvelope<AuthUser>>("/api/auth/me", {
        method: "GET",
        token: jwt,
      });

      await persistSession(jwt, profile.data);
    } catch (error: any) {
      console.log("Google Error:", error);
      console.log("Google Error Message:", error?.message);

      throw error;
    }
  };

  const register = async (input: RegisterInput) => {
    const auth = await apiRequest<ApiEnvelope<AuthSession>>(
      "/api/auth/register",
      {
        method: "POST",
        body: JSON.stringify(input),
      },
    );

    const jwt = auth.data.token;

    const profile = await apiRequest<ApiEnvelope<AuthUser>>("/api/auth/me", {
      method: "GET",
      token: jwt,
    });

    await persistSession(jwt, profile.data);
  };

  const updateProfile = async (updates: ProfileUpdateInput) => {
    if (!user || !token) return;

    const updated = {
      ...user,
      ...updates,
    };

    await persistSession(token, updated);
  };

  const changePassword = async (
    _currentPassword: string,
    _newPassword: string,
  ) => {
    throw new Error("Not implemented yet");
  };

  const forgotPassword = async (_email: string) => {};

  const resetPassword = async (_token: string, _newPassword: string) => {};

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);

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
        googleLogin,
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
