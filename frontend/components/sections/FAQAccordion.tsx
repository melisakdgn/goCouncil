import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { borderRadius, colors, spacing, typography } from "@/constants/theme";
import type { FAQItem } from "@/types";

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const { i18n } = useTranslation();
  const [openId, setOpenId] = useState<string | null>(null);
  const isDE = i18n.language === "de";

  return (
    <View style={styles.container}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        const question = isDE && item.question_de ? item.question_de : item.question;
        const answer = isDE && item.answer_de ? item.answer_de : item.answer;

        return (
          <View key={item.id} style={styles.item}>
            <Pressable
              style={styles.header}
              onPress={() => setOpenId(isOpen ? null : item.id)}
              accessibilityRole="button"
              accessibilityState={{ expanded: isOpen }}
            >
              <Text style={styles.question}>{question}</Text>
              <Text style={styles.chevron}>{isOpen ? "−" : "+"}</Text>
            </Pressable>
            {isOpen && (
              <View style={styles.body}>
                <Text style={styles.answer}>{answer}</Text>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.sm },
  item: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    overflow: "hidden",
    shadowColor: colors.primaryNavy,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.lg,
  },
  question: {
    flex: 1,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textPrimary,
    marginRight: spacing.md,
  },
  chevron: {
    fontSize: 20,
    color: colors.accentOrange,
    fontWeight: typography.fontWeight.bold,
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  answer: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    lineHeight: typography.fontSize.base * 1.6,
  },
});
