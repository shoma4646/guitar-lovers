/**
 * 週次練習時間バーチャート（Stitch modern_2 風）
 *
 * - 曜日ごとに 1 本のバー、値に応じて primary の透過度を変える
 * - 今日のバーは fully primary、それ以外は値の量で 10%〜60% に減衰
 */

import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/shared/theme";

const WEEK_DAYS_EN = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type Props = {
  weeklyData: number[];
};

/** 値の割合 0..1 を 0.1〜1.0 の primary 不透明度に変換 */
function ratioToAlphaHex(ratio: number, isToday: boolean): string {
  if (isToday) return colors.primary;
  const alpha = Math.max(0.1, Math.min(1, ratio * 0.85 + 0.1));
  const hex = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, "0");
  return `${colors.primary}${hex}`;
}

export function WeekBarChart({ weeklyData }: Props) {
  const maxVal = Math.max(...weeklyData, 1);
  const today = new Date();
  const todayIdx = (today.getDay() + 6) % 7;

  return (
    <View
      className="bg-surface-container-lowest"
      style={[styles.container, shadowStyle]}
    >
      <Text
        className="text-label-sm"
        style={{
          color: colors.outline,
          letterSpacing: 1.2,
          textTransform: "uppercase",
          fontWeight: "600",
          marginBottom: 16,
        }}
      >
        WEEKLY RHYTHM
      </Text>
      <View style={styles.bars}>
        {weeklyData.map((val, idx) => {
          const ratio = val / maxVal;
          const isToday = idx === todayIdx;
          const height = `${Math.max(ratio * 100, val > 0 ? 5 : 0)}%` as const;

          return (
            <View key={idx} style={styles.column}>
              <View
                style={{
                  width: "100%",
                  height,
                  backgroundColor: ratioToAlphaHex(ratio, isToday),
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                }}
              />
              <Text
                className="text-[10px]"
                style={{
                  color: isToday ? colors.primary : colors.outline,
                  fontWeight: "600",
                  marginTop: 8,
                }}
              >
                {WEEK_DAYS_EN[idx]}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const shadowStyle = {
  shadowColor: "#000",
  shadowOpacity: 0.04,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 2,
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    borderRadius: 16,
  },
  bars: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 128,
    gap: 8,
  },
  column: {
    flex: 1,
    alignItems: "center",
    height: "100%",
    justifyContent: "flex-end",
  },
});
