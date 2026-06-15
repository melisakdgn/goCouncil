import { Link, usePathname } from "expo-router";
import { useTranslation } from "react-i18next";
import { Image, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, layout, spacing, typography } from "@/constants/theme";
import { ROUTES } from "@/constants/routes";
import LanguageSwitcher from "./LanguageSwitcher";

// Maps a route href to its nativeID on the home page.
// "__top__" is a sentinel that scrolls to the very top.
const HOME_SECTION_IDS: Partial<Record<string, string>> = {
  [ROUTES.home]: "__top__",
  [ROUTES.candidates]: "section-candidates",
  [ROUTES.electionProcess]: "section-election",
  [ROUTES.achievements]: "section-achievements",
  [ROUTES.preferenceMatching]: "section-preference",
};

const NAV_ITEMS = [
  { labelKey: "nav.home", href: ROUTES.home },
  { labelKey: "nav.candidates", href: ROUTES.candidates },
  { labelKey: "nav.electionProcess", href: ROUTES.electionProcess },
  { labelKey: "nav.achievements", href: ROUTES.achievements },
  { labelKey: "nav.preferenceMatching", href: ROUTES.preferenceMatching },
  { labelKey: "nav.faq", href: ROUTES.faq },
  { labelKey: "nav.problems", href: ROUTES.problems },
  { labelKey: "nav.contact", href: ROUTES.contact },
] as const;

function smoothScrollToSection(sectionId: string) {
  if (Platform.OS !== "web" || typeof document === "undefined") return;
  if (sectionId === "__top__") {
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export default function Header() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        {/* Logo */}
        <Link href={ROUTES.home} style={styles.logoLink}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logo}
            accessibilityLabel="goCouncil"
            resizeMode="contain"
          />
        </Link>

        {/* Navigation */}
        <View style={styles.nav}>
          {NAV_ITEMS.map(({ labelKey, href }) => {
            const isActive = pathname === href;
            const sectionId = HOME_SECTION_IDS[href];

            // On home page (web): clicking a nav item that has a section scrolls to it
            if (isHome && Platform.OS === "web" && sectionId) {
              return (
                <Pressable
                  key={href}
                  style={({ pressed }) => [styles.navItem, pressed && styles.navItemPressed]}
                  onPress={() => smoothScrollToSection(sectionId)}
                >
                  <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                    {t(labelKey)}
                  </Text>
                  {isActive && <View style={styles.activeUnderline} />}
                </Pressable>
              );
            }

            // Default: navigate to route
            return (
              <Link key={href} href={href} asChild>
                <Pressable
                  style={({ pressed }) => [styles.navItem, pressed && styles.navItemPressed]}
                >
                  <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                    {t(labelKey)}
                  </Text>
                  {isActive && <View style={styles.activeUnderline} />}
                </Pressable>
              </Link>
            );
          })}
        </View>

        {/* Right side */}
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
    elevation: 3,
    zIndex: 100,
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
  },

  // Logo — 1024×194 source; height fits within nav bar
  logoLink: { flexShrink: 0, textDecorationLine: "none" },
  logo: {
    height: 40,
    width: 211,
  },

  // Nav — centered with equal gaps between every item
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
  },
  navItemPressed: { opacity: 0.7 },
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
