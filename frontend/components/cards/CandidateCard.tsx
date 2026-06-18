import { Link } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { borderRadius, colors, spacing, typography } from "@/constants/theme";
import { ROUTES } from "@/constants/routes";
import type { Candidate } from "@/types";

interface CandidateCardProps {
  candidate: Candidate;
}

export default function CandidateCard({ candidate }: CandidateCardProps) {
  const { t } = useTranslation();
  const [hovered, setHovered] = useState(false);

  const initials = candidate.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <View
      style={[styles.card, hovered && styles.cardHovered]}
      // @ts-ignore - web only pointer events
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Avatar */}
      <View style={styles.avatarRow}>
        <View style={styles.avatarWrapper}>
          {candidate.photo_url ? (
            <Image source={{ uri: candidate.photo_url }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitials}>{initials}</Text>
            </View>
          )}
        </View>

        {/* Team badge */}
        <View
          style={[
            styles.teamBadge,
            candidate.is_independent && styles.teamBadgeIndependent,
          ]}
        >
          <Text style={[styles.teamBadgeText, candidate.is_independent && styles.teamBadgeTextIndependent]}>
            {candidate.is_independent
              ? t("candidates.independent")
              : candidate.team?.name ?? ""}
          </Text>
        </View>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {candidate.name}
        </Text>
        <Text style={styles.role} numberOfLines={1}>
          {candidate.role}
        </Text>
      </View>

      {/* View profile link */}
      <Link href={{ pathname: "/candidates/[id]", params: { id: candidate.id } }} asChild>
        <Pressable style={StyleSheet.flatten([styles.viewLink, hovered && styles.viewLinkHovered])}>
          <Text style={StyleSheet.flatten([styles.viewLinkText, hovered && styles.viewLinkTextHovered])}>
            {t("candidates.viewProfile")} →
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundWhite,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    gap: spacing.md,
    shadowColor: colors.primaryNavy,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    flex: 1,
  },
  cardHovered: {
    borderColor: colors.accentOrange,
    shadowOpacity: 0.13,
    shadowRadius: 20,
    elevation: 6,
  },

  // Avatar row (avatar + team badge)
  avatarRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  avatarWrapper: {
    shadowColor: colors.primaryNavy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primaryNavy,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: "#FFFFFF",
  },

  // Team badge
  teamBadge: {
    backgroundColor: "rgba(13,46,92,0.08)",
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    alignSelf: "flex-start",
    marginTop: 4,
    maxWidth: 100,
  },
  teamBadgeIndependent: {
    backgroundColor: "rgba(232,119,34,0.1)",
  },
  teamBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.primaryNavy,
  },
  teamBadgeTextIndependent: {
    color: colors.accentOrange,
  },

  // Info
  info: { gap: 2 },
  name: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  role: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },

  // View link
  viewLink: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundLight,
    alignSelf: "flex-start",
    marginTop: spacing.xs,
  },
  viewLinkHovered: {
    backgroundColor: colors.accentOrange,
  },
  viewLinkText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.accentOrange,
  },
  viewLinkTextHovered: {
    color: "#FFFFFF",
  },
});
