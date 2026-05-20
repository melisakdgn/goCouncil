import { Link } from "expo-router";
import { useTranslation } from "react-i18next";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import AppLayout from "@/components/layout/AppLayout";
import CandidateCard from "@/components/cards/CandidateCard";
import AchievementCard from "@/components/cards/AchievementCard";
import NewsUpdateCard from "@/components/cards/NewsUpdateCard";
import ElectionTimeline from "@/components/sections/ElectionTimeline";
import Button from "@/components/ui/Button";
import SectionTitle from "@/components/ui/SectionTitle";
import { MOCK_ACHIEVEMENTS, MOCK_CANDIDATES, MOCK_ELECTION, MOCK_NEWS } from "@/constants/mockData";
import { ROUTES } from "@/constants/routes";
import { borderRadius, colors, spacing, typography } from "@/constants/theme";

const PILLARS = [
  { iconKey: "fairRep", descKey: "fairRepDesc" },
  { iconKey: "strongTogether", descKey: "strongTogetherDesc" },
  { iconKey: "yourRights", descKey: "yourRightsDesc" },
  { iconKey: "achievements", descKey: "achievementsDesc" },
] as const;

export default function HomePage() {
  const { t } = useTranslation();
  const previewCandidates = MOCK_CANDIDATES.slice(0, 6);

  return (
    <AppLayout>
      <View style={styles.page}>
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <View style={styles.hero}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle1}>{t("home.heroTitle1")}</Text>
            <Text style={styles.heroTitle2}>{t("home.heroTitle2")}</Text>
            <Text style={styles.heroSubtitle}>{t("home.heroSubtitle")}</Text>
            <Button
              label={t("home.heroCTA")}
              variant="primary"
              size="lg"
              onPress={() => {}}
              style={{ alignSelf: "flex-start", marginTop: spacing.lg }}
            />
          </View>
        </View>

        {/* ── Value pillars ─────────────────────────────────────────────── */}
        <View style={styles.pillarsRow}>
          {PILLARS.map(({ iconKey, descKey }) => (
            <View key={iconKey} style={styles.pillar}>
              <Text style={styles.pillarIcon}>○</Text>
              <Text style={styles.pillarTitle}>{t(`home.pillars.${iconKey}`)}</Text>
              <Text style={styles.pillarDesc}>{t(`home.pillars.${descKey}`)}</Text>
            </View>
          ))}
        </View>

        {/* ── Two-column: Candidates + Sidebar ──────────────────────────── */}
        <View style={styles.mainGrid}>
          {/* Candidates column */}
          <View style={styles.candidatesCol}>
            <View style={styles.sectionHeader}>
              <SectionTitle
                title={t("home.candidatesTitle")}
                subtitle={t("home.candidatesSubtitle")}
              />
              <Link href={ROUTES.candidates} style={styles.viewAllLink}>
                <Text style={styles.viewAllText}>{t("home.viewAll")}</Text>
              </Link>
            </View>

            <View style={styles.candidateGrid}>
              {previewCandidates.map((c) => (
                <View key={c.id} style={styles.candidateCell}>
                  <CandidateCard candidate={c} />
                </View>
              ))}
            </View>

            <Button
              label={t("home.showMore")}
              variant="primary"
              size="md"
              onPress={() => {}}
              style={{ alignSelf: "center", marginTop: spacing.lg }}
            />

            {/* Election Process preview */}
            <View style={{ marginTop: spacing["3xl"] }}>
              <View style={styles.sectionHeader}>
                <SectionTitle
                  title={t("home.electionProcessTitle")}
                  subtitle={t("home.electionProcessSubtitle")}
                />
                <Link href={ROUTES.electionProcess} style={styles.viewAllLink}>
                  <Text style={styles.viewAllText}>{t("home.viewAll")}</Text>
                </Link>
              </View>
              <ElectionTimeline steps={MOCK_ELECTION.steps} />
            </View>
          </View>

          {/* Sidebar: Achievements + Preference Matching */}
          <View style={styles.sidebar}>
            <View style={styles.sectionHeader}>
              <SectionTitle title={t("home.achievementsTitle")} />
              <Link href={ROUTES.achievements} style={styles.viewAllLink}>
                <Text style={styles.viewAllText}>{t("home.viewAll")} ›</Text>
              </Link>
            </View>
            <View style={styles.achievementsGrid}>
              {MOCK_ACHIEVEMENTS.map((a) => (
                <View key={a.id} style={styles.achievementCell}>
                  <AchievementCard achievement={a} />
                </View>
              ))}
            </View>

            {/* Preference Matching CTA */}
            <View style={styles.preferenceCard}>
              <SectionTitle title={t("home.preferenceTitle")} subtitle={t("home.preferenceSubtitle")} />
              <Button
                label={t("home.preferenceCTA")}
                variant="secondary"
                size="md"
                onPress={() => {}}
                style={{ alignSelf: "flex-start" }}
              />
              <View style={{ marginTop: spacing.xl, gap: spacing.md }}>
                {(["preferenceFeature1", "preferenceFeature2", "preferenceFeature3"] as const).map((key) => (
                  <View key={key} style={styles.preferenceFeature}>
                    <Text style={styles.preferenceFeatureTitle}>{t(`home.${key}Title`)}</Text>
                    <Text style={styles.preferenceFeatureDesc}>{t(`home.${key}Desc`)}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* ── News & Updates ────────────────────────────────────────────── */}
        <View style={{ marginTop: spacing["3xl"] }}>
          <View style={styles.sectionHeader}>
            <SectionTitle title={t("home.newsTitle")} />
            <Text style={styles.viewAllText}>{t("home.viewAll")} →</Text>
          </View>
          {MOCK_NEWS.map((n) => (
            <NewsUpdateCard key={n.id} item={n} />
          ))}
        </View>

        {/* ── CTA Banner ────────────────────────────────────────────────── */}
        <View style={styles.ctaBanner}>
          <Text style={styles.ctaIcon}>☑</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.ctaTitle}>{t("home.participationTitle")}</Text>
            <Text style={styles.ctaSubtitle}>{t("home.participationSubtitle")}</Text>
          </View>
          <Button label={t("home.participationCTA")} variant="secondary" size="md" onPress={() => {}} />
        </View>
      </View>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  page: { gap: spacing["3xl"] },

  hero: {
    backgroundColor: colors.backgroundWhite,
    borderRadius: borderRadius.xl,
    padding: spacing["2xl"],
    overflow: "hidden",
  },
  heroContent: { maxWidth: 460 },
  heroTitle1: {
    fontSize: typography.fontSize["3xl"],
    fontWeight: typography.fontWeight.extraBold,
    color: colors.primaryNavy,
  },
  heroTitle2: {
    fontSize: typography.fontSize["3xl"],
    fontWeight: typography.fontWeight.extraBold,
    color: colors.accentOrange,
    marginBottom: spacing.md,
  },
  heroSubtitle: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    lineHeight: typography.fontSize.base * 1.6,
  },

  pillarsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.lg,
  },
  pillar: {
    flex: 1,
    minWidth: 160,
    backgroundColor: colors.backgroundWhite,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: "center",
    gap: spacing.sm,
    shadowColor: colors.primaryNavy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  pillarIcon: { fontSize: 28, color: colors.primaryNavy },
  pillarTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.primaryNavy,
    textAlign: "center",
  },
  pillarDesc: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    textAlign: "center",
  },

  mainGrid: {
    flexDirection: "row",
    gap: spacing["2xl"],
    flexWrap: "wrap",
  },
  candidatesCol: { flex: 2, minWidth: 320 },
  sidebar: { flex: 1, minWidth: 260, gap: spacing.xl },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  viewAllLink: { textDecorationLine: "none", marginTop: 4 },
  viewAllText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.accentOrange,
  },

  candidateGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  candidateCell: { flex: 1, minWidth: 150, maxWidth: 200 },

  achievementsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: colors.backgroundWhite,
    borderRadius: borderRadius.lg,
    shadowColor: colors.primaryNavy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  achievementCell: { width: "50%" },

  preferenceCard: {
    backgroundColor: colors.backgroundWhite,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    shadowColor: colors.primaryNavy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    gap: spacing.lg,
  },
  preferenceFeature: { gap: 2 },
  preferenceFeatureTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  preferenceFeatureDesc: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },

  ctaBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    backgroundColor: colors.backgroundWhite,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    borderWidth: 1.5,
    borderColor: colors.accentOrange,
  },
  ctaIcon: { fontSize: 32, color: colors.accentOrange },
  ctaTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primaryNavy,
    marginBottom: 2,
  },
  ctaSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
});
