import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: "Back",
      }}
    >
      <Stack.Screen name="language" options={{ title: "Language" }} />
      <Stack.Screen name="login" options={{ title: "Login" }} />
    </Stack>
  );
}
