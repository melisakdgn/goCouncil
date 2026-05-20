import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { colors, layout } from "@/constants/theme";
import Header from "./Header";
import Footer from "./Footer";

interface AppLayoutProps {
  children: React.ReactNode;
  scrollable?: boolean;
}

export default function AppLayout({ children, scrollable = true }: AppLayoutProps) {
  const content = (
    <View style={styles.inner}>
      <Header />
      <View style={styles.pageContent}>{children}</View>
      <Footer />
    </View>
  );

  if (!scrollable) {
    return <View style={styles.root}>{content}</View>;
  }

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {content}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  scrollContent: {
    flexGrow: 1,
  },
  inner: {
    flex: 1,
    minHeight: "100%",
  },
  pageContent: {
    flex: 1,
    maxWidth: layout.maxContentWidth,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: layout.containerPaddingH,
    paddingVertical: 32,
  },
});
