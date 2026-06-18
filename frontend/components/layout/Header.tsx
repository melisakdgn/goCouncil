import { usePathname, useRouter } from "expo-router";
import { useState } from "react";
import { Image, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, layout, spacing, typography } from "@/constants/theme";
import { ROUTES } from "@/constants/routes";
import LanguageSwitcher from "./LanguageSwitcher";

const ELECTION_ITEMS = [
  { label: "Candidate Info", sectionId: "election-candidates" },
  { label: "Preference Matching", sectionId: "election-preference" },
  { label: "Election Progress", sectionId: "election-process" },
] as const;

const NAV_ITEMS = [
  { label: "Home", href: ROUTES.home },
  { label: "Achievements", href: ROUTES.achievements },
  { label: "FAQ", href: ROUTES.faq },
  { label: "Problems", href: ROUTES.problems },
  { label: "Contact", href: ROUTES.contact },
] as const;

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [electionOpen, setElectionOpen] = useState(false);

  const isElectionActive = pathname === ROUTES.election;

  function goToElection(sectionId?: string) {
    setElectionOpen(false);

    if (Platform.OS === "web" && sectionId) {
      sessionStorage.setItem("goCouncilElectionSection", sectionId);
    }

    router.push(ROUTES.election as any);

    if (Platform.OS === "web" && pathname === ROUTES.election && sectionId) {
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 150);
    }
  }

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
              Home
            </Text>
            {pathname === ROUTES.home && <View style={styles.activeUnderline} />}
          </Pressable>

          <View
            style={styles.dropdownWrapper}
            // @ts-ignore web only
            onMouseEnter={() => setElectionOpen(true)}
            // @ts-ignore web only
            onMouseLeave={() => setElectionOpen(false)}
          >
            <Pressable style={styles.navItem} onPress={() => goToElection()}>
              <Text style={[styles.navLabel, isElectionActive && styles.navLabelActive]}>
                Election
              </Text>
              {isElectionActive && <View style={styles.activeUnderline} />}
            </Pressable>

            {electionOpen && (
              <View style={styles.dropdown}>
                {ELECTION_ITEMS.map((item) => (
                  <Pressable
                    key={item.sectionId}
                    style={({ pressed }) => [
                      styles.dropdownItem,
                      pressed && styles.navItemPressed,
                    ]}
                    onPress={() => goToElection(item.sectionId)}
                  >
                    <Text style={styles.dropdownText}>{item.label}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {NAV_ITEMS.slice(1).map((item) => {
            const isActive = pathname === item.href;

            return (
              <Pressable
                key={item.href}
                style={({ pressed }) => [styles.navItem, pressed && styles.navItemPressed]}
                onPress={() => goToRoute(item.href)}
              >
                <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                  {item.label}
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
  dropdownWrapper: {
    position: "relative",
    zIndex: 99999,
    paddingVertical: 8,
  },

  dropdown: {
    position: "absolute",
    top: 40,
    left: 0,
    minWidth: 230,
    backgroundColor: colors.backgroundWhite,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderColor,
    paddingVertical: spacing.xs,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 30,
    zIndex: 999999,
  },

  dropdownItem: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    cursor: "pointer" as any,
  },

  dropdownText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  headerRight: {
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
});