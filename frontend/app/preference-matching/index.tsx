import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import AppLayout from "@/components/layout/AppLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import SectionTitle from "@/components/ui/SectionTitle";
import { MOCK_PREFERENCE_QUESTIONS } from "@/constants/mockData";
import { ROUTES } from "@/constants/routes";
import { borderRadius, colors, spacing, typography } from "@/constants/theme";
import { submitPreferenceAnswers } from "@/services/preferenceService";
import { usePreferenceStore } from "@/store/preferenceStore";

export default function PreferenceMatchingPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const isDE = i18n.language === "de";

  const { questions, answers, currentStep, setAnswer, nextStep, prevStep, setResult, getAnswerPayload, reset } =
    usePreferenceStore();

  const allQuestions = questions.length > 0 ? questions : MOCK_PREFERENCE_QUESTIONS;
  const question = allQuestions[currentStep];
  const isLast = currentStep === allQuestions.length - 1;
  const selectedValue = question ? answers[question.id] : undefined;

  const mutation = useMutation({
    mutationFn: submitPreferenceAnswers,
    onSuccess: (result) => {
      setResult(result);
      router.push(ROUTES.preferenceResults(result.session_id));
    },
  });

  const handleNext = () => {
    if (isLast) {
      mutation.mutate({ answers: getAnswerPayload() });
    } else {
      nextStep();
    }
  };

  if (!question) return null;

  const questionText = isDE && question.text_de ? question.text_de : question.text;

  return (
    <AppLayout>
      <SectionTitle title={t("preference.title")} subtitle={t("preference.subtitle")} />

      <Text style={styles.stepIndicator}>
        {t("preference.step", { current: currentStep + 1, total: allQuestions.length })}
      </Text>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${((currentStep + 1) / allQuestions.length) * 100}%` },
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
                style={isSelected ? styles.selectedOption : undefined}
              />
            );
          })}
        </View>

        <Text style={styles.anonymous}>{t("preference.anonymous")}</Text>
      </Card>

      <View style={styles.actions}>
        {currentStep > 0 && (
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
  selectedOption: {},
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
