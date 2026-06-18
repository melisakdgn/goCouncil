import { useEffect } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import AppLayout from "@/components/layout/AppLayout";
import CandidateCard from "@/components/cards/CandidateCard";
import ElectionTimeline from "@/components/sections/ElectionTimeline";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { MOCK_CANDIDATES, MOCK_ELECTION } from "@/constants/mockData";
import { colors, layout, spacing, typography } from "@/constants/theme";

function scrollTo(sectionId: string) {
    if (Platform.OS !== "web" || typeof window === "undefined") return;

    setTimeout(() => {
        const element = window.document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }, 50);
}

export default function ElectionPage() {
    useEffect(() => {
        if (Platform.OS !== "web" || typeof sessionStorage === "undefined") return;

        const sectionId = sessionStorage.getItem("goCouncilElectionSection");

        if (sectionId) {
            setTimeout(() => {
                scrollTo(sectionId);
                sessionStorage.removeItem("goCouncilElectionSection");
            }, 400);
        }
    }, []);

    return (
        <AppLayout fullWidth>
            <View style={styles.hero}>
                <View style={styles.container}>
                    <Text style={styles.title}>Election</Text>
                    <Text style={styles.subtitle}>
                        Explore candidates, follow the election process, and use preference matching to find your best candidate fit.
                    </Text>

                    <View style={styles.quickLinks}>
                        <Pressable style={styles.quickLink} onPress={() => scrollTo("election-candidates")}>
                            <Text style={styles.quickLinkText}>Candidates</Text>
                        </Pressable>

                        <Pressable style={styles.quickLink} onPress={() => scrollTo("election-process")}>
                            <Text style={styles.quickLinkText}>Election Process</Text>
                        </Pressable>

                        <Pressable style={styles.quickLink} onPress={() => scrollTo("election-preference")}>
                            <Text style={styles.quickLinkText}>Preference Matching</Text>
                        </Pressable>
                    </View>
                </View>
            </View>

            <View nativeID="election-candidates" style={styles.section}>
                <View style={styles.container}>
                    <Text style={styles.sectionTitle}>Candidates</Text>
                    <Text style={styles.sectionSubtitle}>
                        Learn about the candidates and compare their profiles.
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
                    <Text style={styles.sectionTitle}>Election Process</Text>
                    <Text style={styles.sectionSubtitle}>
                        Follow the works council election timeline step by step.
                    </Text>

                    <Card style={styles.timelineCard}>
                        <ElectionTimeline steps={MOCK_ELECTION.steps} />
                    </Card>
                </View>
            </View>

            <View nativeID="election-preference" style={styles.section}>
                <View style={styles.container}>
                    <Text style={styles.sectionTitle}>Preference Matching</Text>
                    <Text style={styles.sectionSubtitle}>
                        Answer a short questionnaire and get candidate recommendations based on your preferences.
                    </Text>

                    <Card style={styles.preferenceCard}>
                        <Text style={styles.preferenceTitle}>Find your best-matching candidates</Text>
                        <Text style={styles.preferenceText}>
                            The matching tool compares your workplace priorities with candidate focus areas and shows your top matches.
                        </Text>


                        <Button
                            label="Start Preference Matching"
                            variant="secondary"
                            size="lg"
                            onPress={() => scrollTo("election-preference")}
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
        maxWidth: 720,
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