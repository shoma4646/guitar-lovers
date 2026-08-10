/**
 * 今日の練習メニューカード
 *
 * Practiceタブを開いた直後の主役。保存済みフレーズ（アーカイブ済みを除く）を一覧し、
 * 各フレーズの「前回BPM → 今日の目標BPM」を表示する。行タップで練習を再開する。
 */

import { useMemo } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { Icon } from "@/shared/components/atoms/Icon";
import { colors } from "@/shared/theme";
import { usePracticePhrases } from "@/features/practice/api/usePracticePhrases";
import { usePhraseAttempts } from "@/features/practice/api/usePhraseAttempts";
import {
  computeTodayTargetBpm,
  getLatestAttempt,
} from "@/features/practice/lib/progression";
import type { PracticePhrase } from "@/shared/types/models";
import { cardShadowStyle, cardStyle } from "./cardStyle";

type Props = {
  onStartPhrase: (phrase: PracticePhrase, todayTargetBpm: number) => void;
};

export function TodayMenuCard({ onStartPhrase }: Props) {
  const { data: phrases, isLoading: isLoadingPhrases } = usePracticePhrases();
  const { data: attempts, isLoading: isLoadingAttempts } = usePhraseAttempts();

  const menuItems = useMemo(() => {
    if (!phrases) return [];
    return phrases
      .filter((p) => !p.archivedAt)
      .map((phrase) => {
        const phraseAttempts = (attempts ?? []).filter(
          (a) => a.phraseId === phrase.id,
        );
        const latest = getLatestAttempt(phraseAttempts);
        const todayTargetBpm = computeTodayTargetBpm(phrase.currentBpm, latest);
        return { phrase, latest, todayTargetBpm };
      });
  }, [phrases, attempts]);

  const isLoading = isLoadingPhrases || isLoadingAttempts;

  return (
    <View
      className="bg-surface-container-lowest"
      style={[cardStyle, cardShadowStyle, { marginBottom: 16, gap: 12 }]}
    >
      <Text
        className="text-headline-lg"
        style={{ color: colors.onSurface, fontWeight: "700" }}
      >
        今日の練習メニュー
      </Text>

      {isLoading ? (
        <ActivityIndicator color={colors.primary} />
      ) : menuItems.length === 0 ? (
        <Text
          className="text-on-surface-variant text-body-md"
          style={{ paddingVertical: 8 }}
        >
          まだフレーズがありません。動画でA点・B点を設定し、「フレーズとして保存」から追加してください。
        </Text>
      ) : (
        <View style={{ gap: 8 }}>
          {menuItems.map(({ phrase, latest, todayTargetBpm }) => (
            <Pressable
              key={phrase.id}
              onPress={() => onStartPhrase(phrase, todayTargetBpm)}
              className="flex-row items-center active:opacity-80"
              style={{
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderRadius: 12,
                gap: 12,
                backgroundColor: colors.surfaceContainerLow,
              }}
              accessibilityRole="button"
              accessibilityLabel={`${phrase.name}の練習を開始`}
            >
              <View
                className="items-center justify-center"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: `${colors.primaryContainer}33`,
                }}
              >
                <Icon name="play_arrow" size={18} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  className="text-body-md"
                  style={{ color: colors.onSurface, fontWeight: "600" }}
                  numberOfLines={1}
                >
                  {phrase.name}
                </Text>
                <Text
                  className="text-label-sm"
                  style={{ color: colors.onSurfaceVariant }}
                >
                  {latest ? `前回 ${latest.bpm}` : "未練習"} → 今日は{" "}
                  {todayTargetBpm} BPM
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
