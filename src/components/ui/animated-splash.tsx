// components/ui/animated-splash.tsx
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, StyleSheet, View, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { themeColors, themeFontFamily } from '@/config/design-tokens';

// Swap this for your actual logo asset
import LogoImage from '../../../assets/images/splash-icon.png';


const useNativeDriver = Platform.OS !== 'web';
// How long to hold on the fully-settled splash before handing off to the
// real screen behind it, so the entrance animation never gets cut short by
// app-ready resolving instantly.
const HOLD_BEFORE_EXIT_MS = 500;

interface AnimatedSplashProps {
  onAnimationComplete: () => void;
  isAppReady: boolean;
}

export function AnimatedSplash({ onAnimationComplete, isAppReady }: AnimatedSplashProps) {
  // Logo entrance values — scale-up-from-90%-to-100% + fade-in, per spec
  const logoScale = useRef(new Animated.Value(0.9)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  // Wordmark entrance values — animates in just after the logo, not before it
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(8)).current;

  // Progress dot pulse
  const dotOpacity = useRef(new Animated.Value(0.3)).current;

  // Overlay exit values
  const overlayOpacity = useRef(new Animated.Value(1)).current;
  const overlayScale = useRef(new Animated.Value(1)).current;

  const [readyToExit, setReadyToExit] = useState(false);

  // Entrance animation — runs once on mount. The logo fully settles with a
  // gentle spring before the wordmark starts fading in beneath it, so the
  // sequence always reads as "logo, then text".
  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 280,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: useNativeDriver,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 280,
          easing: Easing.out(Easing.cubic),
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
      setTimeout(() => setReadyToExit(true), HOLD_BEFORE_EXIT_MS);
    });

    // Looping pulse for the "loading" dot. Phase 1 has no global data
    // warm-up to wait on (each screen's mock hook fetches on its own mount);
    // this dot just communicates "getting ready" while fonts load and the
    // auth session bootstraps (see isAppReady in app/_layout.tsx).
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

  // Exit animation — runs once the app is ready AND the entrance has held
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

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        styles.container,
        {
          opacity: overlayOpacity,
          transform: [{ scale: overlayScale }],
          pointerEvents: 'none',
        },
      ]}
    >
      <LinearGradient
        colors={[themeColors.navy, themeColors.primary]}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={StyleSheet.absoluteFill}
      />

      <Animated.View
        style={{
          opacity: logoOpacity,
          transform: [{ scale: logoScale }],
        }}
      >
        <View style={styles.logoCard}>
          <Image source={LogoImage} style={styles.logo} resizeMode="contain" />
          {/* Glossy highlight — cheap "3D glass icon" trick, reads as a light reflection */}
          <LinearGradient
            colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0)']}
            end={{ x: 0.5, y: 1 }}
            pointerEvents="none"
            start={{ x: 0.5, y: 0 }}
            style={styles.logoGloss}
          />
        </View>
      </Animated.View>

      <Animated.Text
        style={[
          styles.wordmark,
          {
            opacity: textOpacity,
            transform: [{ translateY: textTranslateY }],
          },
        ]}
      >
        IBN FIRNAS
      </Animated.Text>

      <View className="mt-6 flex-row items-center justify-center">
        <Animated.View style={[styles.dot, { opacity: dotOpacity }]} />
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
    overflow: 'hidden',
    // 3D depth: soft shadow offset down-right, simulating a top-left light source
    shadowColor: themeColors.navy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  logo: {
    width: 82,
    height: 82,
  },
  logoGloss: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '50%',
  },
  wordmark: {
    marginTop: 16,
    color: themeColors.sky,
    fontFamily: themeFontFamily.bold[0],
    fontSize: 24,
    letterSpacing: 1,
    textAlign: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
});
