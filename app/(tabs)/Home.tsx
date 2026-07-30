import { FlatList, Pressable, ScrollView, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/ui/app-header";
import { AppText } from "@/components/ui/app-text";
import { Badge } from "@/components/ui/badge";
import { ContactList } from "@/components/ui/contact-list";
import { HeroCarousel } from "@/components/ui/hero-carousel";
import { PrimaryButton } from "@/components/ui/primary-button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/state-view";
import { WhatsAppFab } from "@/components/ui/whatsapp-fab";
import { themeColors } from "@/config/design-tokens";
import { useCompany } from "@/hooks/use-company";
import { useFeaturedProducts } from "@/hooks/use-products";
import { useFeaturedServices } from "@/hooks/use-services";
import { useLanguage } from "@/i18n/i18n-provider";
import type { Product, Service } from "@/types/api";

function FeaturedProductCard({ product }: { product: Product }) {
  const { t } = useLanguage();

  return (
    <Pressable
      className="w-40 gap-2 rounded-2xl border border-border bg-card p-2 shadow-md shadow-black/10 active:opacity-80"
      onPress={() => router.push(`/products/${product.id}`)}
    >
      <Image contentFit="cover" source={{ uri: product.primaryImageUrl }} style={{ height: 110, width: "100%", borderRadius: 12 }} />
      {product.isFeatured ? <Badge label={t("products.featured")} /> : null}
      <AppText numberOfLines={2} variant="subtitle">
        {product.name}
      </AppText>
      <View className="flex-row items-center gap-2">
        <AppText style={{ color: themeColors.primary }} variant="subtitle">
          {(product.discountPrice ?? product.price).toFixed(2)}
        </AppText>
        {product.discountPrice ? (
          <AppText className="text-xs line-through" muted>
            {product.price.toFixed(2)}
          </AppText>
        ) : null}
      </View>
    </Pressable>
  );
}

function FeaturedServiceCard({ service }: { service: Service }) {
  const { t } = useLanguage();

  return (
    <Pressable
      className="w-40 gap-2 rounded-2xl border border-border bg-card p-2 shadow-md shadow-black/10 active:opacity-80"
      onPress={() => router.push({ pathname: "/services/[id]", params: { id: String(service.id) } })}
    >
      {service.imageUrl ? (
        <Image contentFit="cover" source={{ uri: service.imageUrl }} style={{ height: 110, width: "100%", borderRadius: 12 }} />
      ) : (
        <View
          className="items-center justify-center rounded-xl"
          style={{ height: 110, width: "100%", backgroundColor: `${themeColors.primary}14` }}
        >
          <Feather color={themeColors.primary} name="tool" size={26} />
        </View>
      )}
      {service.isFeatured ? <Badge label={t("products.featured")} /> : null}
      <AppText numberOfLines={2} variant="subtitle">
        {service.name}
      </AppText>
    </Pressable>
  );
}

function FeaturedCardSkeleton() {
  return (
    <View className="w-40 gap-2 rounded-2xl border border-border bg-card p-2">
      <Skeleton borderRadius={12} height={110} />
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
      <Skeleton borderRadius={16} height={180} />
    </View>
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
        contentContainerStyle={{ gap: 24, paddingTop: 12, paddingHorizontal: 24, paddingBottom: 120 }}
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

        <View className="gap-3 rounded-2xl border border-border bg-card p-5">
          <AppText variant="subtitle">{t("inquiry.title")}</AppText>
          <AppText className="text-sm" muted>
            {t("inquiry.subtitle")}
          </AppText>
          <PrimaryButton label={t("inquiry.submit")} onPress={() => router.push("/inquiry")} />
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

            {company.phone || company.email || company.address ? (
              <View className="gap-3">
                <AppText className="text-sm uppercase tracking-wide" muted>
                  {t("home.contactUs")}
                </AppText>
                <ContactList company={company} />
              </View>
            ) : null}
          </>
        )}
      </ScrollView>

      <WhatsAppFab bottomOffset={100} message={t("home.whatsappMessage")} />
    </SafeAreaView>
  );
}
