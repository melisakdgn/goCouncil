import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ImageBackground,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppLayout from "@/components/layout/AppLayout";
import { useScrollToSection } from "@/components/layout/ScrollContext";
import CandidateCard from "@/components/cards/CandidateCard";
import AchievementCard from "@/components/cards/AchievementCard";
import NewsUpdateCard from "@/components/cards/NewsUpdateCard";
import ElectionTimeline from "@/components/sections/ElectionTimeline";
import Button from "@/components/ui/Button";
import {
  MOCK_ACHIEVEMENTS,
  MOCK_CANDIDATES,
  MOCK_ELECTION,
  MOCK_NEWS,
} from "@/constants/mockData";
import { ROUTES } from "@/constants/routes";
import { borderRadius, colors, layout, spacing, typography } from "@/constants/theme";

// ─── Value pillar definitions ─────────────────────────────────────────────────
const PILLARS = [
  { key: "fairRep",        icon: "account-group",  descKey: "fairRepDesc" },
  { key: "strongTogether", icon: "handshake",       descKey: "strongTogetherDesc" },
  { key: "yourRights",     icon: "shield-check",    descKey: "yourRightsDesc" },
  { key: "achievements",   icon: "trophy",          descKey: "achievementsDesc" },
] as const;

// ─── Value Pillar Card ────────────────────────────────────────────────────────
function ValuePillarCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <View
      style={[styles.pillarCard, hovered && styles.pillarCardHovered]}
      // @ts-ignore - web only pointer events
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <View style={[styles.pillarIconBg, hovered && styles.pillarIconBgHovered]}>
        <MaterialCommunityIcons
          name={icon as any}
          size={26}
          color={hovered ? "#FFFFFF" : colors.accentOrange}
        />
      </View>
      <Text style={styles.pillarTitle}>{title}</Text>
      <Text style={styles.pillarDesc}>{description}</Text>
    </View>
  );
}

