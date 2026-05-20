import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { borderRadius, colors, spacing, typography } from "@/constants/theme";
import type { Achievement } from "@/types";

interface AchievementCardProps {
  achievement: Achievement;
}

export default function AchievementCard({ achievement }: AchievementCardProps) {
  const { i18n } = useTranslation();
  const isDE = i18n.language === "de";

  const label = isDE && achievement.label_de ? achievement.label_de : achievement.label;
  const description = isDE && achievement.description_de ? achievement.description_de : achievement.description;

  return (
    <View style={styles.card}>
      <Text style={styles.iconPlaceholder}>★</Text>
      <Text style={styles.stat}>{achievement.stat_value}</Text>
      <Text style={styles.label}>{label}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    padding: spacing.lg,
    minWidth: 120,
  },
  iconPlaceholder: {
    fontSize: 28,
    color: colors.accentOrange,
    marginBottom: spacing.sm,
  },
  stat: {
    fontSize: typography.fontSize["3xl"],
    fontWeight: typography.fontWeight.extraBold,
    color: colors.primaryNavy,
    lineHeight: typography.fontSize["3xl"] * 1.1,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textSecondary,
    marginTop: 2,
    textAlign: "center",
  },
  description: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
    textAlign: "center",
  },
});
