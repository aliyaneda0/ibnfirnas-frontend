// components/ui/animated-splash.tsx
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { themeColors, themeFontFamily } from '@/config/design-tokens';
import { BrandLogo } from './brand-logo';


const useNativeDriver = Platform.OS !== 'web';
// How long to hold on the fully-settled splash before handing off to the
// real screen behind it, so the entrance animation never gets cut short by
// app-ready resolving instantly.
const HOLD_BEFORE_EXIT_MS = 500;

const WORDMARK = 'IBN FIRNAS';
const TYPE_CHAR_MS = 70;
const COLOR_TRANSITION_MS = 400;

interface AnimatedSplashProps {
  onAnimationComplete: () => void;
  isAppReady: boolean;
}

export function AnimatedSplash({ onAnimationComplete, isAppReady }: AnimatedSplashProps) {
  // Logo entrance values — scale-up-from-90%-to-100% + fade-in, per spec
  const logoScale = useRef(new Animated.Value(0.9)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  // Wordmark typewriter — characters are revealed one at a time (in teal,
  // readable against the now-light splash background), then wordmarkColor
  // animates the fill from teal to brand blue once the full name is typed out.
  const [displayedText, setDisplayedText] = useState('');
  const wordmarkColor = useRef(new Animated.Value(0)).current;
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Progress dot pulse
  const dotOpacity = useRef(new Animated.Value(0.3)).current;

  // Overlay exit values
  const overlayOpacity = useRef(new Animated.Value(1)).current;
  const overlayScale = useRef(new Animated.Value(1)).current;

  const [readyToExit, setReadyToExit] = useState(false);

  // Entrance animation — runs once on mount. The logo fully settles with a
  // gentle spring before the wordmark starts typing itself out beneath it,
  // so the sequence always reads as "logo, then text".
  useEffect(() => {
    const typeNextChar = (index: number) => {
      setDisplayedText(WORDMARK.slice(0, index));
      if (index < WORDMARK.length) {
        typingTimeoutRef.current = setTimeout(() => typeNextChar(index + 1), TYPE_CHAR_MS);
        return;
      }

      // Typing finished — settle the wordmark from teal into brand blue.
      Animated.timing(wordmarkColor, {
        toValue: 1,
        duration: COLOR_TRANSITION_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start(() => {
        setTimeout(() => setReadyToExit(true), HOLD_BEFORE_EXIT_MS);
      });
    };

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
    ]).start(() => {
      typeNextChar(0);
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

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
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
        colors={[themeColors.surfaceMuted, themeColors.sky]}
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
        <BrandLogo size={100} />
      </Animated.View>

      <Animated.Text
        style={[
          styles.wordmark,
          {
            color: wordmarkColor.interpolate({
              inputRange: [0, 1],
              outputRange: ['#39ADAE', '#2468AC'],
            }),
          },
        ]}
      >
        {displayedText}
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
  wordmark: {
    marginTop: 16,
    fontFamily: themeFontFamily.display[0],
    fontSize: 28,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2468AC',
  },
});
