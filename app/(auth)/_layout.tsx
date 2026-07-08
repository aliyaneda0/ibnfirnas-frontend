import { Stack, Redirect } from "expo-router";
import { useAuth } from "@/features/auth/auth-provider";

export default function AuthLayout() {
  const { token } = useAuth();

  if (token) return <Redirect href="/(tabs)/Home" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
