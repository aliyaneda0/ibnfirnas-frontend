// components/ui/animated-splash.tsx
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, StyleSheet, View, Platform } from 'react-native';
import { themeColors, themeFontFamily } from '@/config/design-tokens';

// Swap this for your actual logo asset
import LogoImage from '../../../assets/images/splash-icon.png';


const useNativeDriver = Platform.OS !== 'web';
// How long to hold on the brand-blue background before handing off to the
// real (already-blue) screen behind it, so the color transition never gets
// cut short by app-ready resolving instantly.
const HOLD_AFTER_COLOR_SHIFT_MS = 500;

interface AnimatedSplashProps {
  onAnimationComplete: () => void;
  isAppReady: boolean;
}

export function AnimatedSplash({ onAnimationComplete, isAppReady }: AnimatedSplashProps) {
  // Logo entrance values
  const logoScale = useRef(new Animated.Value(0.85)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  // Wordmark entrance values — animates in just after the logo, not before it
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(8)).current;

  // Progress dot pulse
  const dotOpacity = useRef(new Animated.Value(0.3)).current;

  // Background color shift — white while the logo introduces itself, then
  // shifts to brand blue (color animation isn't native-driver compatible).
  const bgProgress = useRef(new Animated.Value(0)).current;

  // Overlay exit values
  const overlayOpacity = useRef(new Animated.Value(1)).current;
  const overlayScale = useRef(new Animated.Value(1)).current;

  const [readyToExit, setReadyToExit] = useState(false);

  // Entrance animation — runs once on mount. The logo fully settles with a
  // gentle spring before the wordmark starts fading in beneath it, so the
  // sequence always reads as "logo, then text". Once both are in, the
  // background shifts from white to brand blue.
  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: useNativeDriver,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6,
          tension: 60,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 320,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: useNativeDriver,
        }),
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 320,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      Animated.timing(bgProgress, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => setReadyToExit(true), HOLD_AFTER_COLOR_SHIFT_MS);
      });
    });

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

  // Exit animation — runs once the app is ready AND the color shift has held
  useEffect(() => {
    if (isAppReady && readyToExit) {
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
  }, [isAppReady, readyToExit]);

  const backgroundColor = bgProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [themeColors.card, themeColors.primary],
  });
  const textColor = bgProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [themeColors.text, '#FFFFFF'],
  });
  const dotColor = bgProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [themeColors.primary, '#FFFFFF'],
  });

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        styles.container,
        {
          backgroundColor,
          opacity: overlayOpacity,
          transform: [{ scale: overlayScale }],
          pointerEvents: 'none',
        },
      ]}
    >
      <Animated.View
        style={{
          opacity: logoOpacity,
          transform: [{ scale: logoScale }],
        }}
      >
         <View style={styles.logoCard}>
          <Image source={LogoImage} style={styles.logo} resizeMode="contain" />
        </View> 
      </Animated.View>

      <Animated.Text
        style={[
          styles.wordmark,
          {
            color: textColor,
            opacity: textOpacity,
            transform: [{ translateY: textTranslateY }],
          },
        ]}
      >
        Ibn Firnas
      </Animated.Text>

      <View className="mt-6 flex-row items-center justify-center">
        <Animated.View
          style={[styles.dot, { backgroundColor: dotColor, opacity: dotOpacity }]}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  logoCard: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    borderRadius: 22,
    backgroundColor: themeColors.card,
  },
  logo: {
    width: 82,
    height: 82,
  },
  wordmark: {
    marginTop: 16,
    fontFamily: themeFontFamily.bold[0],
    fontSize: 24,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
