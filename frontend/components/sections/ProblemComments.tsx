import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { borderRadius, colors, spacing, typography } from "@/constants/theme";
import type { ProblemComment } from "@/types";

interface ProblemCommentsProps {
  comments: ProblemComment[];
  onAddComment: (content: string) => Promise<void>;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ProblemComments({ comments, onAddComment }: ProblemCommentsProps) {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await onAddComment(text.trim());
      setText("");
    } catch {
      setError(t("common.error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* Comment list */}
      {comments.length === 0 && (
        <Text style={styles.emptyText}>No comments yet. Be the first to add one.</Text>
      )}
      {comments.map((c) => (
        <View key={c.id} style={styles.commentItem}>
          <View style={styles.commentHeader}>
            <View style={styles.avatarDot} />
            <Text style={styles.commentAuthor}>{t("problems.anonymousEmployee")}</Text>
            <View style={styles.spacer} />
            <Text style={styles.commentDate}>{formatDate(c.created_at)}</Text>
          </View>
          <Text style={styles.commentContent}>{c.content}</Text>
        </View>
      ))}

      {/* Add comment input */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.commentInput}
          value={text}
          onChangeText={setText}
          placeholder={t("problems.commentPlaceholder")}
          placeholderTextColor={colors.textMuted}
          multiline
          maxLength={2000}
        />
        <Pressable
          style={StyleSheet.flatten([
            styles.submitBtn,
            (!text.trim() || loading) && styles.submitBtnDisabled,
          ])}
          onPress={handleSubmit}
          disabled={!text.trim() || loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.submitBtnText}>{t("problems.submitComment")}</Text>
          )}
        </Pressable>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: spacing.md,
    marginTop: spacing.sm,
  },
  emptyText: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    fontStyle: "italic",
  },
  commentItem: {
    gap: 5,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  avatarDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.backgroundSection,
    borderWidth: 1,
    borderColor: colors.borderColor,
  },
  commentAuthor: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textSecondary,
  },
  spacer: { flex: 1 },
  commentDate: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
  commentContent: {
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    lineHeight: typography.fontSize.sm * 1.55,
    paddingLeft: 30,
  },
  inputRow: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "flex-end",
    marginTop: spacing.xs,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    backgroundColor: colors.backgroundLight,
    minHeight: 40,
  },
  submitBtn: {
    backgroundColor: colors.primaryNavy,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    minHeight: 40,
    justifyContent: "center",
  },
  submitBtnDisabled: { opacity: 0.4 },
  submitBtnText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: "#FFFFFF",
  },
  errorText: {
    fontSize: typography.fontSize.xs,
    color: colors.error,
  },
});
