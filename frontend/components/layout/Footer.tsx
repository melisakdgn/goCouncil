import { Link } from "expo-router";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, Text, View } from "react-native";
import { colors, layout, spacing, typography } from "@/constants/theme";
import { ROUTES } from "@/constants/routes";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.logo}>GO COUNCIL</Text>

        <View style={styles.links}>
          <Link href={ROUTES.imprint} style={styles.link}>
            <Text style={styles.linkText}>{t("footer.imprint")}</Text>
          </Link>
          <Text style={styles.divider}>·</Text>
          <Link href={ROUTES.dataProtection} style={styles.link}>
            <Text style={styles.linkText}>{t("footer.dataProtection")}</Text>
          </Link>
          <Text style={styles.divider}>·</Text>
          <Link href={ROUTES.accessibility} style={styles.link}>
            <Text style={styles.linkText}>{t("footer.accessibility")}</Text>
          </Link>
        </View>

        <View style={styles.languageSlot}>
          <LanguageSwitcher variant="dark" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primaryNavy,
    paddingVertical: spacing.lg,
  },
  inner: {
    maxWidth: layout.maxContentWidth,
    width: "100%",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: layout.containerPaddingH,
    minHeight: 44,
    gap: spacing.md,
  },
  logo: {
    flexShrink: 0,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.textOnDark,
    letterSpacing: 1,
  },
  links: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "nowrap",
    gap: spacing.sm,
    minWidth: 0,
  },
  link: {
    flexShrink: 0,
    textDecorationLine: "none",
  },
  linkText: {
    fontSize: typography.fontSize.sm,
    color: colors.textOnDark,
    opacity: 0.85,
    ...(Platform.OS === "web" ? { whiteSpace: "nowrap" } : {}),
  },
  divider: {
    flexShrink: 0,
    color: colors.textOnDark,
    opacity: 0.4,
  },
  languageSlot: {
    flexShrink: 0,
    width: 96,
    alignItems: "flex-end",
  },
});
