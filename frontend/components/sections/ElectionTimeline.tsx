import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "@/constants/theme";
import type { ElectionStep } from "@/types";

interface ElectionTimelineProps {
  steps: ElectionStep[];
}

export default function ElectionTimeline({ steps }: ElectionTimelineProps) {
  const { t, i18n } = useTranslation();
  const isDE = i18n.language === "de";

  return (
    <View style={styles.container}>
      {steps.map((step, idx) => {
        const title = isDE && step.title_de ? step.title_de : step.title;
        const description = isDE && step.description_de ? step.description_de : step.description;
        const dateLabel = isDE && step.date_label_de ? step.date_label_de : step.date_label;

        return (
          <View key={step.id} style={styles.step}>
            <View style={styles.stepLeft}>
              <View
                style={[
                  styles.circle,
                  step.is_completed && styles.circleCompleted,
                  step.is_current && styles.circleCurrent,
                ]}
              >
                <Text
                  style={[
                    styles.circleText,
                    (step.is_completed || step.is_current) && styles.circleTextActive,
                  ]}
                >
                  {step.step_number}
                </Text>
              </View>
              {idx < steps.length - 1 && (
                <View style={[styles.connector, step.is_completed && styles.connectorCompleted]} />
              )}
            </View>

            <View style={styles.stepContent}>
              <Text
                style={[
                  styles.stepTitle,
                  step.is_current && styles.stepTitleCurrent,
                ]}
              >
                {title}
              </Text>
              {description ? (
                <Text style={styles.stepDescription}>{description}</Text>
              ) : null}
              {dateLabel ? (
                <Text style={styles.dateLabel}>{dateLabel}</Text>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: spacing.sm },
  step: {
    flexDirection: "row",
    marginBottom: 0,
  },
  stepLeft: {
    alignItems: "center",
    width: 40,
    marginRight: spacing.md,
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.backgroundSection,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.stepPending,
  },
  circleCompleted: {
    backgroundColor: colors.stepCompleted,
    borderColor: colors.stepCompleted,
  },
  circleCurrent: {
    backgroundColor: colors.stepCurrent,
    borderColor: colors.stepCurrent,
  },
  circleText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textMuted,
  },
  circleTextActive: {
    color: colors.textOnDark,
  },
  connector: {
    flex: 1,
    width: 2,
    backgroundColor: colors.stepPending,
    marginVertical: 4,
    minHeight: 24,
  },
  connectorCompleted: {
    backgroundColor: colors.stepCompleted,
  },
  stepContent: {
    flex: 1,
    paddingBottom: spacing.xl,
  },
  stepTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  stepTitleCurrent: {
    color: colors.accentOrange,
  },
  stepDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: typography.fontSize.sm * 1.5,
    marginBottom: 2,
  },
  dateLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
});
