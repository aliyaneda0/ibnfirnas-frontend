import { Image, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { themeColors } from "@/config/design-tokens";

import LogoImage from "../../../assets/images/splash-icon.png";

type BrandLogoProps = {
  size?: number;
  card?: boolean;
};

// The single "3D glass icon" treatment for the brand mark — a white rounded
// card, a soft shadow offset down-right (simulates a top-left light source),
// and a glossy highlight over the top half. Used everywhere the logo
// appears (splash, header, login) so the effect reads as intentional, not
// inconsistent, across screens. Pass `card={false}` to render just the
// mark with no background/shadow (e.g. the app header, which already sits
// on its own translucent bar).
export function BrandLogo({ size = 44, card = true }: BrandLogoProps) {
  const imageSize = size * 0.82;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.22,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        backgroundColor: card ? themeColors.card : "transparent",
        shadowColor: card ? themeColors.navy : "transparent",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: card ? 0.25 : 0,
        shadowRadius: 12,
        elevation: card ? 8 : 0,
      }}
    >
      <Image resizeMode="contain" source={LogoImage} style={{ width: imageSize, height: imageSize }} />
      {card ? (
        <LinearGradient
          colors={["rgba(255,255,255,0.25)", "rgba(255,255,255,0)"]}
          end={{ x: 0.5, y: 1 }}
          pointerEvents="none"
          start={{ x: 0.5, y: 0 }}
          style={{ position: "absolute", left: 0, right: 0, top: 0, height: "50%" }}
        />
      ) : null}
    </View>
  );
}
