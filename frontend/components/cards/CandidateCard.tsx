import { Link } from "expo-router";
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

  return (
    <View style={styles.card}>
      <View style={styles.avatarContainer}>
        {candidate.photo_url ? (
          <Image source={{ uri: candidate.photo_url }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitials}>
              {candidate.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.name} numberOfLines={1}>{candidate.name}</Text>

      <Text style={styles.teamLabel} numberOfLines={1}>
        {candidate.is_independent ? t("candidates.independent") : candidate.team?.name}
      </Text>

      <Text style={styles.role} numberOfLines={1}>{candidate.role}</Text>

      <Link href={ROUTES.candidateDetail(candidate.id)} asChild>
        <Pressable style={styles.viewLink}>
          <Text style={styles.viewLinkText}>{t("candidates.viewProfile")} →</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: "center",
    shadowColor: colors.primaryNavy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
    minWidth: 160,
    flex: 1,
  },
  avatarContainer: {
    marginBottom: spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.backgroundSection,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primaryNavy,
  },
  name: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 2,
    textAlign: "center",
  },
  teamLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: 2,
    textAlign: "center",
  },
  role: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  viewLink: {
    paddingVertical: 4,
  },
  viewLinkText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.accentOrange,
  },
});
