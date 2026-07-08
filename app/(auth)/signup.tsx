import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { AppText } from "@/components/ui/app-text";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { PrimaryButton } from "@/components/ui/primary-button";
import { TextField } from "@/components/ui/text-field";
import { themeColors } from "@/config/design-tokens";
import { useLanguage } from "@/i18n/i18n-provider";

export default function SignUpScreen() {
  const { t } = useLanguage();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);

  const handleSignUp = () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      Alert.alert(t("auth.signupTitle"), "All fields are required");
      return;
    }

    router.push({
      pathname: "/(auth)/verify-otp",
      params: { name, email, phone, password },
    });
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: themeColors.background }}>
      <LanguageToggle variant="light" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <View className="flex-1 px-6 pb-8 pt-12">
          <View className="items-center gap-2">
            <AppText variant="title">{t("auth.signupTitle")}</AppText>
            <AppText className="px-4 text-center text-sm" muted>
              {t("auth.signupSubtitle")}
            </AppText>
          </View>

          <View className="mt-8 gap-4">
            <TextField
              leftIcon="user"
              onChangeText={setName}
              placeholder={t("auth.name")}
              value={name}
            />
            <TextField
              autoCapitalize="none"
              keyboardType="email-address"
              leftIcon="mail"
              onChangeText={setEmail}
              placeholder={t("auth.email")}
              value={email}
            />
            <TextField
              keyboardType="phone-pad"
              leftIcon="phone"
              onChangeText={setPhone}
              placeholder={t("auth.phone")}
              value={phone}
            />
            <TextField
              leftIcon="lock"
              onChangeText={setPassword}
              onRightIconPress={() => setSecureText(!secureText)}
              placeholder={t("auth.password")}
              rightIcon={secureText ? "eye-off" : "eye"}
              secureTextEntry={secureText}
              value={password}
            />
          </View>

          <View className="mt-6 gap-6">
            <PrimaryButton label={t("auth.signup")} onPress={handleSignUp} />

            <View className="flex-row items-center justify-center gap-1">
              <AppText className="text-sm" muted>
                {t("auth.haveAccount")}
              </AppText>
              <AppText
                className="text-sm underline"
                onPress={() => router.back()}
                style={{ color: themeColors.accent }}
              >
                {t("auth.login")}
              </AppText>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
