import { Stack ,Redirect } from "expo-router";
import { useAuth } from '@/features/auth/auth-provider';

// export default function AuthLayout() {
//   return (
//     <Stack
//       screenOptions={{
//         headerBackTitle: "Back",
//       }}
//     >
//       <Stack.Screen name="language" options={{ title: "Language" }} />
//       <Stack.Screen name="login" options={{ title: "Login" }} />
//     </Stack>
//   );
// }



export default function AuthLayout() {
  const { token } = useAuth();
  if (token) return <Redirect href="./../(tabs)" />;
  return <Stack />;
}