import { useQuery } from "@tanstack/react-query";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import AppLayout from "@/components/layout/AppLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import SectionTitle from "@/components/ui/SectionTitle";
import { ROUTES } from "@/constants/routes";
import { borderRadius, colors, spacing, typography } from "@/constants/theme";
import { fetchMatchResult } from "@/services/preferenceService";
import { usePreferenceStore } from "@/store/preferenceStore";

export default function PreferenceResultsPage() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const { t } = useTranslation();
  const router = useRouter();
  const { result, setResult, reset } = usePreferenceStore();

  const { data: apiResult, isLoading, isError } = useQuery({
    queryKey: ["preference", "results", sessionId],
    queryFn: () => fetchMatchResult(sessionId!),
    enabled: Boolean(sessionId) && !result,
    retry: 1,
  });

  useEffect(() => {
    if (apiResult) {
      setResult(apiResult);
    }
  }, [apiResult, setResult]);

  const displayResult = result ?? apiResult;

  if (isLoading && !displayResult) {
    return (
      <AppLayout>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primaryNavy} />
          <Text style={styles.loadingText}>{t("preference.loading")}</Text>
        </View>
      </AppLayout>
    );
  }

  if (!displayResult) {
    return (
      <AppLayout>
        <Text style={styles.empty}>
          {isError ? t("common.error") : t("preference.resultsEmpty")}
        </Text>
        <Link href={ROUTES.preferenceMatching}>
          <Text style={styles.link}>← {t("preference.startOver")}</Text>
        </Link>
      </AppLayout>
    );
  }

  const handleStartOver = () => {
    reset();
    router.push(ROUTES.preferenceMatching);
  };

  return (
    <AppLayout>
      <SectionTitle title={t("preference.resultsTitle")} subtitle={t("preference.resultsSubtitle")} />

      <View style={styles.matchGrid}>
        {displayResult.top_matches.map((match, idx) => (
          <Card key={match.candidate_id} style={styles.matchCard}>
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>#{idx + 1}</Text>
            </View>

            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitials}>
                {match.candidate_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </Text>
            </View>

            <Text style={styles.candidateName}>{match.candidate_name}</Text>
            <Text style={styles.candidateRole}>{match.candidate_role}</Text>
            {match.team_name ? (
              <Text style={styles.teamName}>{match.team_name}</Text>
            ) : null}

            <View style={styles.matchBar}>
              <View style={[styles.matchFill, { width: `${match.match_percentage}%` }]} />
            </View>
            <Text style={styles.matchPercent}>
              {t("preference.matchPercent", { percent: match.match_percentage })}
            </Text>

            {match.matching_topics.length > 0 && (
              <View style={styles.topics}>
                <Text style={styles.topicsLabel}>{t("preference.matchingTopics")}:</Text>
                {match.matching_topics.map((topic) => (
                  <View key={topic} style={styles.topicChip}>
                    <Text style={styles.topicText}>{topic}</Text>
                  </View>
                ))}
              </View>
            )}

            <Link
              href={{ pathname: "/candidates/[id]", params: { id: match.candidate_id } }}
              style={styles.viewLink}
            >
              <Text style={styles.viewLinkText}>{t("preference.viewProfile")} →</Text>
            </Link>
          </Card>
        ))}
      </View>

      <Button
        label={t("preference.startOver")}
        variant="outline"
        size="md"
        style={styles.startOverButton}
        onPress={handleStartOver}
      />
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  centered: {
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    paddingVertical: spacing["4xl"],
  },
  loadingText: {
    fontSize: typography.fontSize.base,
    color: colors.textMuted,
  },
  empty: {
    textAlign: "center",
    color: colors.textMuted,
    marginTop: spacing["3xl"],
    marginBottom: spacing.lg,
  },
  link: {
    textAlign: "center",
    color: colors.accentOrange,
    fontWeight: typography.fontWeight.semiBold,
  },
  matchGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xl,
    justifyContent: "center",
  },
  matchCard: {
    flex: 1,
    minWidth: 240,
    maxWidth: 340,
    alignItems: "center",
    padding: spacing["2xl"],
    gap: spacing.sm,
    position: "relative",
  },
  rankBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accentOrange,
    alignItems: "center",
    justifyContent: "center",
  },
  rankText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textOnDark,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.backgroundSection,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  avatarInitials: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primaryNavy,
  },
  candidateName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    textAlign: "center",
  },
  candidateRole: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: "center",
  },
  teamName: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    textAlign: "center",
  },
  matchBar: {
    height: 8,
    width: "100%",
    backgroundColor: colors.borderColor,
    borderRadius: borderRadius.full,
    overflow: "hidden",
    marginTop: spacing.md,
  },
  matchFill: {
    height: "100%",
    backgroundColor: colors.accentOrange,
    borderRadius: borderRadius.full,
  },
  matchPercent: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.accentOrange,
  },
  topics: {
    alignItems: "center",
    gap: spacing.xs,
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.sm,
  },
  topicsLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    width: "100%",
    textAlign: "center",
  },
  topicChip: {
    backgroundColor: colors.backgroundSection,
    borderRadius: borderRadius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  topicText: {
    fontSize: typography.fontSize.xs,
    color: colors.primaryNavy,
    fontWeight: typography.fontWeight.medium,
  },
  viewLink: { marginTop: spacing.sm, textDecorationLine: "none" },
  viewLinkText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.accentOrange,
  },
  startOverButton: {
    alignSelf: "center",
    marginTop: spacing["2xl"],
  },
});
