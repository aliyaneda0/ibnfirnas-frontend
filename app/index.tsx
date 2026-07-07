// app/index.tsx
import { Redirect } from 'expo-router';
import { useAuth } from '@/features/auth/auth-provider';

export default function Index() {
  const { token, isLoading } = useAuth();

  if (isLoading) return null; // _layout.tsx is already showing splash during this

  if (!token) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href ="/(tabs)/Home" />; // or wherever your main app lives
}