// ─── Section Label (small overline label above headings) ─────────────────────
function SectionLabel({ text, light = false }: { text: string; light?: boolean }) {
  return (
    <View style={styles.sectionLabel}>
      <View style={[styles.sectionLabelBar, light && styles.sectionLabelBarLight]} />
      <Text style={[styles.sectionLabelText, light && styles.sectionLabelTextLight]}>
        {text}
      </Text>
    </View>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const scrollToSection = useScrollToSection();
  const { height: windowHeight } = useWindowDimensions();
  // SSR returns windowHeight=0; initialize to 500 to match, then update after hydration
  const [sh, setSh] = useState(500);
  useEffect(() => {
    setSh(Math.max(windowHeight - layout.navHeight, 500));
  }, [windowHeight]);
  const previewCandidates = MOCK_CANDIDATES.slice(0, 6);

  return (
    <AppLayout fullWidth>

      {/* ══════════════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════════════ */}
      <ImageBackground
        nativeID="section-home"
        source={require("@/assets/images/hero-bg.png")}
        style={[styles.heroSection, { minHeight: sh }]}
        resizeMode="cover"
      >
        {/* Dark overlay for text readability */}
        <View style={styles.heroOverlay} />
        {/* Decorative background circles */}
        <View style={styles.heroDeco1} />
        <View style={styles.heroDeco2} />
        <View style={styles.heroDeco3} />
        {/* Orange accent ring */}
        <View style={styles.heroAccentRing} />
        <View style={styles.heroAccentDot} />

        {/* Hero content */}
        <View style={styles.heroInner}>
          <View style={styles.heroLeft}>
            {/* Election badge */}
            <View style={styles.heroBadge}>
              <View style={styles.heroBadgePulse} />
              <Text style={styles.heroBadgeText}>{t("home.heroBadge")}</Text>
            </View>

            <Text style={styles.heroTitle1}>{t("home.heroTitle1")}</Text>
            <Text style={styles.heroTitle2}>{t("home.heroTitle2")}</Text>
            <Text style={styles.heroSubtitle}>{t("home.heroSubtitle")}</Text>

            <View style={styles.heroCTARow}>
              <Button
                label={t("home.heroCTA")}
                variant="secondary"
                size="lg"
                testID="hero-cta-candidates"
                onPress={() => scrollToSection("section-candidates")}
              />
              <Pressable
                accessibilityRole="button"
                testID="hero-cta-preference"
                style={({ pressed }) => [
                  styles.heroOutlineBtn,
                  pressed && styles.heroOutlineBtnPressed,
                ]}
                onPress={() => scrollToSection("section-preference")}
              >
                <Text style={styles.heroOutlineBtnText}>{t("home.preferenceCTA")} →</Text>
              </Pressable>
            </View>
          </View>

          {/* Stats row — visible on wider screens */}
          <View style={styles.heroRight}>
            {[
              { value: "4,200+", labelKey: "home.statEmployees" },
              { value: "6",      labelKey: "home.statCandidates" },
              { value: "42",     labelKey: "home.statAgreements" },
            ].map(({ value, labelKey }) => (
              <View key={labelKey} style={styles.heroStatCard}>
                <Text style={styles.heroStatValue}>{value}</Text>
                <Text style={styles.heroStatLabel}>{t(labelKey)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Scroll hint */}
        <Pressable
          accessibilityRole="button"
          testID="hero-scroll-hint"
          style={styles.scrollHint}
          onPress={() => scrollToSection("section-values")}
        >
          <Text style={styles.scrollHintText}>{t("home.scrollToExplore")}</Text>
          <Text style={styles.scrollHintArrow}>↓</Text>
        </Pressable>
      </ImageBackground>

      {/* ══════════════════════════════════════════════════════════════════════
          VALUE PILLARS
      ══════════════════════════════════════════════════════════════════════ */}
      <View nativeID="section-values" style={styles.whiteSection}>
        <View style={styles.container}>
          <View style={styles.sectionIntro}>
            <SectionLabel text={t("home.valuesLabel")} />
            <Text style={styles.sectionHeading}>
              {t("home.valuesHeading")}
            </Text>
            <Text style={styles.sectionSubheading}>
              {t("home.valuesSubheading")}
            </Text>
          </View>

          <View style={styles.pillarsGrid}>
            {PILLARS.map(({ key, icon, descKey }) => (
              <ValuePillarCard
                key={key}
                icon={icon}
                title={t(`home.pillars.${key}`)}
                description={t(`home.pillars.${descKey}`)}
              />
            ))}
          </View>
        </View>
      </View>

      {/* ══════════════════════════════════════════════════════════════════════
          CANDIDATES
      ══════════════════════════════════════════════════════════════════════ */}
      <View nativeID="section-candidates" style={styles.lightSection}>
        <View style={styles.container}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderLeft}>
              <SectionLabel text={t("home.candidatesLabel")} />
              <Text style={styles.sectionHeading}>{t("home.candidatesTitle")}</Text>
              <Text style={styles.sectionSubheading}>{t("home.candidatesSubtitle")}</Text>
            </View>
            <Link href={ROUTES.candidates} style={styles.viewAllLink}>
              <Text style={styles.viewAllLinkText}>{t("home.viewAll")} →</Text>
            </Link>
          </View>

          <View style={styles.candidatesGrid}>
            {previewCandidates.map((c) => (
              <View key={c.id} style={styles.candidateCell}>
                <CandidateCard candidate={c} />
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* ══════════════════════════════════════════════════════════════════════
          ACHIEVEMENTS
      ══════════════════════════════════════════════════════════════════════ */}
      <View nativeID="section-achievements" style={styles.navySection}>
        {/* Subtle background decoration */}
        <View style={styles.navyDeco1} />
        <View style={styles.navyDeco2} />

        <View style={styles.container}>
          <View style={styles.sectionIntro}>
            <SectionLabel text={t("home.impactLabel")} light />
            <Text style={[styles.sectionHeading, styles.textWhite]}>
              {t("home.achievementsTitle")}
            </Text>
            <Text style={[styles.sectionSubheading, styles.textWhiteMuted]}>
              {t("home.achievementsSubtitle")}
            </Text>
          </View>

          <View style={styles.achievementsGrid}>
            {MOCK_ACHIEVEMENTS.map((a) => (
              <View key={a.id} style={styles.achievementCell}>
                <AchievementCard achievement={a} dark />
              </View>
            ))}
          </View>

          <View style={styles.centeredCTA}>
            <Link href={ROUTES.achievements} asChild>
              <Pressable style={styles.ghostBtnWhite}>
                <Text style={styles.ghostBtnWhiteText}>{t("home.viewAllAchievements")} →</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </View>

      {/* ══════════════════════════════════════════════════════════════════════
          PREFERENCE MATCHING
      ══════════════════════════════════════════════════════════════════════ */}
      <View nativeID="section-preference" style={styles.whiteSection}>
        <View style={styles.container}>
          <View style={styles.preferenceLayout}>
            {/* Left: description */}
            <View style={styles.preferenceLeft}>
              <SectionLabel text={t("home.smartFeatureLabel")} />
              <Text style={styles.sectionHeading}>{t("home.preferenceTitle")}</Text>
              <Text style={styles.sectionSubheading}>{t("home.preferenceSubtitle")}</Text>

              <View style={styles.preferenceFeatures}>
                {(
                  [
                    "preferenceFeature1",
                    "preferenceFeature2",
                    "preferenceFeature3",
                  ] as const
                ).map((key) => (
                  <View key={key} style={styles.preferenceFeatureItem}>
                    <View style={styles.preferenceCheckBadge}>
                      <Text style={styles.preferenceCheckText}>✓</Text>
                    </View>
                    <View style={styles.preferenceFeatureBody}>
                      <Text style={styles.preferenceFeatureTitle}>
                        {t(`home.${key}Title`)}
                      </Text>
                      <Text style={styles.preferenceFeatureDesc}>
                        {t(`home.${key}Desc`)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              <Button
                label={t("home.preferenceCTA")}
                variant="primary"
                size="lg"
                testID="preference-section-cta"
                onPress={() => router.push("/preference-matching" as any)}
                style={{ alignSelf: "flex-start", marginTop: spacing.xl } as any}
              />
            </View>

            {/* Right: decorative quiz card */}
            <View style={styles.preferenceRight}>
              <View style={styles.preferenceCard}>
                <View style={styles.preferenceCardHeader}>
                  <MaterialCommunityIcons
                    name="account-search"
                    size={28}
                    color={colors.accentOrange}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.preferenceCardTitle}>{t("home.preferenceCardTitle")}</Text>
                    <Text style={styles.preferenceCardSubtitle}>
                      {t("home.preferenceCardSubtitle")}
                    </Text>
                  </View>
                </View>

                <View style={styles.preferenceCardDivider} />

                <Text style={styles.preferenceCardQuestion}>
                  {t("home.preferenceCardQuestion")}
                </Text>
                {[
                  t("home.preferenceCardOption1"),
                  t("home.preferenceCardOption2"),
                  t("home.preferenceCardOption3"),
                ].map(
                  (option, i) => (
                    <View
                      key={option}
                      style={[
                        styles.preferenceCardOption,
                        i === 0 && styles.preferenceCardOptionSelected,
                      ]}
                    >
                      <View
                        style={[
                          styles.preferenceCardRadio,
                          i === 0 && styles.preferenceCardRadioSelected,
                        ]}
                      >
                        {i === 0 && <View style={styles.preferenceCardRadioDot} />}
                      </View>
                      <Text
                        style={[
                          styles.preferenceCardOptionText,
                          i === 0 && styles.preferenceCardOptionTextSelected,
                        ]}
                      >
                        {option}
                      </Text>
                    </View>
                  )
                )}

                <View style={styles.preferenceCardFooter}>
                  <MaterialCommunityIcons
                    name="lock-outline"
                    size={13}
                    color={colors.textMuted}
                  />
                  <Text style={styles.preferenceCardAnonymous}>{t("home.preferenceCardAnonymous")}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* ══════════════════════════════════════════════════════════════════════
          ELECTION PROCESS
      ══════════════════════════════════════════════════════════════════════ */}
      <View nativeID="section-election" style={styles.lightSection}>
        <View style={styles.container}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderLeft}>
              <SectionLabel text={t("home.timelineLabel")} />
              <Text style={styles.sectionHeading}>{t("home.electionProcessTitle")}</Text>
              <Text style={styles.sectionSubheading}>
                {t("home.electionProcessSubtitle")}
              </Text>
            </View>
            <Link href={ROUTES.electionProcess} style={styles.viewAllLink}>
              <Text style={styles.viewAllLinkText}>{t("home.fullDetails")} →</Text>
            </Link>
          </View>

          <View style={styles.timelineWrapper}>
            <ElectionTimeline steps={MOCK_ELECTION.steps} />
          </View>
        </View>
      </View>

      {/* ══════════════════════════════════════════════════════════════════════
          NEWS & UPDATES
      ══════════════════════════════════════════════════════════════════════ */}
      <View nativeID="section-news" style={styles.whiteSection}>
        <View style={styles.container}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeaderLeft}>
              <SectionLabel text={t("home.latestLabel")} />
              <Text style={styles.sectionHeading}>{t("home.newsTitle")}</Text>
            </View>
          </View>

          <View style={styles.newsGrid}>
            {MOCK_NEWS.map((n) => (
              <View key={n.id} style={styles.newsCell}>
                <NewsUpdateCard item={n} />
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* ══════════════════════════════════════════════════════════════════════
          PARTICIPATION CTA BANNER
      ══════════════════════════════════════════════════════════════════════ */}
      <View style={styles.ctaBanner}>
        <View style={styles.ctaBannerInner}>
          <View style={styles.ctaIconWrapper}>
            <MaterialCommunityIcons name="vote" size={32} color={colors.accentOrange} />
          </View>
          <View style={styles.ctaBannerText}>
            <Text style={styles.ctaBannerTitle}>{t("home.participationTitle")}</Text>
            <Text style={styles.ctaBannerSubtitle}>{t("home.participationSubtitle")}</Text>
          </View>
          <Button
            label={t("home.participationCTA")}
            variant="secondary"
            size="md"
            onPress={() => scrollToSection("section-preference")}
          />
        </View>
      </View>

    </AppLayout>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const HERO_BG = "#08142B";
const NAVY_SECTION_BG = colors.primaryNavy;

const styles = StyleSheet.create({

  // ── Shared container (max-width, centered, padded) ────────────────────────
  container: {
    maxWidth: layout.maxContentWidth,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: layout.containerPaddingH,
    paddingVertical: spacing["2xl"],
  },

  // ── Section base backgrounds ──────────────────────────────────────────────
  whiteSection: {
    backgroundColor: colors.backgroundWhite,
    width: "100%",
  },
  lightSection: {
    backgroundColor: colors.backgroundLight,
    width: "100%",
  },
  navySection: {
    backgroundColor: NAVY_SECTION_BG,
    width: "100%",
    overflow: "hidden",
  },

  // ── Section label (overline with bar) ─────────────────────────────────────
  sectionLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  sectionLabelBar: {
    width: 24,
    height: 3,
    backgroundColor: colors.accentOrange,
    borderRadius: 2,
  },
  sectionLabelBarLight: {
    backgroundColor: colors.accentOrange,
  },
  sectionLabelText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.accentOrange,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  sectionLabelTextLight: {
    color: "rgba(255,255,255,0.7)",
  },

  // ── Section headings ──────────────────────────────────────────────────────
  sectionIntro: {
    marginBottom: spacing.xl,
    maxWidth: 640,
  },
  sectionHeading: {
    fontSize: typography.fontSize["3xl"],
    fontWeight: typography.fontWeight.extraBold,
    color: colors.textPrimary,
    lineHeight: typography.fontSize["3xl"] * 1.15,
    marginBottom: spacing.sm,
  },
  sectionSubheading: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    lineHeight: typography.fontSize.base * 1.65,
    maxWidth: 560,
  },
  textWhite: { color: "#FFFFFF" },
  textWhiteMuted: { color: "rgba(255,255,255,0.65)" },

  // ── Section header row (title + view-all link side by side) ──────────────
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  sectionHeaderLeft: { flex: 1, minWidth: 240 },
  viewAllLink: { textDecorationLine: "none", marginTop: spacing.xs },
  viewAllLinkText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.accentOrange,
  },

  // ── Shared CTA helpers ────────────────────────────────────────────────────
  centeredCTA: {
    alignItems: "center",
    marginTop: spacing.xl,
  },
  ghostBtn: {
    borderWidth: 1.5,
    borderColor: colors.primaryNavy,
    paddingHorizontal: spacing["2xl"],
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  ghostBtnText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.primaryNavy,
  },
  ghostBtnWhite: {
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.5)",
    paddingHorizontal: spacing["2xl"],
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  ghostBtnWhiteText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: "#FFFFFF",
  },

  // ── HERO ─────────────────────────────────────────────────────────────────
  heroSection: {
    backgroundColor: HERO_BG,
    width: "100%",
    overflow: "hidden",
    justifyContent: "space-between",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(8,20,43,0.62)",
    pointerEvents: "none",
  },
  // Decorative layered circles
  heroDeco1: {
    position: "absolute",
    top: -120,
    right: -120,
    width: 520,
    height: 520,
    borderRadius: 260,
    backgroundColor: "#1A3F7A",
    opacity: 0.25,
    pointerEvents: "none",
  },
  heroDeco2: {
    position: "absolute",
    bottom: -80,
    left: -80,
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: "#0D2E5C",
    opacity: 0.5,
    pointerEvents: "none",
  },
  heroDeco3: {
    position: "absolute",
    top: "40%",
    right: "15%",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#1A3F7A",
    opacity: 0.15,
    pointerEvents: "none",
  },
  heroAccentRing: {
    position: "absolute",
    bottom: "20%",
    right: "30%",
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: colors.accentOrange,
    opacity: 0.3,
    pointerEvents: "none",
  },
  heroAccentDot: {
    position: "absolute",
    top: "25%",
    left: "55%",
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accentOrange,
    opacity: 0.6,
    pointerEvents: "none",
  },
  heroInner: {
    maxWidth: layout.maxContentWidth,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: layout.containerPaddingH,
    paddingTop: spacing["3xl"],
    paddingBottom: spacing["2xl"],
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing["2xl"],
    alignItems: "center",
    flex: 1,
  },
  heroLeft: {
    flex: 2,
    minWidth: 280,
    gap: spacing.md,
  },
  // Badge
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: "rgba(232,119,34,0.15)",
    alignSelf: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: "rgba(232,119,34,0.3)",
  },
  heroBadgePulse: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.accentOrange,
  },
  heroBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.accentOrange,
    letterSpacing: 0.5,
  },
  // Titles
  heroTitle1: {
    fontSize: typography.fontSize["4xl"],
    fontWeight: typography.fontWeight.extraBold,
    color: "#FFFFFF",
    lineHeight: typography.fontSize["4xl"] * 1.1,
    letterSpacing: -0.5,
  },
  heroTitle2: {
    fontSize: typography.fontSize["4xl"],
    fontWeight: typography.fontWeight.extraBold,
    color: colors.accentOrange,
    lineHeight: typography.fontSize["4xl"] * 1.1,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: typography.fontSize.md,
    color: "rgba(255,255,255,0.7)",
    lineHeight: typography.fontSize.md * 1.65,
    maxWidth: 480,
  },
  // CTA buttons
  heroCTARow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    flexWrap: "wrap",
    marginTop: spacing.sm,
  },
  heroOutlineBtn: {
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.5)",
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: borderRadius.md,
  },
  heroOutlineBtnPressed: { opacity: 0.7 },
  heroOutlineBtnText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semiBold,
    color: "rgba(255,255,255,0.9)",
  },
  // Stats panel (right side of hero)
  heroRight: {
    flex: 1,
    minWidth: 220,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    justifyContent: "center",
  },
  heroStatCard: {
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    minWidth: 100,
    flex: 1,
  },
  heroStatValue: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.extraBold,
    color: "#FFFFFF",
    marginBottom: 2,
  },
  heroStatLabel: {
    fontSize: typography.fontSize.xs,
    color: "rgba(255,255,255,0.55)",
    fontWeight: typography.fontWeight.medium,
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  // Scroll hint
  scrollHint: {
    alignSelf: "center",
    alignItems: "center",
    paddingBottom: spacing.lg,
    gap: 2,
  },
  scrollHintText: {
    fontSize: typography.fontSize.xs,
    color: "rgba(255,255,255,0.35)",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  scrollHintArrow: {
    fontSize: 18,
    color: "rgba(255,255,255,0.35)",
  },

  // ── VALUE PILLARS ─────────────────────────────────────────────────────────
  pillarsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.lg,
  },
  pillarCard: {
    flex: 1,
    minWidth: 200,
    backgroundColor: colors.backgroundWhite,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    gap: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    shadowColor: colors.primaryNavy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 3,
  },
  pillarCardHovered: {
    borderColor: colors.accentOrange,
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 6,
  },
  pillarIconBg: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.md,
    backgroundColor: "rgba(232,119,34,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  pillarIconBgHovered: {
    backgroundColor: colors.accentOrange,
  },
  pillarTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  pillarDesc: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: typography.fontSize.sm * 1.6,
  },

  // ── CANDIDATES ────────────────────────────────────────────────────────────
  candidatesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.lg,
  },
  candidateCell: {
    flex: 1,
    minWidth: 160,
    maxWidth: 220,
  },

  // ── ACHIEVEMENTS ──────────────────────────────────────────────────────────
  navyDeco1: {
    position: "absolute",
    top: -60,
    right: -60,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#FFFFFF",
    opacity: 0.03,
    pointerEvents: "none",
  },
  navyDeco2: {
    position: "absolute",
    bottom: -40,
    left: "40%",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.accentOrange,
    opacity: 0.05,
    pointerEvents: "none",
  },
  achievementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.lg,
  },
  achievementCell: {
    flex: 1,
    minWidth: 180,
  },

  // ── PREFERENCE MATCHING ───────────────────────────────────────────────────
  preferenceLayout: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing["2xl"],
    alignItems: "center",
  },
  preferenceLeft: {
    flex: 1,
    minWidth: 280,
    gap: spacing.md,
  },
  preferenceFeatures: {
    marginTop: spacing.md,
    gap: spacing.md,
  },
  preferenceFeatureItem: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "flex-start",
  },
  preferenceCheckBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accentOrange,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
    flexShrink: 0,
  },
  preferenceCheckText: {
    fontSize: 12,
    fontWeight: typography.fontWeight.bold,
    color: "#FFFFFF",
  },
  preferenceFeatureBody: { flex: 1, gap: 2 },
  preferenceFeatureTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textPrimary,
  },
  preferenceFeatureDesc: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: typography.fontSize.sm * 1.5,
  },
  // Decorative quiz card (right column)
  preferenceRight: {
    flex: 1,
    minWidth: 280,
    maxWidth: 420,
    alignSelf: "center",
  },
  preferenceCard: {
    backgroundColor: colors.backgroundWhite,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    shadowColor: colors.primaryNavy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 6,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: spacing.md,
  },
  preferenceCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  preferenceCardTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  preferenceCardSubtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  preferenceCardDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
  preferenceCardQuestion: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  preferenceCardOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    backgroundColor: colors.backgroundLight,
  },
  preferenceCardOptionSelected: {
    borderColor: colors.accentOrange,
    backgroundColor: "rgba(232,119,34,0.05)",
  },
  preferenceCardRadio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.borderColor,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  preferenceCardRadioSelected: {
    borderColor: colors.accentOrange,
  },
  preferenceCardRadioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accentOrange,
  },
  preferenceCardOptionText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  preferenceCardOptionTextSelected: {
    color: colors.primaryNavy,
    fontWeight: typography.fontWeight.semiBold,
  },
  preferenceCardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: spacing.sm,
  },
  preferenceCardAnonymous: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },

  // ── ELECTION PROCESS ──────────────────────────────────────────────────────
  timelineWrapper: {
    backgroundColor: colors.backgroundWhite,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    shadowColor: colors.primaryNavy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  // ── NEWS ──────────────────────────────────────────────────────────────────
  newsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.lg,
  },
  newsCell: {
    flex: 1,
    minWidth: 260,
  },

  // ── CTA BANNER ────────────────────────────────────────────────────────────
  ctaBanner: {
    backgroundColor: colors.backgroundWhite,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingVertical: spacing.xl,
  },
  ctaBannerInner: {
    maxWidth: layout.maxContentWidth,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: layout.containerPaddingH,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xl,
    flexWrap: "wrap",
    backgroundColor: colors.accentOrange + "14",
    borderRadius: borderRadius.xl,
    borderWidth: 1.5,
    borderColor: colors.accentOrange + "40",
    padding: spacing.xl,
  },
  ctaIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    backgroundColor: "rgba(232,119,34,0.12)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  ctaBannerText: { flex: 1, minWidth: 200, gap: 2 },
  ctaBannerTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primaryNavy,
  },
  ctaBannerSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
});
