import { useAuth } from "@/features/auth/auth-provider";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  const { token } = useAuth();

  if (token) return <Redirect href="/(tabs)/Home" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
