// components/ui/animated-splash.tsx
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, Platform } from 'react-native';
import { AppText } from '@/components/ui/app-text';
import { themeColors } from '@/config/design-tokens';

// Swap this for your actual logo asset
import LogoImage from '../../../assets/images/splash-icon.png';


const useNativeDriver = Platform.OS !== 'web';

interface AnimatedSplashProps {
  onAnimationComplete: () => void;
  isAppReady: boolean;
}

export function AnimatedSplash({ onAnimationComplete, isAppReady }: AnimatedSplashProps) {
  // Logo entrance values
  const logoScale = useRef(new Animated.Value(0.85)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  // Progress dot pulse
  const dotOpacity = useRef(new Animated.Value(0.3)).current;

  // Overlay exit values
  const overlayOpacity = useRef(new Animated.Value(1)).current;
  const overlayScale = useRef(new Animated.Value(1)).current;

  // Entrance animation — runs once on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver:  useNativeDriver,
      }),
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
    ]).start();

    // Looping pulse for the "loading" dot
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotOpacity, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(dotOpacity, {
          toValue: 0.3,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Exit animation — runs when app finishes loading
  useEffect(() => {
    if (isAppReady) {
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(overlayScale, {
          toValue: 1.05,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        onAnimationComplete();
      });
    }
  }, [isAppReady]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFillObject,
        styles.container,
        {
          backgroundColor: themeColors.card,
          opacity: overlayOpacity,
          transform: [{ scale: overlayScale }],
          pointerEvents: 'none',
        },
      ]}
    >
      <Animated.Image
        source={LogoImage}
        style={[
          styles.logo,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
        resizeMode="contain"
      />

      <AppText variant="title" className="mt-4 text-center">
        Ibn Farnas
      </AppText>

      <View className="mt-6 flex-row items-center justify-center">
        <Animated.View
          style={[
            styles.dot,
            { backgroundColor: themeColors.primary, opacity: dotOpacity },
          ]}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});