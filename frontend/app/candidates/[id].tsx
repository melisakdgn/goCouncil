import { Link, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import AppLayout from "@/components/layout/AppLayout";
import Card from "@/components/ui/Card";
import SectionTitle from "@/components/ui/SectionTitle";
import { MOCK_CANDIDATES } from "@/constants/mockData";
import { ROUTES } from "@/constants/routes";
import { colors, spacing, typography } from "@/constants/theme";
import { useCandidate } from "@/hooks/useCandidates";

export default function CandidateDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const isDE = i18n.language === "de";
  const { data, isLoading, isError } = useCandidate(id ?? "");

  const mockCandidate = MOCK_CANDIDATES.find((c) => c.id === id);
  const candidate = data ?? (isError ? mockCandidate : undefined);

  if (isLoading && !candidate) {
    return (
      <AppLayout>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primaryNavy} />
        </View>
      </AppLayout>
    );
  }

  if (!candidate) {
    return (
      <AppLayout>
        <Text style={styles.notFound}>{t("candidateDetail.notFound")}</Text>
        <Link href={ROUTES.candidates}>
          <Text style={styles.backText}>← {t("candidateDetail.back")}</Text>
        </Link>
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
  centered: {
    alignItems: "center",
    paddingVertical: spacing["4xl"],
  },
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
    textAlign: "center",
  },
  role: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.xs,
  },
  badge: {
    marginTop: spacing.md,
    backgroundColor: colors.backgroundSection,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: typography.fontSize.sm,
    color: colors.primaryNavy,
    fontWeight: typography.fontWeight.medium,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: colors.borderColor,
    marginVertical: spacing.xl,
  },
  bio: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    lineHeight: typography.fontSize.base * typography.lineHeight.relaxed,
    textAlign: "center",
  },
  notFound: {
    textAlign: "center",
    color: colors.textMuted,
    fontSize: typography.fontSize.base,
    marginTop: spacing["3xl"],
    marginBottom: spacing.lg,
  },
});
