import { Link, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import AppLayout from "@/components/layout/AppLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import SectionTitle from "@/components/ui/SectionTitle";
import { MOCK_CANDIDATES } from "@/constants/mockData";
import { ROUTES } from "@/constants/routes";
import { colors, spacing, typography } from "@/constants/theme";

export default function CandidateDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const isDE = i18n.language === "de";

  const candidate = MOCK_CANDIDATES.find((c) => c.id === id);

  if (!candidate) {
    return (
      <AppLayout>
        <Text style={styles.notFound}>Candidate not found.</Text>
      </AppLayout>
    );
  }

  const bio = isDE && candidate.bio_de ? candidate.bio_de : candidate.bio;

  return (
    <AppLayout>
      <Link href={ROUTES.candidates} style={styles.backLink}>
        <Text style={styles.backText}>← {t("candidateDetail.back")}</Text>
      </Link>

      <Card style={styles.profileCard}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarInitials}>
            {candidate.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </Text>
        </View>

        <Text style={styles.name}>{candidate.name}</Text>
        <Text style={styles.role}>{candidate.role}</Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {candidate.is_independent
              ? t("candidateDetail.independent")
              : `${t("candidateDetail.team")}: ${candidate.team?.name}`}
          </Text>
        </View>

        <View style={styles.divider} />

        <SectionTitle title={t("candidateDetail.about")} />
        <Text style={styles.bio}>{bio ?? "—"}</Text>
      </Card>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  backLink: { textDecorationLine: "none", marginBottom: spacing.xl },
  backText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.accentOrange,
  },
  profileCard: {
    alignItems: "center",
    padding: spacing["2xl"],
    maxWidth: 560,
    alignSelf: "center",
    width: "100%",
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.backgroundSection,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  avatarInitials: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.primaryNavy,
  },
  name: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  role: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  badge: {
    backgroundColor: colors.backgroundSection,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: spacing.xl,
  },
  badgeText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.primaryNavy,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderColor,
    width: "100%",
    marginBottom: spacing.xl,
  },
  bio: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    lineHeight: typography.fontSize.base * 1.7,
    textAlign: "center",
  },
  notFound: {
    textAlign: "center",
    color: colors.textMuted,
    marginTop: spacing["3xl"],
  },
});
