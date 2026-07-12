import AsyncStorage from "@react-native-async-storage/async-storage";
import { translations } from "@/i18n/translations";
import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from "react";
import { I18nManager } from "react-native";

export type Language = "en" | "ar";

const LANGUAGE_KEY = "app-language";

type TranslationKey = keyof typeof translations.en;

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function isLanguage(value: string | null): value is Language {
  return value === "en" || value === "ar";
}

export function LanguageProvider({ children }: PropsWithChildren) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const restore = async () => {
      try {
        const stored = await AsyncStorage.getItem(LANGUAGE_KEY);
        if (isLanguage(stored) && stored !== language) {
          I18nManager.allowRTL(stored === "ar");
          I18nManager.forceRTL(stored === "ar");
          setLanguageState(stored);
        }
      } catch (e) {
        console.error("Failed to restore persisted language", e);
      }
    };

    restore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLanguage = (nextLanguage: Language) => {
    I18nManager.allowRTL(nextLanguage === "ar");
    I18nManager.forceRTL(nextLanguage === "ar");
    setLanguageState(nextLanguage);
    AsyncStorage.setItem(LANGUAGE_KEY, nextLanguage).catch((e) =>
      console.error("Failed to persist language", e),
    );
  };

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      t: (key) => translations[language][key] ?? translations.en[key],
    }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}
