import { FlatList, Linking, Pressable, ScrollView, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/ui/app-header";
import { AppText } from "@/components/ui/app-text";
import { HeroCarousel } from "@/components/ui/hero-carousel";
import { WhatsAppFab } from "@/components/ui/whatsapp-fab";
import { themeColors } from "@/config/design-tokens";
import { useCompany } from "@/hooks/use-company";
import { useFeaturedProducts } from "@/hooks/use-products";
import { useFeaturedServices } from "@/hooks/use-services";
import { useLanguage } from "@/i18n/i18n-provider";
import type { Product, Service } from "@/types/api";

type IconName = keyof typeof Feather.glyphMap;

const ENTRIES: {
  icon: IconName;
  href: "/(tabs)/Product" | "/(tabs)/Services" | "/(tabs)/Gallery";
  titleKey: "products.title" | "services.title" | "gallery.title";
  color: string;
}[] = [
  { icon: "box", href: "/(tabs)/Product", titleKey: "products.title", color: themeColors.primary },
  { icon: "tool", href: "/(tabs)/Services", titleKey: "services.title", color: themeColors.secondary },
  { icon: "image", href: "/(tabs)/Gallery", titleKey: "gallery.title", color: themeColors.success },
];

function FeaturedProductCard({ product }: { product: Product }) {
  return (
    <Pressable
      className="w-40 gap-2 rounded-2xl border border-border bg-card p-2 shadow-md shadow-black/10 active:opacity-80"
      onPress={() => router.push(`/products/${product.id}`)}
    >
      <Image contentFit="cover" source={{ uri: product.primaryImageUrl }} style={{ height: 100, width: "100%", borderRadius: 12 }} />
      <AppText className="text-sm" numberOfLines={2} variant="subtitle">
        {product.name}
      </AppText>
      <AppText className="text-sm" style={{ color: themeColors.primary }}>
        {(product.discountPrice ?? product.price).toFixed(2)}
      </AppText>
    </Pressable>
  );
}

function FeaturedServiceCard({ service }: { service: Service }) {
  return (
    <Pressable
      className="w-40 gap-2 rounded-2xl border border-border bg-card p-2 shadow-md shadow-black/10 active:opacity-80"
      onPress={() => router.push({ pathname: "/services/[id]", params: { id: String(service.id) } })}
    >
      {service.imageUrl ? (
        <Image contentFit="cover" source={{ uri: service.imageUrl }} style={{ height: 100, width: "100%", borderRadius: 12 }} />
      ) : null}
      <AppText className="text-sm" numberOfLines={2} variant="subtitle">
        {service.name}
      </AppText>
    </Pressable>
  );
}

function ContactRow({ icon, label, onPress }: { icon: IconName; label: string; onPress: () => void }) {
  return (
    <Pressable
      className="flex-row items-center gap-3 rounded-xl border border-border bg-card p-3 active:opacity-80"
      onPress={onPress}
    >
      <View
        className="h-9 w-9 items-center justify-center rounded-full"
        style={{ backgroundColor: `${themeColors.primary}1A` }}
      >
        <Feather color={themeColors.primary} name={icon} size={16} />
      </View>
      <AppText className="flex-1 text-sm" numberOfLines={1}>
        {label}
      </AppText>
      <Feather color={themeColors.textSecondary} name="chevron-right" size={16} />
    </Pressable>
  );
}

export default function Home() {
  const { t } = useLanguage();
  const { data: company } = useCompany();
  const { data: featuredProducts } = useFeaturedProducts();
  const { data: featuredServices } = useFeaturedServices();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <AppHeader />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ gap: 24, padding: 24, paddingBottom: 180 }}
        keyboardShouldPersistTaps="handled"
      >
        <HeroCarousel />

        <View className="gap-3">
          <AppText className="text-sm uppercase tracking-wide" muted>
            {t("home.quickAccess")}
          </AppText>

          {ENTRIES.map((entry) => (
            <Pressable
              className="flex-row items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-md shadow-black/10 active:opacity-80"
              key={entry.href}
              onPress={() => router.push(entry.href)}
            >
              <View
                className="h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: `${entry.color}1A` }}
              >
                <Feather color={entry.color} name={entry.icon} size={21} />
              </View>
              <AppText className="flex-1" variant="subtitle">
                {t(entry.titleKey)}
              </AppText>
              <View
                className="h-8 w-8 items-center justify-center rounded-full"
                style={{ backgroundColor: themeColors.background }}
              >
                <Feather color={themeColors.textSecondary} name="chevron-right" size={16} />
              </View>
            </Pressable>
          ))}
        </View>

        {featuredProducts && featuredProducts.length > 0 ? (
          <View className="gap-3">
            <AppText className="text-sm uppercase tracking-wide" muted>
              {t("home.featuredProducts")}
            </AppText>
            <FlatList
              contentContainerStyle={{ gap: 12 }}
              data={featuredProducts}
              horizontal
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => <FeaturedProductCard product={item} />}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        ) : null}

        {featuredServices && featuredServices.length > 0 ? (
          <View className="gap-3">
            <AppText className="text-sm uppercase tracking-wide" muted>
              {t("home.featuredServices")}
            </AppText>
            <FlatList
              contentContainerStyle={{ gap: 12 }}
              data={featuredServices}
              horizontal
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => <FeaturedServiceCard service={item} />}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        ) : null}

        {company?.bannerUrl ? (
          <View className="overflow-hidden rounded-2xl">
            <Image contentFit="cover" source={{ uri: company.bannerUrl }} style={{ height: 140, width: "100%" }} />
            <View className="gap-1 border border-t-0 border-border bg-card p-4">
              <AppText variant="subtitle">{company.name}</AppText>
              <AppText className="text-sm" muted numberOfLines={3}>
                {company.description}
              </AppText>
            </View>
          </View>
        ) : null}

        {company ? (
          <View className="gap-3">
            <AppText className="text-sm uppercase tracking-wide" muted>
              {t("home.contactUs")}
            </AppText>
            {company.phone ? (
              <ContactRow
                icon="phone"
                label={company.phone}
                onPress={() => Linking.openURL(`tel:${company.phone}`)}
              />
            ) : null}
            {company.email ? (
              <ContactRow
                icon="mail"
                label={company.email}
                onPress={() => Linking.openURL(`mailto:${company.email}`)}
              />
            ) : null}
            {company.address ? (
              <ContactRow
                icon="map-pin"
                label={company.address}
                onPress={() => company.googleMapsUrl && Linking.openURL(company.googleMapsUrl)}
              />
            ) : null}
          </View>
        ) : null}
      </ScrollView>

      <WhatsAppFab bottomOffset={100} message={t("home.whatsappMessage")} />
    </SafeAreaView>
  );
}
