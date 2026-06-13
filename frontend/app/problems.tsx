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
  useLikeProblem,
  useProblems,
} from "@/hooks/useProblems";
import { borderRadius, colors, spacing, typography } from "@/constants/theme";
import type { ProblemPostCreate } from "@/types";

export default function ProblemsPage() {
  const { t } = useTranslation();

  // ── Data & mutations ──────────────────────────────────────────────────────
  const { data, isLoading, isError, refetch } = useProblems();
  const createProblem = useCreateProblem();
  const likeProblem = useLikeProblem();
  const addComment = useAddComment();
  const addCouncilResponse = useAddCouncilResponse();

  // ── UI state ──────────────────────────────────────────────────────────────
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  // ── Handlers ──────────────────────────────────────────────────────────────

  async function handleCreateProblem(formData: ProblemPostCreate) {
    setFormError(null);
    try {
      await createProblem.mutateAsync(formData);
      setShowForm(false);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err: any) {
      setFormError(err.message ?? t("problems.form.errorMessage"));
    }
  }

  function handleLike(problemId: string) {
    if (likedIds.has(problemId)) return;
    setLikedIds((prev) => new Set([...prev, problemId]));
    likeProblem.mutate(problemId);
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

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <AppLayout>

      {/* Page header */}
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

      {/* Success banner */}
      {submitSuccess && (
        <View style={styles.successBanner}>
          <MaterialCommunityIcons name="check-circle" size={18} color={colors.success} />
          <View style={styles.successText}>
            <Text style={styles.successTitle}>{t("problems.form.successTitle")}</Text>
            <Text style={styles.successSubtitle}>{t("problems.form.successSubtitle")}</Text>
          </View>
        </View>
      )}

      {/* Create problem form */}
      {showForm && (
        <CreateProblemForm
          onSubmit={handleCreateProblem}
          onCancel={toggleForm}
          loading={createProblem.isPending}
          error={formError}
        />
      )}

      {/* Loading state */}
      {isLoading && (
        <View style={styles.centeredState}>
          <ActivityIndicator size="large" color={colors.primaryNavy} />
          <Text style={styles.stateText}>{t("common.loading")}</Text>
        </View>
      )}

      {/* Error state */}
      {isError && !isLoading && (
        <View style={styles.centeredState}>
          <MaterialCommunityIcons name="alert-circle-outline" size={44} color={colors.error} />
          <Text style={styles.errorStateText}>{t("problems.loadingError")}</Text>
          <Pressable style={styles.retryBtn} onPress={() => refetch()}>
            <Text style={styles.retryBtnText}>{t("common.retry")}</Text>
          </Pressable>
        </View>
      )}

      {/* Empty state */}
      {!isLoading && !isError && problems.length === 0 && (
        <View style={styles.centeredState}>
          <MaterialCommunityIcons name="inbox-outline" size={52} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>{t("problems.emptyTitle")}</Text>
          <Text style={styles.emptySubtitle}>{t("problems.emptySubtitle")}</Text>
        </View>
      )}

      {/* Problem cards */}
      {!isLoading && !isError && problems.length > 0 && (
        <View style={styles.list}>
          {problems.map((problem) => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              isLiked={likedIds.has(problem.id)}
              onLike={() => handleLike(problem.id)}
              onAddComment={(content) => handleAddComment(problem.id, content)}
              onAddCouncilResponse={(response) =>
                handleAddCouncilResponse(problem.id, response)
              }
            />
          ))}
        </View>
      )}

    </AppLayout>
  );
}

const styles = StyleSheet.create({
  // Page header
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

  // Success banner
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

  // Shared state containers
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

  // Problem list
  list: {
    gap: spacing.lg,
  },
});
