import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useLocaleStore } from "@/store/localeStore";
import { colors, typography } from "@/constants/theme";
import type { Locale } from "@/types";

const LOCALES: Locale[] = ["en", "de"];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { locale, setLocale } = useLocaleStore();

  const handleSwitch = (lang: Locale) => {
    setLocale(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <View style={styles.container}>
      {LOCALES.map((lang, idx) => (
        <View key={lang} style={styles.item}>
          {idx > 0 && <Text style={styles.separator}>|</Text>}
          <Pressable onPress={() => handleSwitch(lang)}>
            <Text style={[styles.label, locale === lang && styles.active]}>
              {lang.toUpperCase()}
            </Text>
          </Pressable>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  separator: {
    color: colors.textMuted,
    fontSize: typography.fontSize.sm,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.textMuted,
  },
  active: {
    color: colors.primaryNavy,
    fontWeight: typography.fontWeight.bold,
  },
});
