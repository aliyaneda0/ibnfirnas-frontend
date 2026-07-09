// app/index.tsx
import { Redirect } from 'expo-router';
import { useAuth } from '@/features/auth/auth-provider';

// Browsing is public — Products/Services/Gallery/Home don't require login.
// Auth is only enforced where an action needs it (e.g. Profile prompts to
// log in when logged out).
export default function Index() {
  const { isLoading } = useAuth();

  if (isLoading) return null; // _layout.tsx is already showing splash during this

  return <Redirect href="/(tabs)/Home" />;
}
