import { Link, usePathname } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, layout, typography } from "@/constants/theme";
import { ROUTES } from "@/constants/routes";
import LanguageSwitcher from "./LanguageSwitcher";

const NAV_ITEMS = [
  { labelKey: "nav.home", href: ROUTES.home },
  { labelKey: "nav.candidates", href: ROUTES.candidates },
  { labelKey: "nav.electionProcess", href: ROUTES.electionProcess },
  { labelKey: "nav.achievements", href: ROUTES.achievements },
  { labelKey: "nav.preferenceMatching", href: ROUTES.preferenceMatching },
  { labelKey: "nav.faq", href: ROUTES.faq },
  { labelKey: "nav.contact", href: ROUTES.contact },
] as const;

export default function Header() {
  const { t } = useTranslation();
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Link href={ROUTES.home} style={styles.logo}>
          <Text style={styles.logoText}>GO COUNCIL</Text>
        </Link>

        <View style={styles.nav}>
          {NAV_ITEMS.map(({ labelKey, href }) => {
            const isActive = pathname === href;
            return (
              <Link key={href} href={href} asChild>
                <Pressable style={styles.navItem}>
                  <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                    {t(labelKey)}
                  </Text>
                  {isActive && <View style={styles.activeUnderline} />}
                </Pressable>
              </Link>
            );
          })}
        </View>

        <LanguageSwitcher />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundWhite,
    height: layout.navHeight,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    zIndex: 100,
  },
  inner: {
    maxWidth: layout.maxContentWidth,
    width: "100%",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: layout.containerPaddingH,
    height: "100%",
  },
  logo: {
    textDecorationLine: "none",
  },
  logoText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primaryNavy,
    letterSpacing: 1,
  },
  nav: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  navItem: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: "center",
    position: "relative",
  },
  navLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  navLabelActive: {
    color: colors.primaryNavy,
    fontWeight: typography.fontWeight.semiBold,
  },
  activeUnderline: {
    position: "absolute",
    bottom: 0,
    left: 10,
    right: 10,
    height: 2,
    backgroundColor: colors.accentOrange,
    borderRadius: 1,
  },
});
