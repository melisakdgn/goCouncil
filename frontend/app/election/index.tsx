import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import AppLayout from "@/components/layout/AppLayout";
import { useScrollToSection } from "@/components/layout/ScrollContext";
import CandidateCard from "@/components/cards/CandidateCard";
import ElectionTimeline from "@/components/sections/ElectionTimeline";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useElectionHashScroll } from "@/hooks/useElectionHashScroll";
import { MOCK_CANDIDATES, MOCK_ELECTION } from "@/constants/mockData";
import { colors, layout, spacing, typography } from "@/constants/theme";
import { ELECTION_SECTIONS } from "@/utils/scroll";

export default function ElectionPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const scrollToSection = useScrollToSection();

    useElectionHashScroll();

    return (
        <AppLayout fullWidth>
            <View style={styles.hero}>
                <View style={styles.container}>
                    <Text style={styles.title}>{t("electionPage.title")}</Text>
                    <Text style={styles.subtitle}>
                        {t("electionPage.subtitle")}
                    </Text>

                    <View style={styles.quickLinks}>
                        <Pressable
                            accessibilityRole="button"
                            testID="election-link-candidates"
                            style={styles.quickLink}
                            onPress={() => scrollToSection(ELECTION_SECTIONS.candidates)}
                        >
                            <Text style={styles.quickLinkText}>{t("electionPage.linkCandidates")}</Text>
                        </Pressable>

                        <Pressable
                            accessibilityRole="button"
                            testID="election-link-process"
                            style={styles.quickLink}
                            onPress={() => scrollToSection(ELECTION_SECTIONS.process)}
                        >
                            <Text style={styles.quickLinkText}>{t("electionPage.linkProcess")}</Text>
                        </Pressable>

                        <Pressable
                            accessibilityRole="button"
                            testID="election-link-preference"
                            style={styles.quickLink}
                            onPress={() => scrollToSection(ELECTION_SECTIONS.preference)}
                        >
                            <Text style={styles.quickLinkText}>{t("electionPage.linkPreference")}</Text>
                        </Pressable>
                    </View>
                </View>
            </View>

            <View nativeID="election-candidates" style={styles.section}>
                <View style={styles.container}>
                    <Text style={styles.sectionTitle}>{t("electionPage.candidatesTitle")}</Text>
                    <Text style={styles.sectionSubtitle}>
                        {t("electionPage.candidatesSubtitle")}
                    </Text>

                    <View style={styles.candidatesGrid}>
                        {MOCK_CANDIDATES.map((candidate) => (
                            <View key={candidate.id} style={styles.candidateCell}>
                                <CandidateCard candidate={candidate} />
                            </View>
                        ))}
                    </View>
                </View>
            </View>

            <View nativeID="election-process" style={styles.sectionAlt}>
                <View style={styles.container}>
                    <Text style={styles.sectionTitle}>{t("electionPage.processTitle")}</Text>
                    <Text style={styles.sectionSubtitle}>
                        {t("electionPage.processSubtitle")}
                    </Text>

                    <Card style={styles.timelineCard}>
                        <ElectionTimeline steps={MOCK_ELECTION.steps} />
                    </Card>
                </View>
            </View>

            <View nativeID="election-preference" style={styles.section}>
                <View style={styles.container}>
                    <Text style={styles.sectionTitle}>{t("electionPage.preferenceTitle")}</Text>
                    <Text style={styles.sectionSubtitle}>
                        {t("electionPage.preferenceSubtitle")}
                    </Text>

                    <Card style={styles.preferenceCard}>
                        <Text style={styles.preferenceTitle}>{t("electionPage.preferenceCardTitle")}</Text>
                        <Text style={styles.preferenceText}>
                            {t("electionPage.preferenceCardText")}
                        </Text>


                        <Button
                            label={t("electionPage.startMatching")}
                            variant="secondary"
                            size="lg"
                            onPress={() => router.push("/preference-matching" as any)}
                        />

                    </Card>
                </View>
            </View>
        </AppLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        maxWidth: layout.maxContentWidth,
        width: "100%",
        alignSelf: "center",
        paddingHorizontal: layout.containerPaddingH,
    },
    hero: {
        backgroundColor: colors.primaryNavy,
        paddingVertical: spacing["4xl"],
    },
    title: {
        fontSize: typography.fontSize["4xl"],
        fontWeight: typography.fontWeight.extraBold,
        color: colors.textOnDark,
        marginBottom: spacing.md,
    },
    subtitle: {
        fontSize: typography.fontSize.md,
        color: "rgba(255,255,255,0.75)",
        maxWidth: 760,
        lineHeight: 28,
        marginBottom: spacing["2xl"],
    },
    quickLinks: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: spacing.md,
    },
    quickLink: {
        backgroundColor: colors.backgroundWhite,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
        borderRadius: 10,
        cursor: "pointer" as any,
        zIndex: 10,
    },
    quickLinkText: {
        color: colors.primaryNavy,
        fontWeight: typography.fontWeight.semiBold,
        fontSize: typography.fontSize.base,
    },
    section: {
        backgroundColor: colors.backgroundWhite,
        paddingVertical: spacing["4xl"],
    },
    sectionAlt: {
        backgroundColor: colors.backgroundLight,
        paddingVertical: spacing["4xl"],
    },
    sectionTitle: {
        fontSize: typography.fontSize["3xl"],
        fontWeight: typography.fontWeight.bold,
        color: colors.primaryNavy,
        marginBottom: spacing.sm,
    },
    sectionSubtitle: {
        fontSize: typography.fontSize.base,
        color: colors.textSecondary,
        marginBottom: spacing["2xl"],
        maxWidth: 720,
    },
    candidatesGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: spacing.lg,
    },
    candidateCell: {
        flex: 1,
        minWidth: 180,
        maxWidth: 260,
    },
    timelineCard: {
        padding: spacing["2xl"],
    },
    preferenceCard: {
        padding: spacing["2xl"],
        gap: spacing.md,
        width: "100%",
    },
    preferenceTitle: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.primaryNavy,
    },
    preferenceText: {
        fontSize: typography.fontSize.base,
        color: colors.textSecondary,
        lineHeight: 24,
        marginBottom: spacing.md,
    },
});