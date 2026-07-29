import { Redirect } from "expo-router";
import { useAuth } from "@/features/auth/auth-provider";

export default function Index() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (user) {
    return <Redirect href="/(tabs)/Home" />;
  }

  return <Redirect href="/(auth)/login" />;
}