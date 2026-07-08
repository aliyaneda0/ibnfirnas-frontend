import { useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { AppText } from "@/components/ui/app-text";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { PrimaryButton } from "@/components/ui/primary-button";
import { TextField } from "@/components/ui/text-field";
import { themeColors } from "@/config/design-tokens";
import { useAuth } from "@/features/auth/auth-provider";
import { useLanguage } from "@/i18n/i18n-provider";

export default function LoginScreen() {
  const { login } = useAuth();
  const { t } = useLanguage();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    setIsSubmitting(true);
    try {
      await login(phone, password);
      router.replace("/(tabs)/Home");
    } catch (error) {
      Alert.alert(t("auth.loginTitle"), (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: themeColors.primary }}>
      <LanguageToggle variant="dark" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <View className="flex-1 px-6 pb-8 pt-36">
          <View className="items-center gap-2">
            <View className="mb-2 items-center justify-center rounded-2xl bg-white p-1.5">
              <Image
                source={require("../../assets/images/splash-icon.png")}
                style={{ width: 76, height: 76 }}
                resizeMode="contain"
              />
            </View>
            <AppText className="text-3xl pt-2" style={{ color: "#FFFFFF" }} variant="title">
              {t("auth.loginTitle")}
            </AppText>
            <AppText className="px-4 text-center text-sm" style={{ color: "#CBD5E1" }}>
              {t("auth.loginSubtitle")}
            </AppText>
          </View>

          <View className="mt-8 gap-4">
            <TextField
              keyboardType="phone-pad"
              leftIcon="phone"
              onChangeText={setPhone}
              placeholder={t("auth.phone")}
              value={phone}
              variant="dark"
            />
            <TextField
              leftIcon="lock"
              onChangeText={setPassword}
              onRightIconPress={() => setSecureText(!secureText)}
              placeholder={t("auth.password")}
              rightIcon={secureText ? "eye-off" : "eye"}
              secureTextEntry={secureText}
              value={password}
              variant="dark"
            />
          </View>

          <View className="mt-6 gap-6">
            <PrimaryButton
              disabled={isSubmitting}
              label={t("auth.continue")}
              onPress={handleLogin}
              variant="inverse"
            />

            <View className="flex-row items-center justify-center gap-1">
              <AppText className="text-sm" style={{ color: "#CBD5E1" }}>
                {t("auth.newUser")}
              </AppText>
              <AppText
                className="text-sm underline"
                onPress={() => router.push("/(auth)/signup")}
                style={{ color: themeColors.accent }}
              >
                {t("auth.signup")}
              </AppText>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
