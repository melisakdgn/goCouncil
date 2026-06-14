import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import AppLayout from "@/components/layout/AppLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import SectionTitle from "@/components/ui/SectionTitle";
import { MOCK_PREFERENCE_QUESTIONS } from "@/constants/mockData";
import { ROUTES } from "@/constants/routes";
import { borderRadius, colors, spacing, typography } from "@/constants/theme";
import { usePreferenceQuestions } from "@/hooks/usePreferenceQuestions";
import { submitPreferenceAnswers } from "@/services/preferenceService";
import { usePreferenceStore } from "@/store/preferenceStore";

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
  });

  const handleNext = () => {
    if (isLast) {
      mutation.mutate({ answers: getAnswerPayload() });
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
          onPress={() => router.push(ROUTES.preferenceMatching)}
        />
      </AppLayout>
    );
  }

  const questionText = isDE && question.text_de ? question.text_de : question.text;

  return (
    <AppLayout>
      <SectionTitle title={t("preference.title")} subtitle={t("preference.subtitle")} />

      <Text style={styles.stepIndicator}>
        {t("preference.step", { current: safeStep + 1, total: allQuestions.length })}
      </Text>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${((safeStep + 1) / allQuestions.length) * 100}%` },
          ]}
        />
      </View>

      <Card style={styles.questionCard}>
        <Text style={styles.questionText}>{questionText}</Text>

        <View style={styles.options}>
          {question.options.map((opt) => {
            const optText = isDE && opt.text_de ? opt.text_de : opt.text;
            const isSelected = selectedValue === opt.value;
            return (
              <Button
                key={opt.id}
                label={optText}
                variant={isSelected ? "primary" : "outline"}
                size="md"
                fullWidth
                onPress={() => setAnswer(question.id, opt.value)}
              />
            );
          })}
        </View>

        <Text style={styles.anonymous}>{t("preference.anonymous")}</Text>
      </Card>

      {mutation.isError ? (
        <Text style={styles.errorText}>{mutation.error.message}</Text>
      ) : null}

      <View style={styles.actions}>
        {safeStep > 0 && (
          <Button label={t("preference.back")} variant="ghost" size="md" onPress={prevStep} />
        )}
        <Button
          label={isLast ? t("preference.submit") : t("preference.next")}
          variant="secondary"
          size="md"
          disabled={!selectedValue}
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
  stepIndicator: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  progressTrack: {
    height: 6,
    backgroundColor: colors.borderColor,
    borderRadius: borderRadius.full,
    marginBottom: spacing.xl,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.accentOrange,
    borderRadius: borderRadius.full,
  },
  questionCard: {
    gap: spacing.xl,
    padding: spacing["2xl"],
  },
  questionText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  options: { gap: spacing.md },
  anonymous: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: spacing.md,
    marginTop: spacing.xl,
  },
});
