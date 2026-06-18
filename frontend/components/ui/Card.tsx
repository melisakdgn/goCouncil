import React from "react";
import { StyleSheet, View, type ViewProps } from "react-native";
import { borderRadius, colors, shadows } from "@/constants/theme";

interface CardProps extends ViewProps {
  children: React.ReactNode;
  elevated?: boolean;
}

export default function Card({ children, elevated = false, style, ...rest }: CardProps) {
  return (
    <View
      style={[styles.card, elevated && styles.elevated, style]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.lg,
    padding: 16,
    ...shadows.card,
  },
  elevated: {
    ...shadows.cardHover,
  },
});
