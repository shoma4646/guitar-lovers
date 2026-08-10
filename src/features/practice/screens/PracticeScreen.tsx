/**
 * 練習画面（Practice Dashboard）
 *
 * Stitch modern_5 / modern_6 のダッシュボード構成:
 * - 上部 AppBar（プロフィール + Guitar Lovers + 設定）
 * - 見出し: "Practice Dashboard" + サブテキスト
 * - Pill 形状のサブタブ（練習 / プリセット / お気に入り）
 * - サブタブごとに本体コンポーネントを描画
 *
 * 実行ロジック（YouTube 再生・ABループ・メトロノーム）は子コンポーネントに残し、
 * このスクリーンは表示構造のみを担当する。
 */

import React, { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "@/shared/components/atoms/Icon";
import { colors } from "@/shared/theme";
import { ErrorBoundary } from "@/shared/components/molecules/ErrorBoundary";
import { PracticeTab } from "@/features/practice/components/PracticeTab";
import { PresetsTab } from "@/features/practice/components/PresetsTab";
import { FavoritesTab } from "@/features/practice/components/FavoritesTab";

type TabKey = "practice" | "presets" | "favorites";

const TABS: { key: TabKey; label: string }[] = [
  { key: "practice", label: "練習" },
  { key: "presets", label: "プリセット" },
  { key: "favorites", label: "お気に入り" },
];

export function PracticeScreen() {
  const [activeTab, setActiveTab] = useState<TabKey>("practice");

  return (
    <ErrorBoundary>
      <SafeAreaView edges={["top"]} className="flex-1 bg-surface">
        {/* Top App Bar */}
        <View className="flex-row items-center justify-between px-margin-mobile h-16">
          <View className="w-10 h-10 rounded-full bg-surface-container-high items-center justify-center">
            <Icon name="school" size={20} color={colors.onSurfaceVariant} />
          </View>
          <Text className="font-bold text-headline-lg text-on-surface">
            Guitar Lovers
          </Text>
          <Pressable className="active:opacity-70" hitSlop={8}>
            <Icon name="settings" size={24} color={colors.primary} />
          </Pressable>
        </View>

        {/* Welcome Section */}
        <View className="px-margin-mobile mb-lg">
          <Text className="text-on-surface-variant text-body-md mb-base">
            今日も少しずつ、確かな一歩を。
          </Text>
          <Text
            className="text-headline-xl"
            style={{ color: colors.primary, fontWeight: "700", letterSpacing: -0.5 }}
          >
            Practice Dashboard
          </Text>
        </View>

        {/* Sub-tab Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
          className="grow-0 mb-md"
          style={{ flexGrow: 0 }}
        >
          {TABS.map((tab) => {
            const active = tab.key === activeTab;
            return (
              <Pressable
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                className="active:opacity-80"
                style={{
                  paddingHorizontal: 24,
                  paddingVertical: 8,
                  borderRadius: 9999,
                  backgroundColor: active
                    ? colors.primary
                    : colors.surfaceContainerHighest,
                }}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
              >
                <Text
                  className="text-label-sm"
                  style={{
                    color: active ? colors.onPrimary : colors.onSurfaceVariant,
                    fontWeight: "600",
                  }}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Tab Content */}
        <View className="flex-1">
          {activeTab === "practice" && <PracticeTab />}
          {activeTab === "presets" && <PresetsTab />}
          {activeTab === "favorites" && <FavoritesTab />}
        </View>
      </SafeAreaView>
    </ErrorBoundary>
  );
}
