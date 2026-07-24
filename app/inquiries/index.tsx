import { Pressable, ScrollView, View } from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppText } from "@/components/ui/app-text";
import { PrimaryButton } from "@/components/ui/primary-button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/ui/state-view";
import { themeColors } from "@/config/design-tokens";
import { useAuth } from "@/features/auth/auth-provider";
import { useMyInquiries } from "@/hooks/use-my-inquiries";
import { useLanguage } from "@/i18n/i18n-provider";
import type { Inquiry, InquiryStatus } from "@/types/api";

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

function InquiryRow({ inquiry }: { inquiry: Inquiry }) {
  const { t } = useLanguage();
  const color = STATUS_COLOR[inquiry.status];

  return (
    <Pressable
      className="gap-2 rounded-2xl border border-border bg-card p-4 active:opacity-80"
      onPress={() => router.push(`/inquiries/${inquiry.id}`)}
    >
      <View className="flex-row items-start justify-between gap-3">
        <AppText className="flex-1" numberOfLines={1} variant="subtitle">
          {inquiry.subject}
        </AppText>
        <View className="rounded-full px-2.5 py-1" style={{ backgroundColor: `${color}1F` }}>
          <AppText className="text-xs" style={{ color }}>
            {t(STATUS_LABEL_KEY[inquiry.status])}
          </AppText>
        </View>
      </View>
      <AppText className="text-sm" muted numberOfLines={2}>
        {inquiry.message}
      </AppText>
      <View className="flex-row items-center justify-between">
        <AppText className="text-xs" muted>
          {new Date(inquiry.createdAt).toLocaleDateString()}
        </AppText>
        <Feather color={themeColors.textSecondary} name="chevron-right" size={16} />
      </View>
    </Pressable>
  );
}

function LoggedOutPrompt() {
  const { t } = useLanguage();
  return (
    <View className="items-center gap-4 py-10">
      <View
        className="h-20 w-20 items-center justify-center rounded-full"
        style={{ backgroundColor: `${themeColors.primary}1A` }}
      >
        <Feather color={themeColors.primary} name="user" size={34} />
      </View>
      <AppText className="text-center" variant="subtitle">
        {t("profile.loggedOutTitle")}
      </AppText>
      <AppText className="px-6 text-center text-sm" muted>
        {t("profile.loggedOutSubtitle")}
      </AppText>
      <View className="mt-2 w-full">
        <PrimaryButton label={t("auth.login")} onPress={() => router.push("/(auth)/login")} />
      </View>
    </View>
  );
}

export default function MyInquiriesScreen() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { data: inquiries, isLoading, error, refetch } = useMyInquiries(user?.email);

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
        <AppText variant="title">{t("menu.myInquiries")}</AppText>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120, gap: 12 }}>
        {!user ? (
          <LoggedOutPrompt />
        ) : isLoading ? (
          <View className="gap-3">
            <Skeleton borderRadius={16} height={92} />
            <Skeleton borderRadius={16} height={92} />
            <Skeleton borderRadius={16} height={92} />
          </View>
        ) : error ? (
          <ErrorState message={error.message} onRetry={refetch} retryLabel={t("products.retry")} />
        ) : !inquiries || inquiries.length === 0 ? (
          <EmptyState icon="help-circle" message={t("inquiry.empty")} />
        ) : (
          inquiries.map((inquiry) => <InquiryRow inquiry={inquiry} key={inquiry.id} />)
        )}

        {user ? (
          <Pressable
            className="mt-2 flex-row items-center justify-center gap-2 rounded-xl border border-dashed p-4 active:opacity-70"
            onPress={() => router.push("/inquiry")}
            style={{ borderColor: themeColors.primary }}
          >
            <Feather color={themeColors.primary} name="plus" size={16} />
            <AppText style={{ color: themeColors.primary }}>{t("inquiry.newInquiry")}</AppText>
          </Pressable>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
