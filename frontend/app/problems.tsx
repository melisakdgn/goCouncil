import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppLayout from "@/components/layout/AppLayout";
import SectionTitle from "@/components/ui/SectionTitle";
import ProblemCard from "@/components/cards/ProblemCard";
import CreateProblemForm from "@/components/forms/CreateProblemForm";
import {
  useAddCouncilResponse,
  useAddComment,
  useCreateProblem,
  useProblems,
} from "@/hooks/useProblems";
import { borderRadius, colors, spacing, typography } from "@/constants/theme";
import type { ProblemPostCreate } from "@/types";

export default function ProblemsPage() {
  const { t } = useTranslation();

  const { data, isLoading, isError, refetch } = useProblems();
  const createProblem = useCreateProblem();
  const addComment = useAddComment();
  const addCouncilResponse = useAddCouncilResponse();

  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({});
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());

  async function handleCreateProblem(formData: ProblemPostCreate) {
    setFormError(null);
    try {
      await createProblem.mutateAsync(formData);
      await refetch();
      setShowForm(false);
      setSubmitSuccess(true);
    } catch (err: any) {
      setFormError(err.message ?? t("problems.form.errorMessage"));
    }
  }

  function getProgress(problemId: string) {
    const digits = problemId.replace(/\D/g, "");
    const seed = Number(digits.slice(-2)) || 1;
    return Math.min(95, 20 + seed);
  }

  function handleVote(problemId: string, direction: "up" | "down") {
    if (votedIds.has(problemId)) return;

    const current =
      voteCounts[problemId] ??
      problems.find((p) => p.id === problemId)?.like_count ??
      0;

    setVotedIds((prev) => new Set([...prev, problemId]));

    setVoteCounts((prev) => ({
      ...prev,
      [problemId]: Math.max(0, current + (direction === "up" ? 1 : -1)),
    }));
  }

  async function handleAddComment(problemId: string, content: string) {
    await addComment.mutateAsync({ problemId, data: { content } });
  }

  async function handleAddCouncilResponse(problemId: string, response: string) {
    await addCouncilResponse.mutateAsync({ problemId, response });
  }

  function toggleForm() {
    setShowForm((v) => !v);
    setFormError(null);
  }

  const problems = data?.items ?? [];

  return (
    <AppLayout>
      <View style={styles.pageHeader}>
        <View style={styles.pageHeaderLeft}>
          <SectionTitle
            title={t("problems.title")}
            subtitle={t("problems.subtitle")}
          />
        </View>

        <Pressable
          style={StyleSheet.flatten([
            styles.reportBtn,
            showForm && styles.reportBtnOpen,
          ])}
          onPress={toggleForm}
        >
          <MaterialCommunityIcons
            name={showForm ? "close" : "plus"}
            size={17}
            color={showForm ? colors.error : "#FFFFFF"}
          />
          <Text
            style={StyleSheet.flatten([
              styles.reportBtnText,
              showForm && styles.reportBtnTextOpen,
            ])}
          >
            {showForm ? t("problems.cancelButton") : t("problems.reportButton")}
          </Text>
        </Pressable>
      </View>

      {submitSuccess && (
        <View style={styles.successBanner}>
          <MaterialCommunityIcons name="check-circle" size={18} color={colors.success} />
          <View style={styles.successText}>
            <Text style={styles.successTitle}>{t("problems.form.successTitle")}</Text>
            <Text style={styles.successSubtitle}>{t("problems.form.successSubtitle")}</Text>
          </View>
        </View>
      )}

      {showForm && (
        <CreateProblemForm
          onSubmit={handleCreateProblem}
          onCancel={toggleForm}
          loading={createProblem.isPending}
          error={formError}
        />
      )}

      {isLoading && (
        <View style={styles.centeredState}>
          <ActivityIndicator size="large" color={colors.primaryNavy} />
          <Text style={styles.stateText}>{t("common.loading")}</Text>
        </View>
      )}

      {isError && !isLoading && (
        <View style={styles.centeredState}>
          <MaterialCommunityIcons name="alert-circle-outline" size={44} color={colors.error} />
          <Text style={styles.errorStateText}>{t("problems.loadingError")}</Text>
          <Pressable style={styles.retryBtn} onPress={() => refetch()}>
            <Text style={styles.retryBtnText}>{t("common.retry")}</Text>
          </Pressable>
        </View>
      )}

      {!isLoading && !isError && problems.length === 0 && (
        <View style={styles.centeredState}>
          <MaterialCommunityIcons name="inbox-outline" size={52} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>{t("problems.emptyTitle")}</Text>
          <Text style={styles.emptySubtitle}>{t("problems.emptySubtitle")}</Text>
        </View>
      )}

      {!isLoading && !isError && problems.length > 0 && (
        <View style={styles.list}>
          {problems.map((problem) => {
            const currentVotes = voteCounts[problem.id] ?? problem.like_count;
            const progress = getProgress(problem.id);

            return (
              <View key={problem.id} style={styles.problemWrapper}>
                <ProblemCard
                  problem={{
                    ...problem,
                    like_count: currentVotes,
                  }}
                  isLiked={votedIds.has(problem.id)}
                  onLike={() => handleVote(problem.id, "up")}
                  onAddComment={(content) => handleAddComment(problem.id, content)}
                  onAddCouncilResponse={(response) =>
                    handleAddCouncilResponse(problem.id, response)
                  }
                />

                <View style={styles.extraPanel}>
                  <View style={styles.voteRow}>
                    <Pressable
                      style={[
                        styles.voteButton,
                        votedIds.has(problem.id) && styles.voteButtonDisabled,
                      ]}
                      onPress={() => handleVote(problem.id, "up")}
                    >
                      <Text style={styles.voteText}>▲ Upvote</Text>
                    </Pressable>

                    <Text style={styles.voteCount}>{currentVotes}</Text>

                    <Pressable
                      style={[
                        styles.voteButton,
                        votedIds.has(problem.id) && styles.voteButtonDisabled,
                      ]}
                      onPress={() => handleVote(problem.id, "down")}
                    >
                      <Text style={styles.voteText}>▼ Downvote</Text>
                    </Pressable>
                  </View>

                  <View style={styles.progressWrapper}>
                    <View style={styles.progressHeader}>
                      <Text style={styles.progressLabel}>Council work progress</Text>
                      <Text style={styles.progressPercent}>{progress}%</Text>
                    </View>

                    <View style={styles.progressTrack}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${progress}%` },
                        ]}
                      />
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  pageHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  pageHeaderLeft: { flex: 1, minWidth: 240 },
  reportBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.accentOrange,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignSelf: "flex-start",
    marginTop: spacing.xs,
    shadowColor: colors.accentOrange,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  reportBtnOpen: {
    backgroundColor: "rgba(229,62,62,0.07)",
    shadowColor: "transparent",
    shadowOpacity: 0,
    elevation: 0,
    borderWidth: 1.5,
    borderColor: colors.error,
  },
  reportBtnText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: "#FFFFFF",
  },
  reportBtnTextOpen: { color: colors.error },
  successBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    backgroundColor: "rgba(56,161,105,0.09)",
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: "rgba(56,161,105,0.28)",
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  successText: { flex: 1, gap: 2 },
  successTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.success,
  },
  successSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  centeredState: {
    alignItems: "center",
    paddingVertical: spacing["4xl"],
    gap: spacing.lg,
  },
  stateText: {
    fontSize: typography.fontSize.base,
    color: colors.textMuted,
  },
  errorStateText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: "center",
  },
  emptyTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textPrimary,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    textAlign: "center",
    maxWidth: 360,
    lineHeight: typography.fontSize.sm * 1.6,
  },
  retryBtn: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.primaryNavy,
  },
  retryBtnText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.primaryNavy,
  },
  list: {
    gap: spacing.lg,
  },
  problemWrapper: {
    gap: spacing.sm,
  },
  extraPanel: {
    backgroundColor: colors.backgroundWhite,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderColor,
    padding: spacing.md,
    marginTop: -spacing.sm,
  },
  voteRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  voteButton: {
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.backgroundLight,
  },
  voteButtonDisabled: {
    opacity: 0.45,
  },
  voteText: {
    fontSize: typography.fontSize.sm,
    color: colors.primaryNavy,
    fontWeight: typography.fontWeight.semiBold,
  },
  voteCount: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.accentOrange,
  },
  progressWrapper: {
    gap: spacing.xs,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  progressPercent: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.primaryNavy,
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.borderColor,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.accentOrange,
  },
});