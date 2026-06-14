import { Link } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import AppLayout from "@/components/layout/AppLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import SectionTitle from "@/components/ui/SectionTitle";
import { MOCK_CANDIDATES } from "@/constants/mockData";
import {
  WAHL_O_MAT_QUESTIONS,
  computeMatchPercentage,
  type WahlOMatAnswer,
} from "@/constants/wahlOMatData";
import { borderRadius, colors, spacing, typography } from "@/constants/theme";
import { useCandidates } from "@/hooks/useCandidates";
import { useWahlOMatStore } from "@/store/wahlOMatStore";

const ANSWER_OPTIONS: WahlOMatAnswer[] = ["agree", "neutral", "disagree"];

const ANSWER_LABEL_KEYS: Record<WahlOMatAnswer, string> = {
  agree: "wahlOMat.agree",
  neutral: "wahlOMat.neutral",
  disagree: "wahlOMat.disagree",
};

export default function WahlOMatPage() {
  const { t, i18n } = useTranslation();
  const isDE = i18n.language === "de";

  const {
    answers,
    currentStep,
    showResults,
    setAnswer,
    nextStep,
    prevStep,
    reset,
  } = useWahlOMatStore();

  const questions = WAHL_O_MAT_QUESTIONS;
  const question = questions[currentStep];
  const isLast = currentStep === questions.length - 1;
  const selectedValue = question ? answers[question.id] : undefined;

  const { data } = useCandidates();

  const sortedCandidates = useMemo(() => {
    const list = data?.items?.length ? data.items : MOCK_CANDIDATES;
    return [...list].sort((a, b) => a.sort_order - b.sort_order);
  }, [data]);

  const topMatches = useMemo(() => {
    if (!showResults) return [];

    return sortedCandidates
      .map((candidate, index) => ({
        candidate,
        matchPercentage: computeMatchPercentage(answers, questions, index),
      }))
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .slice(0, 3);
  }, [answers, questions, showResults, sortedCandidates]);

  if (showResults) {
    return (
      <AppLayout>
        <SectionTitle
          title={t("wahlOMat.resultsTitle")}
          subtitle={t("wahlOMat.resultsSubtitle")}
        />

        <View style={styles.matchGrid}>
          {topMatches.map(({ candidate, matchPercentage }, idx) => {
            const name = candidate.name;
            const role = candidate.role;

            return (
              <Card key={candidate.id} style={styles.matchCard}>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankText}>#{idx + 1}</Text>
                </View>

                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarInitials}>
                    {name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)}
                  </Text>
                </View>

                <Text style={styles.candidateName}>{name}</Text>
                <Text style={styles.candidateRole}>{role}</Text>
                {candidate.team?.name ? (
                  <Text style={styles.teamName}>{candidate.team.name}</Text>
                ) : null}

                <View style={styles.matchBar}>
                  <View style={[styles.matchFill, { width: `${matchPercentage}%` }]} />
                </View>
                <Text style={styles.matchPercent}>
                  {t("wahlOMat.matchPercent", { percent: matchPercentage })}
                </Text>

                <Link
                  href={{ pathname: "/candidates/[id]", params: { id: candidate.id } }}
                  style={styles.viewLink}
                >
                  <Text style={styles.viewLinkText}>{t("wahlOMat.viewProfile")} →</Text>
                </Link>
              </Card>
            );
          })}
        </View>

        <Text style={styles.disclaimer}>{t("wahlOMat.sampleDisclaimer")}</Text>

        <Button
          label={t("wahlOMat.startOver")}
          variant="outline"
          size="md"
          style={styles.startOverButton}
          onPress={reset}
        />
      </AppLayout>
    );
  }

  if (!question) return null;

  const questionText = isDE ? question.text_de : question.text;

  return (
    <AppLayout>
      <SectionTitle title={t("wahlOMat.title")} subtitle={t("wahlOMat.subtitle")} />

      <Text style={styles.stepIndicator}>
        {t("wahlOMat.step", { current: currentStep + 1, total: questions.length })}
      </Text>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${((currentStep + 1) / questions.length) * 100}%` },
          ]}
        />
      </View>

      <Card style={styles.questionCard}>
        <Text style={styles.thesisLabel}>{t("wahlOMat.thesisLabel")}</Text>
        <Text style={styles.questionText}>{questionText}</Text>

        <View style={styles.answerRow}>
          {ANSWER_OPTIONS.map((option) => {
            const isSelected = selectedValue === option;
            return (
              <Pressable
                key={option}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => setAnswer(question.id, option)}
                style={({ pressed }) => [
                  styles.answerButton,
                  isSelected && styles.answerButtonSelected,
                  pressed && styles.answerButtonPressed,
                ]}
              >
                <Text
                  style={[
                    styles.answerLabel,
                    isSelected && styles.answerLabelSelected,
                  ]}
                >
                  {t(ANSWER_LABEL_KEYS[option])}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.anonymous}>{t("wahlOMat.anonymous")}</Text>
      </Card>

      <View style={styles.actions}>
        {currentStep > 0 && (
          <Button label={t("wahlOMat.back")} variant="ghost" size="md" onPress={prevStep} />
        )}
        <Button
          label={isLast ? t("wahlOMat.submit") : t("wahlOMat.next")}
          variant="secondary"
          size="md"
          disabled={!selectedValue}
          onPress={() => nextStep(questions.length)}
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
    gap: spacing.lg,
    padding: spacing["2xl"],
  },
  thesisLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.accentOrange,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  questionText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    lineHeight: typography.fontSize.xl * typography.lineHeight.relaxed,
  },
  answerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  answerButton: {
    flex: 1,
    minWidth: 120,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.borderColor,
    backgroundColor: colors.backgroundLight,
    alignItems: "center",
    justifyContent: "center",
  },
  answerButtonSelected: {
    borderColor: colors.primaryNavy,
    backgroundColor: colors.primaryNavy,
  },
  answerButtonPressed: {
    opacity: 0.85,
  },
  answerLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.primaryNavy,
    textAlign: "center",
  },
  answerLabelSelected: {
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
    gap: spacing.md,
    marginTop: spacing.xl,
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
  viewLink: {
    marginTop: spacing.sm,
  },
  viewLinkText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.accentOrange,
  },
  disclaimer: {
    marginTop: spacing.xl,
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: typography.fontSize.sm * typography.lineHeight.relaxed,
  },
  startOverButton: {
    alignSelf: "center",
    marginTop: spacing.lg,
  },
});
