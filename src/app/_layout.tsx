/**
 * アプリルートレイアウト
 *
 * Stitch DESIGN.md（modern_guitarist）準拠の warm off-white 背景に統一する。
 * Stack ヘッダーは Tabs グループでは非表示にし、画面ごとに自前のヘッダーを描く方針。
 */

import "../../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { colors } from "@/shared/theme";
import { ErrorBoundary } from "@/shared/components/molecules/ErrorBoundary";
import { migrateIfNeeded } from "@/shared/services/storage";

const queryClient = new QueryClient();

// 各画面のクエリより先にストレージの直列キューへ積むため、効果ではなくモジュール読み込み時に開始する
void migrateIfNeeded();

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" backgroundColor={colors.surface} />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.surface },
            headerTintColor: colors.onSurface,
            contentStyle: { backgroundColor: colors.surface },
            headerShadowVisible: false,
            animation: "fade",
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
