import { Pressable, type PressableProps } from "react-native";

import { AppText } from "./app-text";

type PrimaryButtonProps = PressableProps & {
  className?: string;
  label: string;
};

export function PrimaryButton({
  className = "",
  disabled,
  label,
  ...props
}: PrimaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      className={`min-h-14 items-center justify-center rounded-lg bg-primary px-5 ${
        disabled ? "opacity-60" : "active:opacity-80"
      } ${className}`}
      disabled={disabled}
      {...props}
    >
      <AppText className="text-center text-card" variant="subtitle">
        {label}
      </AppText>
    </Pressable>
  );
}
