// components/ui/animated-splash.tsx
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { themeColors, themeFontFamily } from '@/config/design-tokens';
import { BrandLogo } from './brand-logo';


const useNativeDriver = Platform.OS !== 'web';
// How long to hold on the fully-settled splash before handing off to the
// real screen behind it, so the entrance animation never gets cut short by
// app-ready resolving instantly.
const HOLD_BEFORE_EXIT_MS = 2500;

const WORDMARK = 'IBN FIRNAS';
const TYPE_CHAR_MS = 70;
const COLOR_TRANSITION_MS = 400;

interface AnimatedSplashProps {
  onAnimationComplete: () => void;
  isAppReady: boolean;
}

export function AnimatedSplash({ onAnimationComplete, isAppReady }: AnimatedSplashProps) {
  // Logo entrance values — start mostly-there (0.9) rather than from
  // nothing, so the logo is already almost visible at the exact moment the
  // native splash hands off to this component; it just settles the rest of
  // the way in rather than visibly popping from invisible.
  const [logoScale] = useState(() => new Animated.Value(0.9));
  const [logoOpacity] = useState(() => new Animated.Value(0.9));

  // Wordmark typewriter — characters are revealed one at a time (in teal,
  // readable against the now-light splash background), then wordmarkColor
  // animates the fill from teal to brand blue once the full name is typed out.
  const [displayedText, setDisplayedText] = useState('');
  const [wordmarkColor] = useState(() => new Animated.Value(0));
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Overlay exit values
  const [overlayOpacity] = useState(() => new Animated.Value(1));
  const [overlayScale] = useState(() => new Animated.Value(1));

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
        duration: 350,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: useNativeDriver,
      }),
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 550,
        easing: Easing.out(Easing.back(1.7)),
        useNativeDriver: true,
      }),
    ]).start(() => {
      typeNextChar(0);
    });

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [logoOpacity, logoScale, wordmarkColor]);

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
  }, [isAppReady, onAnimationComplete, overlayOpacity, overlayScale, readyToExit]);

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
        <BrandLogo card={false} size={105} />
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
});
