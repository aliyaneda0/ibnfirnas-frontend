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
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

import { themeFontFamily } from "@/config/design-tokens";
import { useLanguage } from "@/i18n/i18n-provider";
import { AppText } from "./app-text";

type MCIName = keyof typeof MaterialCommunityIcons.glyphMap;

type Slide = {
  icon: MCIName;
  titleKey: "carousel.doors" | "carousel.shutters" | "carousel.barriers" | "carousel.systems";
  image: number;
};

const SLIDES: Slide[] = [
  { icon: "door-sliding", titleKey: "carousel.doors", image: require("../../../assets/images/hero_bg_1.png") },
  { icon: "garage", titleKey: "carousel.shutters", image: require("../../../assets/images/hero_bg_2.png") },
  { icon: "boom-gate-up-outline", titleKey: "carousel.barriers", image: require("../../../assets/images/hero_bg_3.png") },
  { icon: "factory", titleKey: "carousel.systems", image: require("../../../assets/images/hero_bg_4.png") },
];

const AUTO_SLIDE_MS = 4000;
// Home's scroll content uses 24px of horizontal padding on each side. The hero
// banner bleeds past it to span the full screen width, so it needs a matching
// negative margin to cancel that padding out.
const SCREEN_HORIZONTAL_PADDING = 24;
const CARD_HEIGHT_RATIO = 0.46;

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
          {SLIDES.map((slide) => (
            <ImageBackground
              key={slide.titleKey}
              resizeMode="cover"
              source={slide.image}
              style={{ width: cardWidth, height: cardHeight, backgroundColor: "#0B3C73" }}
            >
              <View className="flex-1 justify-between p-5">
                <View
                  className="h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: "#FFFFFF26", borderWidth: 1, borderColor: "#FFFFFF40" }}
                >
                  <MaterialCommunityIcons color="#FFFFFF" name={slide.icon} size={26} />
                </View>
                <AppText
                  style={{ color: "#FFFFFF", fontFamily: themeFontFamily.bold[0] }}
                  variant="subtitle"
                >
                  {t(slide.titleKey)}
                </AppText>
              </View>
            </ImageBackground>
          ))}
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
