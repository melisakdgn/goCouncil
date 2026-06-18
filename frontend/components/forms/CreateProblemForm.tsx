import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Button from "@/components/ui/Button";
import { borderRadius, colors, spacing, typography } from "@/constants/theme";
import type { ProblemCategory, ProblemPostCreate, ProblemUrgency } from "@/types";

const CATEGORIES: ProblemCategory[] = [
  "workplace_conditions",
  "salary_benefits",
  "management_communication",
  "working_hours",
  "health_safety",
  "discrimination_fairness",
  "infrastructure",
  "other",
];

const URGENCIES: ProblemUrgency[] = ["low", "medium", "high"];

const URGENCY_COLOR: Record<ProblemUrgency, string> = {
  low: colors.success,
  medium: colors.accentOrange,
  high: colors.error,
};

interface CreateProblemFormProps {
  onSubmit: (data: ProblemPostCreate) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
  error: string | null;
}

export default function CreateProblemForm({
  onSubmit,
  onCancel,
  loading,
  error,
}: CreateProblemFormProps) {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<ProblemCategory>("workplace_conditions");
  const [urgency, setUrgency] = useState<ProblemUrgency>("medium");
  const [validationError, setValidationError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!title.trim()) { setValidationError(t("problems.form.validationTitle")); return; }
    if (!content.trim()) { setValidationError(t("problems.form.validationContent")); return; }
    setValidationError(null);
    await onSubmit({ title: title.trim(), content: content.trim(), category, urgency });
  }

  const displayError = validationError ?? error;

  return (
    <View style={styles.container}>
      <Text style={styles.formTitle}>{t("problems.form.title")}</Text>

      {/* Title */}
      <View style={styles.field}>
        <Text style={styles.label}>{t("problems.form.titleLabel")}</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder={t("problems.form.titlePlaceholder")}
          placeholderTextColor={colors.textMuted}
          maxLength={300}
        />
      </View>

      {/* Category chips */}
      <View style={styles.field}>
        <Text style={styles.label}>{t("problems.form.categoryLabel")}</Text>
        <View style={styles.chips}>
          {CATEGORIES.map((cat) => {
            const active = cat === category;
            return (
              <Pressable
                key={cat}
                onPress={() => setCategory(cat)}
                style={StyleSheet.flatten([styles.chip, active && styles.chipActive])}
              >
                <Text style={StyleSheet.flatten([styles.chipText, active && styles.chipTextActive])}>
                  {t(`problems.categories.${cat}`)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Description */}
      <View style={styles.field}>
        <Text style={styles.label}>{t("problems.form.contentLabel")}</Text>
        <TextInput
          style={StyleSheet.flatten([styles.input, styles.textarea])}
          value={content}
          onChangeText={setContent}
          placeholder={t("problems.form.contentPlaceholder")}
          placeholderTextColor={colors.textMuted}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          maxLength={5000}
        />
      </View>

      {/* Urgency chips */}
      <View style={styles.field}>
        <Text style={styles.label}>{t("problems.form.urgencyLabel")}</Text>
        <View style={styles.urgencyRow}>
          {URGENCIES.map((u) => {
            const active = u === urgency;
            const color = URGENCY_COLOR[u];
            return (
              <Pressable
                key={u}
                onPress={() => setUrgency(u)}
                style={StyleSheet.flatten([
                  styles.urgencyChip,
                  { borderColor: color },
                  active && { backgroundColor: color },
                ])}
              >
                <View
                  style={StyleSheet.flatten([
                    styles.urgencyDot,
                    { backgroundColor: active ? "#FFFFFF" : color },
                  ])}
                />
                <Text
                  style={StyleSheet.flatten([
                    styles.urgencyText,
                    { color: active ? "#FFFFFF" : color },
                  ])}
                >
                  {t(`problems.urgency.${u}`)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Anonymous notice */}
      <View style={styles.anonNotice}>
        <Text style={styles.anonIcon}>🔒</Text>
        <Text style={styles.anonText}>
          Your name and identity will never be stored or shared.
        </Text>
      </View>

      {/* Error */}
      {displayError ? <Text style={styles.errorText}>{displayError}</Text> : null}

      {/* Actions */}
      <View style={styles.buttonRow}>
        <Pressable style={styles.cancelBtn} onPress={onCancel}>
          <Text style={styles.cancelBtnText}>{t("problems.cancelButton")}</Text>
        </Pressable>
        <Button
          label={loading ? t("problems.form.submitting") : t("problems.form.submit")}
          variant="primary"
          size="md"
          disabled={loading}
          onPress={handleSubmit}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundWhite,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1.5,
    borderColor: colors.accentOrange,
    marginBottom: spacing["2xl"],
    gap: spacing.lg,
    shadowColor: colors.primaryNavy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  formTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  field: { gap: 6 },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textSecondary,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    backgroundColor: colors.backgroundLight,
  },
  textarea: {
    minHeight: 110,
    paddingTop: spacing.md,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    backgroundColor: colors.backgroundLight,
  },
  chipActive: {
    borderColor: colors.primaryNavy,
    backgroundColor: colors.primaryNavy,
  },
  chipText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: "#FFFFFF",
  },
  urgencyRow: {
    flexDirection: "row",
    gap: spacing.md,
    flexWrap: "wrap",
  },
  urgencyChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1.5,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  urgencyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  urgencyText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
  },
  anonNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.backgroundSection,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  anonIcon: { fontSize: 14 },
  anonText: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    flex: 1,
  },
  errorText: {
    fontSize: typography.fontSize.sm,
    color: colors.error,
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  cancelBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  cancelBtnText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
});
