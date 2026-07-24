import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { AppText } from "@/components/ui/app-text";
import { PrimaryButton } from "@/components/ui/primary-button";
import { TextField } from "@/components/ui/text-field";
import { themeColors } from "@/config/design-tokens";
import { useAuth } from "@/features/auth/auth-provider";
import { useSubmitInquiry } from "@/hooks/use-submit-inquiry";
import { useLanguage } from "@/i18n/i18n-provider";

export default function InquiryScreen() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { subject: subjectParam } = useLocalSearchParams<{ subject?: string }>();
  const { submit, isSubmitting, error } = useSubmitInquiry();

  const [name, setName] = useState(user?.fullName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [subject, setSubject] = useState(subjectParam ?? "");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setValidationError(null);
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setValidationError(t("inquiry.requiredError"));
      return;
    }
    try {
      await submit({ name, email, phone: phone.trim() || undefined, subject, message });
      setIsSubmitted(true);
    } catch {
      // error state is already tracked by useSubmitInquiry
    }
  };

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
        <AppText variant="title">{t("inquiry.title")}</AppText>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 80, gap: 16 }}>
        {isSubmitted ? (
          <View className="items-center gap-4 py-10">
            <View
              className="h-20 w-20 items-center justify-center rounded-full"
              style={{ backgroundColor: `${themeColors.success}1A` }}
            >
              <Feather color={themeColors.success} name="check-circle" size={36} />
            </View>
            <AppText className="text-center" variant="subtitle">
              {t("inquiry.successTitle")}
            </AppText>
            <AppText className="px-6 text-center text-sm" muted>
              {t("inquiry.successMessage")}
            </AppText>
            <View className="mt-2 w-full">
              <PrimaryButton label={t("inquiry.backHome")} onPress={() => router.replace("/(tabs)/Home")} />
            </View>
          </View>
        ) : (
          <>
            <AppText className="text-sm" muted>
              {t("inquiry.subtitle")}
            </AppText>

            <TextField leftIcon="user" onChangeText={setName} placeholder={t("inquiry.name")} value={name} />
            <TextField
              autoCapitalize="none"
              keyboardType="email-address"
              leftIcon="mail"
              onChangeText={setEmail}
              placeholder={t("inquiry.email")}
              value={email}
            />
            <TextField
              keyboardType="phone-pad"
              leftIcon="phone"
              onChangeText={setPhone}
              placeholder={t("inquiry.phone")}
              value={phone}
            />
            <TextField leftIcon="tag" onChangeText={setSubject} placeholder={t("inquiry.subject")} value={subject} />
            <TextField
              leftIcon="message-square"
              multiline
              numberOfLines={5}
              onChangeText={setMessage}
              placeholder={t("inquiry.message")}
              style={{ minHeight: 100, textAlignVertical: "top" }}
              value={message}
            />

            {validationError || error ? (
              <AppText className="text-sm" style={{ color: themeColors.error }}>
                {validationError ?? error?.message}
              </AppText>
            ) : null}

            <PrimaryButton disabled={isSubmitting} label={t("inquiry.submit")} onPress={handleSubmit} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
