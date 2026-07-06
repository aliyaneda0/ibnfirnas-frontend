import { Text, type TextProps } from "react-native";

type AppTextVariant = "body" | "title" | "subtitle";

type AppTextProps = TextProps & {
  muted?: boolean;
  variant?: AppTextVariant;
};

const variantClasses: Record<AppTextVariant, string> = {
  body: "text-base font-sans",
  title: "text-3xl font-bold",
  subtitle: "text-xl font-medium",
};

export function AppText({
  className = "",
  muted = false,
  variant = "body",
  ...props
}: AppTextProps) {
  const toneClass = muted ? "text-subText" : "text-text";

  return (
    <Text
      className={`${variantClasses[variant]} ${toneClass} ${className}`}
      {...props}
    />
  );
}
