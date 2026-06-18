import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import AppLayout from "@/components/layout/AppLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import SectionTitle from "@/components/ui/SectionTitle";
import { MOCK_PREFERENCE_QUESTIONS, computeLocalMatchResult } from "@/constants/mockData";
import { ROUTES } from "@/constants/routes";
import { borderRadius, colors, spacing, typography } from "@/constants/theme";
import { usePreferenceQuestions } from "@/hooks/usePreferenceQuestions";
import { submitPreferenceAnswers } from "@/services/preferenceService";
import { usePreferenceStore } from "@/store/preferenceStore";
import type { PreferenceQuestion } from "@/types";

// After which step indices (0-based) to show an insight card
const INSIGHT_STEPS = new Set([4, 8, 11]);

const SCORE_MAP: Record<string, number> = {
  strongly_agree: 2, agree: 1, neutral: 0, disagree: -1, strongly_disagree: -2,
};

function getInsightKey(
  answers: Record<string, string>,
  questions: PreferenceQuestion[],
  upToStep: number,
): string {
  const scores: Record<string, number> = {};
  for (let i = 0; i < upToStep; i++) {
    const q = questions[i];
    if (!q?.category) continue;
    const ans = answers[q.id];
    if (!ans || ans === "skip") continue;
    scores[q.category] = (scores[q.category] ?? 0) + (SCORE_MAP[ans] ?? 0);
  }

  const top = Object.entries(scores)
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([k]) => k);

  if (top.includes("flexible_hours") || top.includes("remote_work") || top.includes("work_life_balance")) {
    return "preference.insightFlexibility";
  }
  if (top.includes("mental_health") || top.includes("young_employees")) {
    return "preference.insightWellbeing";
  }
  if (top.includes("salary_transparency") || top.includes("fair_treatment")) {
    return "preference.insightTransparency";
  }
  if (top.includes("digitalization") || top.includes("training")) {
    return "preference.insightGrowth";
  }
  if (top.includes("diversity_inclusion") || top.includes("workplace_safety")) {
    return "preference.insightCare";
  }
  return "preference.insightDefault";
}

