import { FlatList, Linking, Pressable, ScrollView, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/ui/app-header";
import { AppText } from "@/components/ui/app-text";
import { HeroCarousel } from "@/components/ui/hero-carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/state-view";
import { WhatsAppFab } from "@/components/ui/whatsapp-fab";
import { themeColors, themeFontFamily } from "@/config/design-tokens";
import { useCompany } from "@/hooks/use-company";
import { useFeaturedProducts } from "@/hooks/use-products";
import { useFeaturedServices } from "@/hooks/use-services";
import { useLanguage } from "@/i18n/i18n-provider";
import type { Product, Service } from "@/types/api";

type IconName = keyof typeof Feather.glyphMap;

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

function FeaturedCardSkeleton() {
  return (
    <View className="w-40 gap-2 rounded-2xl border border-border bg-card p-2">
      <Skeleton borderRadius={12} height={100} />
      <Skeleton height={14} width="90%" />
      <Skeleton height={14} width="50%" />
    </View>
  );
}

function FeaturedRowSkeleton() {
  return (
    <View className="flex-row gap-3">
      <FeaturedCardSkeleton />
      <FeaturedCardSkeleton />
      <FeaturedCardSkeleton />
    </View>
  );
}

function CompanySectionSkeleton() {
  return (
    <View className="gap-3">
      <View className="overflow-hidden rounded-2xl">
        <Skeleton borderRadius={0} height={140} />
        <View className="gap-2 border border-t-0 border-border bg-card p-4">
          <Skeleton height={16} width="50%" />
          <Skeleton height={13} width="100%" />
          <Skeleton height={13} width="80%" />
        </View>
      </View>
      <Skeleton height={12} width="30%" />
      <Skeleton borderRadius={12} height={52} />
      <Skeleton borderRadius={12} height={52} />
      <Skeleton borderRadius={12} height={52} />
    </View>
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
  const { data: company, isLoading: isCompanyLoading } = useCompany();
  const { data: featuredProducts, isLoading: isFeaturedProductsLoading } = useFeaturedProducts();
  const { data: featuredServices, isLoading: isFeaturedServicesLoading } = useFeaturedServices();

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
            {t("home.featuredProducts")}
          </AppText>
          {isFeaturedProductsLoading ? (
            <FeaturedRowSkeleton />
          ) : featuredProducts && featuredProducts.length > 0 ? (
            <FlatList
              contentContainerStyle={{ gap: 12 }}
              data={featuredProducts}
              horizontal
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => <FeaturedProductCard product={item} />}
              showsHorizontalScrollIndicator={false}
            />
          ) : (
            <EmptyState icon="box" message={t("home.featuredProductsEmpty")} />
          )}
        </View>

        <View className="gap-3">
          <AppText className="text-sm uppercase tracking-wide" muted>
            {t("home.featuredServices")}
          </AppText>
          {isFeaturedServicesLoading ? (
            <FeaturedRowSkeleton />
          ) : featuredServices && featuredServices.length > 0 ? (
            <FlatList
              contentContainerStyle={{ gap: 12 }}
              data={featuredServices}
              horizontal
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => <FeaturedServiceCard service={item} />}
              showsHorizontalScrollIndicator={false}
            />
          ) : (
            <EmptyState icon="tool" message={t("home.featuredServicesEmpty")} />
          )}
        </View>

        <View className="gap-3 overflow-hidden rounded-2xl border border-border bg-card p-5">
          <AppText variant="subtitle">{t("inquiry.title")}</AppText>
          <AppText className="text-sm" muted>
            {t("inquiry.subtitle")}
          </AppText>
          <Pressable
            className="mt-1 flex-row items-center justify-center gap-2 rounded-xl active:opacity-85"
            onPress={() => router.push("/inquiry")}
            style={{
              backgroundColor: themeColors.error,
              paddingVertical: 14,
              shadowColor: themeColors.error,
              shadowOpacity: 0.35,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 6 },
              elevation: 5,
            }}
          >
            <Feather color="#FFFFFF" name="send" size={16} />
            <AppText style={{ color: "#FFFFFF", fontFamily: themeFontFamily.bold[0], letterSpacing: 0.3 }}>
              {t("inquiry.submit")}
            </AppText>
          </Pressable>
        </View>

        {isCompanyLoading ? (
          <CompanySectionSkeleton />
        ) : !company ? (
          <EmptyState icon="info" message={t("home.companyEmpty")} />
        ) : (
          <>
            {company.bannerUrl ? (
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
          </>
        )}
      </ScrollView>

      <WhatsAppFab bottomOffset={100} message={t("home.whatsappMessage")} />
    </SafeAreaView>
  );
}
