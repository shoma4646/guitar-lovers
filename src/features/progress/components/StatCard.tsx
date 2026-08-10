/**
 * 統計カード（Stitch modern_2 風）
 *
 * 中央寄せの小さなラベル + 大きな primary 値。
 */

import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/shared/theme";

type Props = {
  label: string;
  value: string;
};

export function StatCard({ label, value }: Props) {
  return (
    <View
      className="bg-surface-container-lowest"
      style={[styles.card, shadowStyle]}
      accessibilityLabel={`${label}: ${value}`}
    >
      <Text
        className="text-label-sm"
        style={{
          color: colors.outline,
          letterSpacing: 0.5,
          fontWeight: "600",
          marginBottom: 4,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          color: colors.primary,
          fontSize: 24,
          fontWeight: "700",
          lineHeight: 28,
          fontVariant: ["tabular-nums"],
        }}
      >
        {value}
      </Text>
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
  card: {
    flex: 1,
    minWidth: 0,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
});
