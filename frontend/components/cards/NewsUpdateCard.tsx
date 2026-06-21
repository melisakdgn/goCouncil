import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { borderRadius, colors, spacing, typography } from "@/constants/theme";
import type { NewsUpdate } from "@/types";

interface NewsUpdateCardProps {
  item: NewsUpdate;
  onPress?: () => void;
}

export default function NewsUpdateCard({ item, onPress }: NewsUpdateCardProps) {
  const { t, i18n } = useTranslation();
  const [hovered, setHovered] = useState(false);
  const isDE = i18n.language === "de";

  const title = isDE && item.title_de ? item.title_de : item.title;
  const summary = isDE && item.summary_de ? item.summary_de : item.summary;

  const formattedDate = new Date(item.date).toLocaleDateString(
    isDE ? "de-DE" : "en-US",
    { day: "2-digit", month: "short", year: "numeric" }
  );

  return (
    <Pressable
      style={[styles.card, hovered && styles.cardHovered]}
      onPress={onPress}
      // @ts-ignore - web only pointer events
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Date badge */}
      <View style={styles.dateBadge}>
        <Text style={styles.dateText}>{formattedDate}</Text>
      </View>

      {/* Title */}
      <Text style={[styles.title, hovered && styles.titleHovered]} numberOfLines={2}>
        {title}
      </Text>

      {/* Summary */}
      {summary ? (
        <Text style={styles.summary} numberOfLines={3}>
          {summary}
        </Text>
      ) : null}

      {/* Read more */}
      <View style={styles.readMoreRow}>
        <Text style={[styles.readMore, hovered && styles.readMoreHovered]}>
          {t("common.readMore")} →
        </Text>
      </View>
    </Pressable>
  );
}

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
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
    flex: 1,
  },
  cardHovered: {
    borderColor: colors.primaryNavy,
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 5,
  },

  dateBadge: {
    backgroundColor: colors.backgroundSection,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
    alignSelf: "flex-start",
  },
  dateText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textMuted,
    letterSpacing: 0.3,
  },

  title: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    lineHeight: typography.fontSize.md * 1.35,
  },
  titleHovered: {
    color: colors.primaryNavy,
  },

  summary: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: typography.fontSize.sm * 1.6,
    flex: 1,
  },

  readMoreRow: {
    marginTop: spacing.xs,
  },
  readMore: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.accentOrange,
  },
  readMoreHovered: {
    color: colors.primaryNavy,
  },
});
