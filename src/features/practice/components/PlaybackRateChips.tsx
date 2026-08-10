/**
 * 再生速度選択チップ
 */

import { View, Text, Pressable } from "react-native";
import { colors } from "@/shared/theme";
import { PLAYBACK_RATES, type PlaybackRate } from "@/stores/practice";

type Props = {
  value: PlaybackRate;
  onChange: (rate: PlaybackRate) => void;
};

export function PlaybackRateChips({ value, onChange }: Props) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text
        className="text-label-sm mb-sm"
        style={{
          color: colors.onSurfaceVariant,
          letterSpacing: 1.2,
          textTransform: "uppercase",
          fontWeight: "600",
          paddingHorizontal: 4,
        }}
      >
        再生速度
      </Text>
      <View className="flex-row flex-wrap" style={{ gap: 8 }}>
        {PLAYBACK_RATES.map((rate) => {
          const active = value === rate;
          return (
            <Pressable
              key={rate}
              onPress={() => onChange(rate as PlaybackRate)}
              className="active:opacity-80"
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 9999,
                backgroundColor: active
                  ? colors.primary
                  : colors.surfaceContainer,
              }}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
            >
              <Text
                className="text-label-sm"
                style={{
                  color: active ? colors.onPrimary : colors.onSurfaceVariant,
                  fontWeight: "600",
                }}
              >
                {rate}x
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
