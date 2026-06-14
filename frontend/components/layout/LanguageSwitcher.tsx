import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { borderRadius, colors, typography } from "@/constants/theme";
import { useLocaleStore } from "@/store/localeStore";
import type { Locale } from "@/types";

const LOCALES: Locale[] = ["en", "de"];

type LanguageSwitcherVariant = "light" | "dark";

interface LanguageSwitcherProps {
  /** `light` = header (white bg), `dark` = footer (navy bg) */
  variant?: LanguageSwitcherVariant;
}

export default function LanguageSwitcher({ variant = "light" }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const { locale, setLocale } = useLocaleStore();
  const isDark = variant === "dark";

  const handleSwitch = (lang: Locale) => {
    if (lang === locale) return;
    setLocale(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <View
      style={[styles.track, isDark ? styles.trackDark : styles.trackLight]}
      accessibilityRole="tablist"
    >
      {LOCALES.map((lang) => {
        const isActive = locale === lang;
        return (
          <Pressable
            key={lang}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={lang === "en" ? "English" : "Deutsch"}
            onPress={() => handleSwitch(lang)}
            style={({ pressed }) => [
              styles.option,
              isActive && (isDark ? styles.optionActiveDark : styles.optionActiveLight),
              pressed && !isActive && styles.optionPressed,
            ]}
          >
            <Text
              style={[
                styles.label,
                isDark ? styles.labelDark : styles.labelLight,
                isActive && (isDark ? styles.labelActiveDark : styles.labelActiveLight),
              ]}
            >
              {lang.toUpperCase()}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const OPTION_WIDTH = 44;

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: borderRadius.full,
    borderWidth: 1,
    padding: 3,
    flexShrink: 0,
    width: OPTION_WIDTH * LOCALES.length + 6 + 2, // options + padding + border
  },
  trackLight: {
    borderColor: colors.borderColor,
    backgroundColor: colors.backgroundLight,
  },
  trackDark: {
    borderColor: "rgba(255,255,255,0.25)",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  option: {
    width: OPTION_WIDTH,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: borderRadius.full,
  },
  optionActiveLight: {
    backgroundColor: colors.primaryNavy,
  },
  optionActiveDark: {
    backgroundColor: colors.textOnDark,
  },
  optionPressed: {
    opacity: 0.75,
  },
  label: {
    width: OPTION_WIDTH,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  labelLight: {
    color: colors.textMuted,
  },
  labelDark: {
    color: "rgba(255,255,255,0.55)",
  },
  labelActiveLight: {
    color: colors.textOnDark,
  },
  labelActiveDark: {
    color: colors.primaryNavy,
  },
});
