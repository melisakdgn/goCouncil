import React, { useEffect, useRef } from "react";
import { ScrollView, StyleSheet, View, type ViewStyle, Platform } from "react-native";
import { colors, layout } from "@/constants/theme";
import Header from "./Header";
import Footer from "./Footer";
import { resumePendingScroll } from "@/utils/scroll";

interface AppLayoutProps {
  children: React.ReactNode;
  scrollable?: boolean;
  fullWidth?: boolean;
}

export default function AppLayout({
  children,
  scrollable = true,
  fullWidth = false,
}: AppLayoutProps) {
  const scrollRef = useRef<ScrollView | null>(null);

  // After this page's DOM mounts, honor any section target staged before navigation.
  useEffect(() => {
    resumePendingScroll();
  }, []);

  const pageChildren = fullWidth ? (
    children
  ) : (
    <View style={styles.pageContent}>{children}</View>
  );

  // Wrapping the page content in a growing view pushes the footer to the bottom
  // of the viewport on short pages, while still letting it sit after the content
  // (and scroll into view) on tall ones.
  const body = <View style={styles.contentWrap}>{pageChildren}</View>;

  if (!scrollable) {
    return (
      <View style={[styles.root, Platform.OS === "web" && styles.rootWeb]}>
        <Header />
        <View style={styles.body}>
          {body}
          <Footer />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.root, Platform.OS === "web" && styles.rootWeb]}>
      <Header />
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {body}
        <Footer />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  rootWeb: {
    minHeight: "100vh",
    height: "100vh",
  } as unknown as ViewStyle,
  body: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentWrap: {
    flexGrow: 1,
  },
  pageContent: {
    maxWidth: layout.maxContentWidth,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: layout.containerPaddingH,
    paddingVertical: 32,
  },
});
