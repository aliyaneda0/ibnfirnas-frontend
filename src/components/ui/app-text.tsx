import { Text, type TextProps } from "react-native";

import { themeFontFamily } from "@/config/design-tokens";
import { useLanguage } from "@/i18n/i18n-provider";

type AppTextVariant = "body" | "title" | "subtitle";

type AppTextProps = TextProps & {
  muted?: boolean;
  variant?: AppTextVariant;
};

const variantSizeClasses: Record<AppTextVariant, string> = {
  body: "text-base",
  title: "text-3xl",
  subtitle: "text-xl",
};

// Headings use a real distinct font family (not just a synthetic font-weight
// class) because named static Google Font files don't reliably fake-bold on
// native the way browsers do on web.
const variantFontFamily: Record<AppTextVariant, string | undefined> = {
  body: undefined,
  title: themeFontFamily.bold[0],
  subtitle: themeFontFamily.medium[0],
};

export function AppText({
  className = "",
  muted = false,
  style,
  variant = "body",
  ...props
}: AppTextProps) {
  const { language } = useLanguage();
  // Poppins/IBM Plex Sans are Latin-only — they have no Arabic glyphs. On
  // native, an unsupported glyph in an explicitly-set font doesn't reliably
  // fall back to a system font the way browsers do, so it can render blank.
  // Arabic text skips our custom fonts entirely and uses the platform default.
  const isLatinScript = language !== "ar";
  const toneClass = muted ? "text-textSecondary" : "text-text";
  const fontClassName = isLatinScript && variant === "body" ? "font-sans" : "";
  const fontFamily = isLatinScript ? variantFontFamily[variant] : undefined;

  return (
    <Text
      className={`${variantSizeClasses[variant]} ${fontClassName} ${toneClass} ${className}`}
      style={fontFamily ? [{ fontFamily }, style] : style}
      {...props}
    />
  );
}
