import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef, useState } from "react";
import { Animated, StatusBar, StyleSheet, View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { themeColors } from "@/config/design-tokens";

// Step 3a: Prevent the native splash screen from hiding immediately
SplashScreen.preventAutoHideAsync().catch(() => {
  /* Prevent unmount errors */
});

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  // Step 3b: Set up an opacity value for our custom smooth fade-out (1 = fully visible)
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    async function prepareSystem() {
      try {
        // Simulate data loading, auth token checks, or asset loading (2.5 seconds)
        await new Promise((resolve) => setTimeout(resolve, 2500));
      } catch (e) {
        console.warn(e);
      } finally {
        // Signal that core background tasks are finished
        setAppIsReady(true);
      }
    }

    prepareSystem();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      // Step 3c: Hide the underlying native splash layer
      SplashScreen.hideAsync();

      // Step 3d: Trigger our custom 500ms fade-out transition
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        // Remove the overlay from memory completely when finished
        setAnimationComplete(true);
      });
    }
  }, [appIsReady, fadeAnim]);

  // Render a clean background frame if system processing hasn't initialized
  if (!appIsReady && !animationComplete) {
    return null;
  }

  return (
    <View className="flex-1">
      <StatusBar barStyle="dark-content" />

      {/* Your Actual App Screens Go Here */}
      <View className="flex-1 items-center justify-center bg-background">
        <AppText className="text-center" variant="title">
          Welcome to Your App!
        </AppText>
      </View>

      {/* Custom Animated Splash Overlay holding your white screen layout */}
      {!animationComplete && (
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: themeColors.card,
              opacity: fadeAnim,
            },
          ]}
        />
      )}
    </View>
  );
}


