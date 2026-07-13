import { useEffect, useRef, useState } from "react";
import {
  ImageBackground,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  View,
  useWindowDimensions,
} from "react-native";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

import { themeColors, themeFontFamily } from "@/config/design-tokens";
import { useLanguage, type TranslationKey } from "@/i18n/i18n-provider";
import { AppText } from "./app-text";

type Slide = {
  titleKey: TranslationKey;
  highlightKey: TranslationKey;
  subtitleKey: TranslationKey;
  buttonKey: TranslationKey;
  align: "right" | "left";
  image: number;
};

const SLIDES: Slide[] = [
  {
    titleKey: "hero.slide1Title",
    highlightKey: "hero.slide1Highlight",
    subtitleKey: "hero.slide1Subtitle",
    buttonKey: "hero.slide1Button",
    align: "right",
    image: require("../../../assets/images/hero_bg_1.png"),
  },
  {
    titleKey: "hero.slide2Title",
    highlightKey: "hero.slide2Highlight",
    subtitleKey: "hero.slide2Subtitle",
    buttonKey: "hero.slide2Button",
    align: "left",
    image: require("../../../assets/images/hero_bg_2.png"),
  },
  {
    titleKey: "hero.slide3Title",
    highlightKey: "hero.slide3Highlight",
    subtitleKey: "hero.slide3Subtitle",
    buttonKey: "hero.slide3Button",
    align: "right",
    image: require("../../../assets/images/hero_bg_3.png"),
  },
  {
    titleKey: "hero.slide4Title",
    highlightKey: "hero.slide4Highlight",
    subtitleKey: "hero.slide4Subtitle",
    buttonKey: "hero.slide4Button",
    align: "left",
    image: require("../../../assets/images/hero_bg_4.png"),
  },
];

const AUTO_SLIDE_MS = 5000;
// Home's scroll content uses 24px of horizontal padding on each side. The hero
// banner bleeds past it to span the full screen width, so it needs a matching
// negative margin to cancel that padding out.
const SCREEN_HORIZONTAL_PADDING = 24;
const CARD_HEIGHT_RATIO = 0.45;

export function HeroCarousel() {
  const { t } = useLanguage();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const cardWidth = windowWidth;
  const cardHeight = Math.round(windowHeight * CARD_HEIGHT_RATIO);

  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const indexRef = useRef(0);

  const goTo = (nextIndex: number) => {
    const clamped = (nextIndex + SLIDES.length) % SLIDES.length;
    indexRef.current = clamped;
    setActiveIndex(clamped);
    scrollRef.current?.scrollTo({ x: clamped * cardWidth, animated: true });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      goTo(indexRef.current + 1);
    }, AUTO_SLIDE_MS);
    return () => clearInterval(timer);
  }, [cardWidth]);

  const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / cardWidth);
    indexRef.current = nextIndex;
    setActiveIndex(nextIndex);
  };

  return (
    <View style={{ width: cardWidth, marginHorizontal: -SCREEN_HORIZONTAL_PADDING }}>
      <View className="overflow-hidden" style={{ height: cardHeight }}>
        <ScrollView
          horizontal
          decelerationRate="fast"
          onMomentumScrollEnd={onMomentumScrollEnd}
          pagingEnabled
          ref={scrollRef}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
        >
          {SLIDES.map((slide) => {
            const isLeft = slide.align === "left";
            return (
              <ImageBackground
                key={slide.titleKey}
                resizeMode="cover"
                source={slide.image}
                style={{ width: cardWidth, height: cardHeight, backgroundColor: "#0B3C73" }}
              >
                <View
                  className="flex-1"
                  style={{
                    backgroundColor: "rgba(0,0,0,0.4)",
                    justifyContent: "flex-end",
                    alignItems: isLeft ? "flex-start" : "flex-end",
                    paddingHorizontal: 52,
                    paddingBottom: 44,
                  }}
                >
                  <View style={{ maxWidth: "78%" }}>
                    <AppText
                      style={{
                        color: "#FFFFFF",
                        fontFamily: themeFontFamily.bold[0],
                        fontSize: 19,
                        lineHeight: 24,
                        textAlign: isLeft ? "left" : "right",
                        textTransform: "uppercase",
                      }}
                    >
                      {t(slide.titleKey)}
                    </AppText>
                    <AppText
                      style={{
                        color: themeColors.accent,
                        fontFamily: themeFontFamily.bold[0],
                        fontSize: 18,
                        lineHeight: 23,
                        textAlign: isLeft ?  "left" : "right",
                        textTransform: "uppercase",
                      }}
                    >
                      {t(slide.highlightKey)}
                    </AppText>
                    <AppText
                      numberOfLines={3}
                      style={{
                        color: "#FFFFFF",
                        opacity: 0.92,
                        fontSize: 12,
                        lineHeight: 18,
                        marginTop: 10,
                        textAlign: isLeft ?  "left" : "right",
                      }}
                    >
                      {t(slide.subtitleKey)}
                    </AppText>
                    <Pressable
                      accessibilityRole="button"
                      className="mt-4 rounded-md active:opacity-85"
                      onPress={() => router.push("/inquiry")}
                      style={{
                        alignSelf: isLeft ? "flex-start" : "flex-end",
                        backgroundColor: themeColors.error,
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                        shadowColor: themeColors.error,
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.35,
                        shadowRadius: 8,
                        elevation: 4,
                      }}
                    >
                      <AppText
                        style={{
                          color: "#FFFFFF",
                          fontFamily: themeFontFamily.bold[0],
                          fontSize: 11,
                          letterSpacing: 1,
                        }}
                      >
                        {t(slide.buttonKey)}
                      </AppText>
                    </Pressable>
                  </View>
                </View>
              </ImageBackground>
            );
          })}
        </ScrollView>

        <View className="absolute bottom-3 w-full flex-row items-center justify-center gap-1.5">
          <View
            className="flex-row items-center gap-1.5 rounded-full px-2.5 py-1.5"
            style={{ backgroundColor: "#0000002E" }}
          >
            {SLIDES.map((slide, index) => (
              <View
                key={slide.titleKey}
                style={{
                  height: 6,
                  width: index === activeIndex ? 16 : 6,
                  borderRadius: 3,
                  backgroundColor: index === activeIndex ? "#FFFFFF" : "#FFFFFF80",
                }}
              />
            ))}
          </View>
        </View>
      </View>

      <Pressable
        accessibilityLabel="Previous"
        accessibilityRole="button"
        className="absolute overflow-hidden rounded-full active:opacity-70"
        onPress={() => goTo(indexRef.current - 1)}
        style={{ left: 10, top: cardHeight / 2 - 18 }}
      >
        <View style={{ backgroundColor: "rgba(0,0,0,0.32)" }}>
          <BlurView intensity={45} tint="dark" style={{ height: 36, width: 36, alignItems: "center", justifyContent: "center" }}>
            <Feather color="#FFFFFF" name="chevron-left" size={20} />
          </BlurView>
        </View>
      </Pressable>

      <Pressable
        accessibilityLabel="Next"
        accessibilityRole="button"
        className="absolute overflow-hidden rounded-full active:opacity-70"
        onPress={() => goTo(indexRef.current + 1)}
        style={{ right: 10, top: cardHeight / 2 - 18 }}
      >
        <View style={{ backgroundColor: "rgba(0,0,0,0.32)" }}>
          <BlurView intensity={45} tint="dark" style={{ height: 36, width: 36, alignItems: "center", justifyContent: "center" }}>
            <Feather color="#FFFFFF" name="chevron-right" size={20} />
          </BlurView>
        </View>
      </Pressable>
    </View>
  );
}
