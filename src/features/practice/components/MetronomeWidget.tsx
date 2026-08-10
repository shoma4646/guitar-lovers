/**
 * メトロノームウィジェット（Stitch modern_3 風）
 *
 * - "METRONOME" ラベル + 4 ビートのドット表示
 * - 大型 BPM 表示（display-numeric 64px）と +/- ボタン
 * - START / STOP CTA
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Animated,
  StyleSheet,
} from "react-native";
import * as Haptics from "expo-haptics";
import { Icon } from "@/shared/components/atoms/Icon";
import { colors } from "@/shared/theme";
import { usePracticeStore, PRESET_BPMS } from "@/stores/practice";

const BEAT_DOTS = [0, 1, 2, 3];

export function MetronomeWidget() {
  const bpm = usePracticeStore((s) => s.metronomeBpm);
  const enabled = usePracticeStore((s) => s.metronomeEnabled);
  const setMetronomeBpm = usePracticeStore((s) => s.setMetronomeBpm);
  const setMetronomeEnabled = usePracticeStore((s) => s.setMetronomeEnabled);

  const beatScale = useRef(new Animated.Value(1)).current;
  const beatTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [activeBeat, setActiveBeat] = useState(0);

  const animateBeat = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.sequence([
      Animated.timing(beatScale, {
        toValue: 1.08,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(beatScale, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();
    setActiveBeat((prev) => (prev + 1) % 4);
  }, [beatScale]);

  useEffect(() => {
    if (enabled) {
      const intervalMs = (60 / bpm) * 1000;
      animateBeat();
      beatTimerRef.current = setInterval(animateBeat, intervalMs);
    } else if (beatTimerRef.current) {
      clearInterval(beatTimerRef.current);
      beatTimerRef.current = null;
      setActiveBeat(0);
    }
    return () => {
      if (beatTimerRef.current) {
        clearInterval(beatTimerRef.current);
        beatTimerRef.current = null;
      }
    };
  }, [enabled, bpm, animateBeat]);

  return (
    <View
      className="bg-surface-container-lowest"
      style={[styles.container, shadowStyle]}
    >
      {/* Header: METRONOME label + beat dots */}
      <View className="flex-row items-center justify-between">
        <Text
          className="text-label-sm"
          style={{
            color: colors.onSurfaceVariant,
            letterSpacing: 1.2,
            textTransform: "uppercase",
            fontWeight: "600",
          }}
        >
          METRONOME
        </Text>
        <View className="flex-row" style={{ gap: 8 }}>
          {BEAT_DOTS.map((i) => (
            <View
              key={i}
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor:
                  enabled && i === activeBeat ? colors.primary : colors.outlineVariant,
              }}
            />
          ))}
        </View>
      </View>

      {/* BPM Display */}
      <View className="flex-row items-center justify-around" style={{ paddingVertical: 16 }}>
        <Pressable
          onPress={() => setMetronomeBpm(bpm - 5)}
          className="items-center justify-center active:scale-90"
          style={[
            styles.adjustBtn,
            { backgroundColor: `${colors.primaryContainer}33` },
          ]}
          accessibilityLabel="BPMを5下げる"
        >
          <Icon name="remove" size={22} color={colors.primary} />
        </Pressable>

        <Animated.View
          className="items-center"
          style={{ transform: [{ scale: beatScale }] }}
        >
          <Text style={styles.bpmValue}>{bpm}</Text>
          <Text
            className="text-label-sm"
            style={{
              color: colors.onSurfaceVariant,
              letterSpacing: 1,
              fontWeight: "600",
            }}
          >
            BPM
          </Text>
        </Animated.View>

        <Pressable
          onPress={() => setMetronomeBpm(bpm + 5)}
          className="items-center justify-center active:scale-90"
          style={[
            styles.adjustBtn,
            { backgroundColor: `${colors.primaryContainer}33` },
          ]}
          accessibilityLabel="BPMを5上げる"
        >
          <Icon name="add" size={22} color={colors.primary} />
        </Pressable>
      </View>

      {/* Start / Stop CTA */}
      <Pressable
        onPress={() => setMetronomeEnabled(!enabled)}
        className="w-full flex-row items-center justify-center active:opacity-90"
        style={{
          height: 52,
          marginTop: 16,
          borderRadius: 16,
          backgroundColor: enabled ? colors.error : colors.primary,
          gap: 8,
        }}
        accessibilityRole="switch"
        accessibilityState={{ checked: enabled }}
      >
        <Icon
          name={enabled ? "pause" : "play_circle"}
          size={22}
          color={colors.onPrimary}
        />
        <Text
          className="text-label-sm"
          style={{
            color: colors.onPrimary,
            fontWeight: "700",
            letterSpacing: 1,
          }}
        >
          {enabled ? "STOP" : "START PRACTICE"}
        </Text>
      </Pressable>

      {/* BPM Presets */}
      <View
        className="flex-row flex-wrap justify-center"
        style={{ gap: 8, marginTop: 16 }}
      >
        {PRESET_BPMS.map((presetBpm) => {
          const active = bpm === presetBpm;
          return (
            <Pressable
              key={presetBpm}
              onPress={() => setMetronomeBpm(presetBpm)}
              className="active:opacity-80"
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
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
                {presetBpm}
              </Text>
            </Pressable>
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
    gap: 4,
  },
  adjustBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  bpmValue: {
    fontSize: 64,
    fontWeight: "800",
    lineHeight: 64,
    letterSpacing: -2.56,
    color: "#251817",
    fontVariant: ["tabular-nums"],
  },
});
