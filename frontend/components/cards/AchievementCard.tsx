import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { borderRadius, colors, spacing, typography } from "@/constants/theme";
import type { Achievement } from "@/types";

// Map of icon_name → MaterialCommunityIcons name
const ICON_MAP: Record<string, string> = {
  award:          "lightbulb-on",
  "graduation-cap": "school",
  handshake:      "handshake",
  heart:          "currency-eur",
};

interface AchievementCardProps {
  achievement: Achievement;
  /** When true, renders on a dark (navy) background — white text, no card background */
  dark?: boolean;
}

export default function AchievementCard({ achievement, dark = false }: AchievementCardProps) {
  const { i18n } = useTranslation();
  const isDE = i18n.language === "de";

  const label = isDE && achievement.label_de ? achievement.label_de : achievement.label;
  const description =
    isDE && achievement.description_de ? achievement.description_de : achievement.description;

  const iconName = ICON_MAP[achievement.icon_name ?? ""] ?? "star";

  if (dark) {
    return (
      <View style={styles.darkCard}>
        <View style={styles.darkIconBg}>
          <MaterialCommunityIcons name={iconName as any} size={22} color={colors.accentOrange} />
        </View>
        <Text style={styles.darkStat}>{achievement.stat_value}</Text>
        <Text style={styles.darkLabel}>{label}</Text>
        {description ? (
          <Text style={styles.darkDescription}>{description}</Text>
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.lightCard}>
      <View style={styles.lightIconBg}>
        <MaterialCommunityIcons name={iconName as any} size={20} color={colors.accentOrange} />
      </View>
      <Text style={styles.lightStat}>{achievement.stat_value}</Text>
      <Text style={styles.lightLabel}>{label}</Text>
      {description ? (
        <Text style={styles.lightDescription}>{description}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  // ── Dark variant (navy section background) ────────────────────────────────
  darkCard: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    padding: spacing.xl,
    alignItems: "center",
    gap: spacing.sm,
    flex: 1,
  },
  darkIconBg: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: "rgba(232,119,34,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  darkStat: {
    fontSize: typography.fontSize["3xl"],
    fontWeight: typography.fontWeight.extraBold,
    color: "#FFFFFF",
    lineHeight: typography.fontSize["3xl"] * 1.1,
  },
  darkLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: "rgba(255,255,255,0.75)",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  darkDescription: {
    fontSize: typography.fontSize.xs,
    color: "rgba(255,255,255,0.45)",
    textAlign: "center",
    lineHeight: typography.fontSize.xs * 1.5,
  },

  // ── Light variant (white / card background) ───────────────────────────────
  lightCard: {
    backgroundColor: colors.backgroundWhite,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: spacing.xl,
    alignItems: "center",
    gap: spacing.sm,
    shadowColor: colors.primaryNavy,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
  },
  lightIconBg: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: "rgba(232,119,34,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  lightStat: {
    fontSize: typography.fontSize["3xl"],
    fontWeight: typography.fontWeight.extraBold,
    color: colors.primaryNavy,
    lineHeight: typography.fontSize["3xl"] * 1.1,
  },
  lightLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textSecondary,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  lightDescription: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: typography.fontSize.xs * 1.5,
  },
});
