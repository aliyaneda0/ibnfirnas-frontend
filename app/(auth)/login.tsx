import { AppText } from "@/components/ui/app-text";
import { PrimaryButton } from "@/components/ui/primary-button";
import { Screen } from "@/components/ui/screen";
import { TextField } from "@/components/ui/text-field";
import { useAuth } from "@/features/auth/auth-provider";
import { useLanguage } from "@/i18n/i18n-provider";
import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

export default function LoginScreen() {
  const { loginWithToken } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+974");
  const [phone, setPhone] = useState("");

  const handleDemoLogin = () => {
    loginWithToken("demo-jwt-token");
    router.replace("/");
  };

  return (
    <Screen>
      <View style={{ gap: 8 }}>
        <AppText variant="title">{t("auth.loginTitle")}</AppText>
        <AppText muted>{t("auth.loginSubtitle")}</AppText>
      </View>
      <TextField
        label={t("auth.email")}
        keyboardType="email-address"
        onChangeText={setEmail}
        value={email}
      />
      <TextField
        label={t("auth.countryCode")}
        keyboardType="phone-pad"
        onChangeText={setCountryCode}
        value={countryCode}
      />
      <TextField
        label={t("auth.phone")}
        keyboardType="phone-pad"
        onChangeText={setPhone}
        value={phone}
      />
      <PrimaryButton label={t("auth.continue")} onPress={handleDemoLogin} />
    </Screen>
  );
}
