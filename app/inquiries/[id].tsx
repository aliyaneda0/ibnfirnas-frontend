import { Pressable, ScrollView, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText } from "@/components/ui/app-text";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/ui/state-view";
import { themeColors } from "@/config/design-tokens";
import { useAuth } from "@/features/auth/auth-provider";
import { useInquiry } from "@/hooks/use-my-inquiries";
import { useLanguage } from "@/i18n/i18n-provider";
import type { InquiryStatus } from "@/types/api";

const STATUS_COLOR: Record<InquiryStatus, string> = {
  OPEN: themeColors.primary,
  PENDING: themeColors.accent,
  CLOSED: themeColors.textSecondary,
};

const STATUS_LABEL_KEY: Record<InquiryStatus, "inquiry.statusOpen" | "inquiry.statusPending" | "inquiry.statusClosed"> = {
  OPEN: "inquiry.statusOpen",
  PENDING: "inquiry.statusPending",
  CLOSED: "inquiry.statusClosed",
};

function DetailRow({ icon, label, value }: { icon: keyof typeof Feather.glyphMap; label: string; value: string }) {
  return (
    <View className="flex-row items-center gap-3 border-b border-border py-3">
      <View
        className="h-9 w-9 items-center justify-center rounded-full"
        style={{ backgroundColor: `${themeColors.primary}1A` }}
      >
        <Feather color={themeColors.primary} name={icon} size={16} />
      </View>
      <View className="flex-1">
        <AppText className="text-xs" muted>
          {label}
        </AppText>
        <AppText className="text-sm">{value}</AppText>
      </View>
    </View>
  );
}

export default function InquiryDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { data: inquiry, isLoading, error, refetch } = useInquiry(id, user?.email);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row items-center gap-3 px-6 pb-2 pt-4">
        <Pressable
          accessibilityLabel="Back"
          accessibilityRole="button"
          className="h-10 w-10 items-center justify-center rounded-full active:opacity-70"
          hitSlop={8}
          onPress={() => router.back()}
        >
          <Feather color={themeColors.text} name="chevron-left" size={24} />
        </Pressable>
        <AppText variant="title">{t("inquiry.detailTitle")}</AppText>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 80, gap: 16 }}>
        {isLoading ? (
          <View className="gap-3">
            <Skeleton height={24} width="70%" />
            <Skeleton height={16} width="40%" />
            <Skeleton height={100} />
          </View>
        ) : error ? (
          <ErrorState message={error.message} onRetry={refetch} retryLabel={t("products.retry")} />
        ) : !inquiry ? (
          <EmptyState icon="help-circle" message={t("inquiry.notFound")} />
        ) : (
          <>
            <View className="flex-row items-start justify-between gap-3">
              <AppText className="flex-1" variant="title">
                {inquiry.subject}
              </AppText>
              <View
                className="rounded-full px-2.5 py-1"
                style={{ backgroundColor: `${STATUS_COLOR[inquiry.status]}1F` }}
              >
                <AppText className="text-xs" style={{ color: STATUS_COLOR[inquiry.status] }}>
                  {t(STATUS_LABEL_KEY[inquiry.status])}
                </AppText>
              </View>
            </View>

            <AppText className="text-xs" muted>
              {t("inquiry.submittedOn")} {new Date(inquiry.createdAt).toLocaleDateString()}
            </AppText>

            <View className="gap-1 rounded-2xl border border-border bg-card p-4">
              <AppText className="text-xs" muted>
                {t("inquiry.message")}
              </AppText>
              <AppText className="text-sm">{inquiry.message}</AppText>
            </View>

            <View>
              <DetailRow icon="user" label={t("inquiry.name")} value={inquiry.name} />
              <DetailRow icon="mail" label={t("inquiry.email")} value={inquiry.email} />
              {inquiry.phone ? <DetailRow icon="phone" label={t("inquiry.phone")} value={inquiry.phone} /> : null}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