export default function PreferenceMatchingPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const isDE = i18n.language === "de";

  const { data, isLoading, isError } = usePreferenceQuestions();
  const { answers, currentStep, setAnswer, nextStep, prevStep, clampStep, setResult, getAnswerPayload, reset } =
    usePreferenceStore();

  const allQuestions = useMemo(() => {
    if (data && data.length > 0) return data;
    if (isError) return MOCK_PREFERENCE_QUESTIONS;
    return [];
  }, [data, isError]);

  const safeStep = allQuestions.length > 0 ? Math.min(currentStep, allQuestions.length - 1) : 0;
  const question = allQuestions[safeStep];
  const isLast = safeStep === allQuestions.length - 1;
  const selectedValue = question ? answers[question.id] : undefined;
  const isAnswered = Boolean(selectedValue) && selectedValue !== "skip";

  const showInsight = INSIGHT_STEPS.has(safeStep) && safeStep > 0;
  const insightKey = showInsight ? getInsightKey(answers, allQuestions, safeStep) : null;

  useEffect(() => {
    if (allQuestions.length > 0) {
      clampStep(allQuestions.length);
    }
  }, [allQuestions.length, clampStep]);

  const mutation = useMutation({
    mutationFn: submitPreferenceAnswers,
    onSuccess: (result) => {
      setResult(result);
      router.push({
        pathname: "/preference-matching/results/[sessionId]",
        params: { sessionId: result.session_id },
      });
    },
    onError: () => {
      const localResult = computeLocalMatchResult(answers, allQuestions);
      setResult(localResult);
      router.push({
        pathname: "/preference-matching/results/[sessionId]",
        params: { sessionId: localResult.session_id },
      });
    },
  });

  const goToResults = () => {
    mutation.mutate({ answers: getAnswerPayload() });
  };

  const handleNext = () => {
    if (isLast) {
      goToResults();
    } else {
      nextStep();
    }
  };

  const handleSkip = () => {
    setAnswer(question!.id, "skip");
    if (isLast) {
      goToResults();
    } else {
      nextStep();
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primaryNavy} />
          <Text style={styles.loadingText}>{t("preference.loading")}</Text>
        </View>
      </AppLayout>
    );
  }

  if (!question) {
    return (
      <AppLayout>
        <Text style={styles.errorText}>{t("common.error")}</Text>
        <Button
          label={t("preference.startOver")}
          variant="outline"
          size="md"
          style={styles.retryButton}
          onPress={() => { reset(); router.push(ROUTES.preferenceMatching); }}
        />
      </AppLayout>
    );
  }

  const questionText = isDE && question.text_de ? question.text_de : question.text;

  return (
    <AppLayout>
      <SectionTitle title={t("preference.title")} subtitle={t("preference.subtitle")} />

      {insightKey && (
        <View style={styles.insightCard}>
          <Text style={styles.insightIcon}>💡</Text>
          <Text style={styles.insightText}>{t(insightKey)}</Text>
        </View>
      )}

      <View style={styles.progressHeader}>
        <Text style={styles.stepIndicator}>
          {t("preference.step", { current: safeStep + 1, total: allQuestions.length })}
        </Text>
      </View>

      <View style={styles.dotProgress}>
        {allQuestions.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i <= safeStep ? styles.dotFilled : styles.dotEmpty]}
          />
        ))}
      </View>

      <Card style={styles.questionCard}>
        <Text style={styles.questionText}>{questionText}</Text>

        <View style={styles.options}>
          {question.options.map((opt) => {
            const optText = isDE && opt.text_de ? opt.text_de : opt.text;
            const isSelected = selectedValue === opt.value;
            return (
              <Pressable
                key={opt.id}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => setAnswer(question.id, opt.value)}
                style={({ pressed }) => [
                  styles.optionButton,
                  isSelected && styles.optionButtonSelected,
                  pressed && styles.optionButtonPressed,
                ]}
              >
                <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                  {optText}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.anonymous}>{t("preference.anonymous")}</Text>
      </Card>

      <View style={styles.actions}>
        {safeStep > 0 && (
          <Button label={t("preference.back")} variant="ghost" size="md" onPress={prevStep} />
        )}
        <Button
          label={t("preference.skip")}
          variant="ghost"
          size="md"
          onPress={handleSkip}
          disabled={mutation.isPending}
        />
        <Button
          label={isLast ? t("preference.submit") : t("preference.next")}
          variant="secondary"
          size="md"
          disabled={!isAnswered}
          loading={mutation.isPending}
          onPress={handleNext}
        />
      </View>
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
  errorText: {
    fontSize: typography.fontSize.sm,
    color: colors.error,
    textAlign: "center",
    marginTop: spacing.md,
  },
  retryButton: {
    alignSelf: "center",
    marginTop: spacing.lg,
  },
  insightCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.backgroundSection,
    borderLeftWidth: 4,
    borderLeftColor: colors.accentOrange,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  insightIcon: {
    fontSize: 18,
  },
  insightText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.fontSize.sm * 1.5,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  stepIndicator: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    fontWeight: typography.fontWeight.medium,
  },
  dotProgress: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: spacing.xl,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotFilled: {
    backgroundColor: colors.accentOrange,
  },
  dotEmpty: {
    backgroundColor: colors.borderColor,
  },
  questionCard: {
    gap: spacing.xl,
    padding: spacing["2xl"],
  },
  questionText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    lineHeight: typography.fontSize.xl * 1.4,
  },
  options: { gap: spacing.sm },
  optionButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.borderColor,
    backgroundColor: colors.backgroundLight,
  },
  optionButtonSelected: {
    borderColor: colors.primaryNavy,
    backgroundColor: colors.primaryNavy,
  },
  optionButtonPressed: {
    opacity: 0.8,
  },
  optionLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
  },
  optionLabelSelected: {
    color: colors.textOnDark,
  },
  anonymous: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: spacing.md,
    marginTop: spacing.xl,
  },
});
