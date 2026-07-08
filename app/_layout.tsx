import { useEffect, useState } from "react";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useFonts, Poppins_400Regular } from "@expo-google-fonts/poppins";
import {
  IBMPlexSans_600SemiBold,
  IBMPlexSans_700Bold,
} from "@expo-google-fonts/ibm-plex-sans";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "@/features/auth/auth-provider";
import { AnimatedSplash } from "@/components/ui/animated-splash";
import { LanguageProvider } from "@/i18n/i18n-provider";
import "../global.css";

SplashScreen.preventAutoHideAsync().catch(() => {});

function RootLayoutContent() {
  const { isLoading: authLoading } = useAuth();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    IBMPlexSans_600SemiBold,
    IBMPlexSans_700Bold,
  });
  const [splashAnimationComplete, setSplashAnimationComplete] = useState(false);
  const isAppReady = fontsLoaded && !authLoading;

  useEffect(() => {
    // Hand off from the native splash to the animated JS splash as soon as we can render.
    SplashScreen.hideAsync();
  }, []);

  if (!splashAnimationComplete) {
    return (
      <AnimatedSplash
        isAppReady={isAppReady}
        onAnimationComplete={() => setSplashAnimationComplete(true)}
      />
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <LanguageProvider>
          <RootLayoutContent />
        </LanguageProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
