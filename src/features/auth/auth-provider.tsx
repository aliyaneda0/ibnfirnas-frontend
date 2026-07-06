import { PropsWithChildren, createContext, useContext, useMemo, useState, createElement } from "react";

type AuthContextValue = {
  isAuthenticated: boolean;
  loginWithToken: (token: string) => void;
  logout: () => void;
  token: string | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(null);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(token),
      loginWithToken: setToken,
      logout: () => setToken(null),
      token,
    }),
    [token],
  );

  return createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
