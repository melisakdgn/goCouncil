import { Link } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { colors, layout, typography } from "@/constants/theme";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.logo}>GO COUNCIL</Text>

        <View style={styles.links}>
          <Link href="/imprint" style={styles.link}>
            <Text style={styles.linkText}>{t("footer.imprint")}</Text>
          </Link>
          <Text style={styles.divider}>·</Text>
          <Link href="/data-protection" style={styles.link}>
            <Text style={styles.linkText}>{t("footer.dataProtection")}</Text>
          </Link>
          <Text style={styles.divider}>·</Text>
          <Link href="/accessibility" style={styles.link}>
            <Text style={styles.linkText}>{t("footer.accessibility")}</Text>
          </Link>
        </View>

        <LanguageSwitcher />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primaryNavy,
    paddingVertical: 20,
  },
  inner: {
    maxWidth: layout.maxContentWidth,
    width: "100%",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: layout.containerPaddingH,
  },
  logo: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.textOnDark,
    letterSpacing: 1,
  },
  links: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  link: {
    textDecorationLine: "none",
  },
  linkText: {
    fontSize: typography.fontSize.sm,
    color: colors.textOnDark,
    opacity: 0.8,
  },
  divider: {
    color: colors.textOnDark,
    opacity: 0.4,
  },
});
