import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ProblemComments from "@/components/sections/ProblemComments";
import { borderRadius, colors, spacing, typography } from "@/constants/theme";
import type { ProblemPost, ProblemStatus, ProblemUrgency } from "@/types";

// ── Status + urgency config ───────────────────────────────────────────────────

const STATUS_BG: Record<ProblemStatus, string> = {
  new:          "rgba(49,130,206,0.11)",
  under_review: "rgba(214,158,46,0.11)",
  responded:    "rgba(56,161,105,0.11)",
  resolved:     "rgba(138,154,176,0.11)",
};
const STATUS_TEXT: Record<ProblemStatus, string> = {
  new:          colors.info,
  under_review: colors.warning,
  responded:    colors.success,
  resolved:     colors.textMuted,
};
const URGENCY_COLOR: Record<ProblemUrgency, string> = {
  low:    colors.success,
  medium: colors.accentOrange,
  high:   colors.error,
};

function formatDate(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(locale === "de" ? "de-DE" : "en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface ProblemCardProps {
  problem: ProblemPost;
  onLike: () => void;
  isLiked: boolean;
  onAddComment: (content: string) => Promise<void>;
  onAddCouncilResponse: (response: string) => Promise<void>;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ProblemCard({
  problem,
  onLike,
  isLiked,
  onAddComment,
  onAddCouncilResponse,
}: ProblemCardProps) {
  const { t, i18n } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [responseText, setResponseText] = useState(problem.council_response ?? "");
  const [responseLoading, setResponseLoading] = useState(false);
  const [responseError, setResponseError] = useState<string | null>(null);

  const statusBg = STATUS_BG[problem.status] ?? STATUS_BG.new;
  const statusColor = STATUS_TEXT[problem.status] ?? STATUS_TEXT.new;
  const urgencyColor = URGENCY_COLOR[problem.urgency] ?? URGENCY_COLOR.medium;

  const isLongContent = problem.content.length > 220;
  const displayContent =
    isLongContent && !expanded
      ? problem.content.slice(0, 220).trimEnd() + "…"
      : problem.content;

  async function handleSubmitResponse() {
    if (!responseText.trim()) return;
    setResponseLoading(true);
    setResponseError(null);
    try {
      await onAddCouncilResponse(responseText.trim());
      setShowResponseForm(false);
    } catch {
      setResponseError(t("common.error"));
    } finally {
      setResponseLoading(false);
    }
  }

  return (
    <View style={styles.card}>

      {/* ── Header: status badge + urgency ─────────────────────────────── */}
      <View style={styles.headerRow}>
        <View style={StyleSheet.flatten([styles.statusBadge, { backgroundColor: statusBg }])}>
          <Text style={StyleSheet.flatten([styles.statusText, { color: statusColor }])}>
            {t(`problems.status.${problem.status}`)}
          </Text>
        </View>
        <View style={styles.urgencyBadge}>
          <View style={StyleSheet.flatten([styles.urgencyDot, { backgroundColor: urgencyColor }])} />
          <Text style={StyleSheet.flatten([styles.urgencyLabel, { color: urgencyColor }])}>
            {t(`problems.urgency.${problem.urgency}`)}
          </Text>
        </View>
      </View>

      {/* ── Title ──────────────────────────────────────────────────────── */}
      <Text style={styles.title}>{problem.title}</Text>

      {/* ── Meta: category · anonymous · date ─────────────────────────── */}
      <View style={styles.metaRow}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText} numberOfLines={1}>
            {t(`problems.categories.${problem.category}`)}
          </Text>
        </View>
        <View style={styles.metaDot} />
        <MaterialCommunityIcons name="shield-account" size={12} color={colors.textMuted} />
        <Text style={styles.metaText}>{t("problems.postedAnonymously")}</Text>
        <View style={styles.metaDot} />
        <Text style={styles.metaText}>{formatDate(problem.created_at, i18n.language)}</Text>
      </View>

      {/* ── Content ────────────────────────────────────────────────────── */}
      <Text style={styles.content}>{displayContent}</Text>
      {isLongContent && (
        <Pressable onPress={() => setExpanded((v) => !v)}>
          <Text style={styles.showMoreText}>{expanded ? t("problems.showLess") : t("problems.showMore")}</Text>
        </Pressable>
      )}

      {/* ── Stats: likes + comments toggle ────────────────────────────── */}
      <View style={styles.statsRow}>
        <Pressable
          style={StyleSheet.flatten([styles.statBtn, isLiked && styles.statBtnLiked])}
          onPress={onLike}
        >
          <MaterialCommunityIcons
            name={isLiked ? "heart" : "heart-outline"}
            size={15}
            color={isLiked ? colors.error : colors.textSecondary}
          />
          <Text style={StyleSheet.flatten([styles.statBtnText, isLiked && styles.statBtnTextLiked])}>
            {t("problems.likes", { count: problem.like_count })}
          </Text>
        </Pressable>

        <Pressable
          style={styles.statBtn}
          onPress={() => setShowComments((v) => !v)}
        >
          <MaterialCommunityIcons name="comment-outline" size={15} color={colors.textSecondary} />
          <Text style={styles.statBtnText}>
            {showComments
              ? t("problems.hideComments")
              : t("problems.showComments", { count: problem.comments.length })}
          </Text>
        </Pressable>
      </View>

      {/* ── Council response ───────────────────────────────────────────── */}
      <View style={styles.councilSection}>
        {problem.council_response ? (
          <View style={styles.responseBox}>
            <View style={styles.responseHeaderRow}>
              <MaterialCommunityIcons name="shield-star" size={14} color={colors.success} />
              <Text style={styles.responseLabel}>{t("problems.councilResponse")}</Text>
              <View style={styles.spacer} />
              {problem.council_response_created_at && (
                <Text style={styles.responseDate}>
                  {formatDate(problem.council_response_created_at, i18n.language)}
                </Text>
              )}
            </View>
            <Text style={styles.responseText}>{problem.council_response}</Text>
          </View>
        ) : (
          <View style={styles.noResponseRow}>
            <MaterialCommunityIcons name="shield-outline" size={13} color={colors.textMuted} />
            <Text style={styles.noResponseText}>{t("problems.noResponse")}</Text>
          </View>
        )}

        {/* Admin: toggle response form */}
        <Pressable
          style={styles.addResponseToggle}
          onPress={() => setShowResponseForm((v) => !v)}
        >
          <MaterialCommunityIcons name="pencil-outline" size={12} color={colors.textMuted} />
          <Text style={styles.addResponseToggleText}>{t("problems.addResponse")}</Text>
        </Pressable>

        {showResponseForm && (
          <View style={styles.responseForm}>
            <TextInput
              style={styles.responseInput}
              value={responseText}
              onChangeText={setResponseText}
              placeholder={t("problems.responsePlaceholder")}
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={5000}
            />
            {responseError ? <Text style={styles.errorText}>{responseError}</Text> : null}
            <Pressable
              style={StyleSheet.flatten([
                styles.submitResponseBtn,
                (!responseText.trim() || responseLoading) && styles.disabledBtn,
              ])}
              onPress={handleSubmitResponse}
              disabled={!responseText.trim() || responseLoading}
            >
              {responseLoading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.submitResponseBtnText}>{t("problems.submitResponse")}</Text>
              )}
            </Pressable>
          </View>
        )}
      </View>

      {/* ── Comments section ───────────────────────────────────────────── */}
      {showComments && (
        <ProblemComments comments={problem.comments} onAddComment={onAddComment} />
      )}
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundWhite,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    gap: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    shadowColor: colors.primaryNavy,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 3,
  },

  // Header row
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  statusText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semiBold,
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  urgencyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  urgencyDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  urgencyLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semiBold,
  },

  // Title
  title: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    lineHeight: typography.fontSize.md * 1.3,
  },

  // Meta row
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
  },
  categoryBadge: {
    backgroundColor: "rgba(13,46,92,0.07)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  categoryText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.primaryNavy,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.textMuted,
  },
  metaText: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },

  // Content
  content: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: typography.fontSize.sm * 1.6,
  },
  showMoreText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.accentOrange,
    marginTop: -spacing.xs,
  },

  // Stats row
  statsRow: {
    flexDirection: "row",
    gap: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  statBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  statBtnLiked: {
    backgroundColor: "rgba(229,62,62,0.06)",
  },
  statBtnText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  statBtnTextLiked: {
    color: colors.error,
  },

  // Council response
  councilSection: {
    gap: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  responseBox: {
    backgroundColor: "rgba(56,161,105,0.07)",
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: "rgba(56,161,105,0.22)",
    padding: spacing.md,
    gap: spacing.sm,
  },
  responseHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  responseLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.success,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  spacer: { flex: 1 },
  responseDate: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
  responseText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: typography.fontSize.sm * 1.55,
  },
  noResponseRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  noResponseText: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    fontStyle: "italic",
  },
  addResponseToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
  },
  addResponseToggleText: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    textDecorationLine: "underline",
  },
  responseForm: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  responseInput: {
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: typography.fontSize.sm,
    color: colors.textPrimary,
    backgroundColor: colors.backgroundLight,
    minHeight: 90,
  },
  submitResponseBtn: {
    backgroundColor: colors.success,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignSelf: "flex-start",
    justifyContent: "center",
    minWidth: 60,
    alignItems: "center",
  },
  disabledBtn: { opacity: 0.4 },
  submitResponseBtnText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: "#FFFFFF",
  },
  errorText: {
    fontSize: typography.fontSize.xs,
    color: colors.error,
  },
});
