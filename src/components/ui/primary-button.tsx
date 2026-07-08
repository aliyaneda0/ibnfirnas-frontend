import { Pressable, type PressableProps } from "react-native";

import { themeColors } from "@/config/design-tokens";
import { AppText } from "./app-text";

type PrimaryButtonProps = PressableProps & {
  className?: string;
  label: string;
  variant?: "primary" | "inverse";
};

export function PrimaryButton({
  className = "",
  disabled,
  label,
  variant = "primary",
  ...props
}: PrimaryButtonProps) {
  const isInverse = variant === "inverse";

  return (
    <Pressable
      accessibilityRole="button"
      className={`min-h-14 items-center justify-center rounded-xl px-5 shadow-lg shadow-black/30 ${
        isInverse ? "bg-white" : "bg-primary"
      } ${disabled ? "opacity-60" : "active:opacity-80"} ${className}`}
      disabled={disabled}
      {...props}
    >
      <AppText
        className="text-center"
        style={{ color: isInverse ? themeColors.primary : themeColors.card }}
        variant="subtitle"
      >
        {label}
      </AppText>
    </Pressable>
  );
}
