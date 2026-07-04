import { translations } from "@/i18n/translations";
import { PropsWithChildren, createContext, useContext, useMemo, useState } from "react";
import { I18nManager } from "react-native";

export type Language = "en" | "ar";

type TranslationKey = keyof typeof translations.en;

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: PropsWithChildren) {
  const [language, setLanguageState] = useState<Language>("en");

  const setLanguage = (nextLanguage: Language) => {
    I18nManager.allowRTL(nextLanguage === "ar");
    I18nManager.forceRTL(nextLanguage === "ar");
    setLanguageState(nextLanguage);
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
