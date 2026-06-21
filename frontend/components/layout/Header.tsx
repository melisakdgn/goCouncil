import { usePathname, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Image, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, layout, spacing, typography } from "@/constants/theme";
import { ROUTES } from "@/constants/routes";
import LanguageSwitcher from "./LanguageSwitcher";
import { isElectionRoute } from "@/utils/scroll";

// Primary navigation (Home and Election are rendered separately, in order).
const NAV_ITEMS = [
  { labelKey: "nav.home", href: ROUTES.home },
  { labelKey: "nav.achievements", href: ROUTES.achievements },
  { labelKey: "nav.faq", href: ROUTES.faq },
  { labelKey: "nav.problems", href: ROUTES.problems },
  { labelKey: "nav.contact", href: ROUTES.contact },
] as const;

export default function Header() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();

  const isElectionActive = isElectionRoute(pathname);

  function goToRoute(href: string) {
    router.push(href as any);
  }

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Pressable style={styles.logoLink} onPress={() => goToRoute(ROUTES.home)}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logo}
            accessibilityLabel="goCouncil"
            resizeMode="contain"
          />
        </Pressable>

        <View style={styles.nav}>
          <Pressable style={styles.navItem} onPress={() => goToRoute(ROUTES.home)}>
            <Text style={[styles.navLabel, pathname === ROUTES.home && styles.navLabelActive]}>
              {t("nav.home")}
            </Text>
            {pathname === ROUTES.home && <View style={styles.activeUnderline} />}
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.navItem, pressed && styles.navItemPressed]}
            onPress={() => goToRoute(ROUTES.election)}
          >
            <Text style={[styles.navLabel, isElectionActive && styles.navLabelActive]}>
              {t("nav.election")}
            </Text>
            {isElectionActive && <View style={styles.activeUnderline} />}
          </Pressable>

          {NAV_ITEMS.slice(1).map((item) => {
            const isActive = pathname === item.href;

            return (
              <Pressable
                key={item.href}
                style={({ pressed }) => [styles.navItem, pressed && styles.navItemPressed]}
                onPress={() => goToRoute(item.href)}
              >
                <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                  {t(item.labelKey)}
                </Text>
                {isActive && <View style={styles.activeUnderline} />}
              </Pressable>
            );
          })}
        </View>

        <View style={styles.headerRight}>
          <LanguageSwitcher />
        </View>
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 20,
    zIndex: 9999,
  },
  inner: {
    maxWidth: layout.maxContentWidth,
    width: "100%",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: layout.containerPaddingH,
    height: "100%",
    gap: spacing.md,
    position: "relative",
    zIndex: 10,
  },
  logoLink: {
    flexShrink: 0,
  },
  logo: {
    height: 40,
    width: 211,
  },
  nav: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "nowrap",
    gap: spacing.sm,
    minWidth: 0,
  },
  navItem: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    cursor: "pointer" as any,
  },
  navItemPressed: {
    opacity: 0.7,
  },
  navLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
    letterSpacing: 0.1,
    textAlign: "center",
    ...(Platform.OS === "web" ? { whiteSpace: "nowrap" } : {}),
  },
  navLabelActive: {
    color: colors.primaryNavy,
    fontWeight: typography.fontWeight.semiBold,
  },
  activeUnderline: {
    position: "absolute",
    bottom: 0,
    left: spacing.xs,
    right: spacing.xs,
    height: 2.5,
    backgroundColor: colors.accentOrange,
    borderRadius: 2,
  },
  headerRight: {
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
});
