import { Linking, Pressable, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { themeColors } from "@/config/design-tokens";
import type { Company } from "@/types/api";
import { AppText } from "./app-text";

type IconName = keyof typeof Feather.glyphMap;

function ContactListItem({
  icon,
  isFirst,
  label,
  onPress,
}: {
  icon: IconName;
  isFirst: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      className={`flex-row items-center gap-3 px-4 py-3.5 active:opacity-70 ${isFirst ? "" : "border-t border-border"}`}
      onPress={onPress}
    >
      <View
        className="h-9 w-9 items-center justify-center rounded-full"
        style={{ backgroundColor: `${themeColors.primary}1A` }}
      >
        <Feather color={themeColors.primary} name={icon} size={16} />
      </View>
      <AppText className="flex-1 text-sm" numberOfLines={2}>
        {label}
      </AppText>
      <Feather color={themeColors.textSecondary} name="chevron-right" size={16} />
    </Pressable>
  );
}

type ContactListProps = {
  company: Pick<Company, "phone" | "email" | "address" | "googleMapsUrl">;
};

export function ContactList({ company }: ContactListProps) {
  const items = (
    [
      company.phone
        ? { key: "phone", icon: "phone" as const, label: company.phone, onPress: () => Linking.openURL(`tel:${company.phone}`) }
        : null,
      company.email
        ? {
            key: "email",
            icon: "mail" as const,
            label: company.email,
            onPress: () => Linking.openURL(`mailto:${company.email}`),
          }
        : null,
      company.address
        ? {
            key: "address",
            icon: "map-pin" as const,
            label: company.address,
            onPress: () => company.googleMapsUrl && Linking.openURL(company.googleMapsUrl),
          }
        : null,
    ] as const
  ).filter((item): item is NonNullable<(typeof item)> => item !== null);

  if (items.length === 0) return null;

  return (
    <View className="overflow-hidden rounded-2xl border border-border bg-card shadow-md shadow-black/10">
      {items.map((item, index) => (
        <ContactListItem icon={item.icon} isFirst={index === 0} key={item.key} label={item.label} onPress={item.onPress} />
      ))}
    </View>
  );
}
