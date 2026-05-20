import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from "react-native";
import { borderRadius, colors, spacing, typography } from "@/constants/theme";
import { submitContactMessage } from "@/services/contactService";
import Button from "@/components/ui/Button";

export default function ContactForm() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const mutation = useMutation({
    mutationFn: submitContactMessage,
    onSuccess: () => setSubmitted(true),
  });

  if (submitted) {
    return (
      <View style={styles.success}>
        <Text style={styles.successTitle}>{t("contact.successTitle")}</Text>
        <Text style={styles.successSubtitle}>{t("contact.successSubtitle")}</Text>
      </View>
    );
  }

  return (
    <View style={styles.form}>
      <View style={styles.field}>
        <Text style={styles.label}>{t("contact.nameLabel")}</Text>
        <TextInput
          style={styles.input}
          value={form.name}
          onChangeText={(v) => setForm((f) => ({ ...f, name: v }))}
          placeholder={t("contact.nameLabel")}
          placeholderTextColor={colors.textMuted}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>{t("contact.emailLabel")}</Text>
        <TextInput
          style={styles.input}
          value={form.email}
          onChangeText={(v) => setForm((f) => ({ ...f, email: v }))}
          placeholder="email@example.com"
          placeholderTextColor={colors.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>{t("contact.subjectLabel")}</Text>
        <TextInput
          style={styles.input}
          value={form.subject}
          onChangeText={(v) => setForm((f) => ({ ...f, subject: v }))}
          placeholder={t("contact.subjectLabel")}
          placeholderTextColor={colors.textMuted}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>{t("contact.messageLabel")}</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          value={form.message}
          onChangeText={(v) => setForm((f) => ({ ...f, message: v }))}
          placeholder={t("contact.messageLabel")}
          placeholderTextColor={colors.textMuted}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />
      </View>

      {mutation.isError && (
        <Text style={styles.error}>{t("contact.errorMessage")}</Text>
      )}

      <Button
        label={t("contact.submit")}
        variant="secondary"
        size="lg"
        fullWidth
        loading={mutation.isPending}
        disabled={!form.name || !form.email || !form.message}
        onPress={() => mutation.mutate(form)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.lg },
  field: { gap: spacing.xs },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textPrimary,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    backgroundColor: colors.backgroundWhite,
  },
  textarea: { minHeight: 120 },
  error: {
    color: colors.error,
    fontSize: typography.fontSize.sm,
  },
  success: {
    alignItems: "center",
    padding: spacing["2xl"],
    gap: spacing.md,
  },
  successTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primaryNavy,
  },
  successSubtitle: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
