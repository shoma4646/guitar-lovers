/**
 * チューナー画面
 *
 * Stitch modern_1 デザインに準拠した UI。
 * - 上部 AppBar（プロフィール + タイトル + 設定）
 * - 中央 大型カード: 周波数 / ノート（display-numeric 120px）/ 半円ゲージ
 * - 6 弦セレクター（小さな円形）
 * - Standard / Auto の Quick Controls
 * - 画面下部に開始/停止 CTA（デモモード起動）
 *
 * 実際のピッチ検出にはネイティブビルドが必要なため、デモモードで各弦を順番にシミュレートする。
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Animated,
  Alert,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "@/shared/components/atoms/Icon";
import { colors, textStyles } from "@/shared/theme";
import {
  tuningPresets,
  TuningPresetKey,
  TUNING_THRESHOLD_CENTS,
  guitarStringFrequencies,
} from "@/shared/constants/tuning";
import { ErrorBoundary } from "@/shared/components/molecules/ErrorBoundary";

/** デモモードで1弦あたり表示するミリ秒 */
const DEMO_INTERVAL_MS = 2000;

/** デモ用セント値のシーケンス（-30 → 0 → +20 → 0） */
const DEMO_CENTS_SEQUENCE = [-28, -15, -5, 2, 0, 0, 18, 5, 0, 0];

/** 各弦の表示番号（6弦〜1弦） */
const STRING_NUMBERS = [6, 5, 4, 3, 2, 1];

/** セント値をメーター表示用の割合に変換する（-50〜+50 → 0〜1） */
function centsToMeterRatio(cents: number): number {
  return Math.max(0, Math.min(1, (cents + 50) / 100));
}

/** セント値に応じたメーターカラーを返す */
function getMeterColor(cents: number): string {
  if (Math.abs(cents) <= TUNING_THRESHOLD_CENTS) return colors.success;
  if (cents < 0) return colors.info;
  return colors.danger;
}

/** セント値を `+12 cents` 形式に整形 */
function formatCents(cents: number): string {
  const sign = cents > 0 ? "+" : "";
  return `${sign}${Math.round(cents)} cents`;
}

export function TunerScreen() {
  const [selectedPreset, setSelectedPreset] =
    useState<TuningPresetKey>("standard");
  const [isActive, setIsActive] = useState(false);
  const [focusedStringIndex, setFocusedStringIndex] = useState(0);
  const [currentNote, setCurrentNote] = useState<string | null>(null);
  const [cents, setCents] = useState(0);
  const [tunedStrings, setTunedStrings] = useState<boolean[]>([
    false, false, false, false, false, false,
  ]);

  const demoSeqIndexRef = useRef(0);
  const demoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const noteOpacity = useRef(new Animated.Value(1)).current;

  const preset = tuningPresets[selectedPreset];

  const animateNoteChange = useCallback(
    (newNote: string) => {
      Animated.sequence([
        Animated.timing(noteOpacity, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(noteOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
      setCurrentNote(newNote);
    },
    [noteOpacity],
  );

  const demoTick = useCallback(() => {
    setFocusedStringIndex((prevStringIdx) => {
      const seqIdx = demoSeqIndexRef.current;
      const centsVal = DEMO_CENTS_SEQUENCE[seqIdx];
      const note = preset.notes[prevStringIdx];

      setCents(centsVal);
      animateNoteChange(note);

      demoSeqIndexRef.current = (seqIdx + 1) % DEMO_CENTS_SEQUENCE.length;

      if (demoSeqIndexRef.current === 0) {
        setTunedStrings((prev) => {
          const next = [...prev];
          next[prevStringIdx] = true;
          return next;
        });
        return (prevStringIdx + 1) % 6;
      }
      return prevStringIdx;
    });
  }, [preset, animateNoteChange]);

  const handleToggleActive = useCallback(() => {
    if (isActive) {
      if (demoTimerRef.current) {
        clearInterval(demoTimerRef.current);
        demoTimerRef.current = null;
      }
      setIsActive(false);
      setCurrentNote(null);
      setCents(0);
      return;
    }
    Alert.alert(
      "デモモードで起動",
      "マイクからのピッチ検出にはネイティブビルドが必要です。\nデモモードで各弦のチューニングをシミュレートします。",
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "デモ開始",
          onPress: () => {
            setIsActive(true);
            demoSeqIndexRef.current = 0;
            setTunedStrings([false, false, false, false, false, false]);
            setFocusedStringIndex(0);
            demoTimerRef.current = setInterval(
              demoTick,
              DEMO_INTERVAL_MS / DEMO_CENTS_SEQUENCE.length,
            );
          },
        },
      ],
    );
  }, [isActive, demoTick]);

  const handleSelectPreset = useCallback(
    (key: TuningPresetKey) => {
      if (isActive) {
        if (demoTimerRef.current) {
          clearInterval(demoTimerRef.current);
          demoTimerRef.current = null;
        }
        setIsActive(false);
        setCurrentNote(null);
        setCents(0);
      }
      setSelectedPreset(key);
      setTunedStrings([false, false, false, false, false, false]);
      setFocusedStringIndex(0);
    },
    [isActive],
  );

  useEffect(() => {
    return () => {
      if (demoTimerRef.current) {
        clearInterval(demoTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isActive && demoTimerRef.current) {
      clearInterval(demoTimerRef.current);
      demoTimerRef.current = setInterval(
        demoTick,
        DEMO_INTERVAL_MS / DEMO_CENTS_SEQUENCE.length,
      );
    }
  }, [demoTick, isActive]);

  const meterRatio = centsToMeterRatio(cents);
  const meterColor = getMeterColor(cents);
  const isTuned = Math.abs(cents) <= TUNING_THRESHOLD_CENTS && isActive;
  const displayNote = currentNote ?? preset.notes[focusedStringIndex] ?? "E";

  // -50..+50 cents → -45deg..+45deg の針回転
  const needleAngleDeg = (meterRatio - 0.5) * 90;

  return (
    <ErrorBoundary>
      <SafeAreaView
        edges={["top"]}
        className="flex-1 bg-surface"
      >
        {/* Top App Bar */}
        <View className="flex-row items-center justify-between px-margin-mobile h-16">
          <View className="w-8 h-8 rounded-full bg-surface-container-highest items-center justify-center">
            <Icon name="school" size={18} color={colors.onSurfaceVariant} />
          </View>
          <Text className="font-bold text-headline-lg text-on-surface">
            Guitar Lovers
          </Text>
          <Pressable className="active:opacity-70" hitSlop={8}>
            <Icon name="settings" size={24} color={colors.primary} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="px-margin-mobile items-center">
            {/* Microcopy */}
            <Text className="text-on-surface-variant text-label-sm tracking-widest mb-lg mt-sm">
              正確に、美しく。
            </Text>

            {/* Main Tuning Card */}
            <View
              className="w-full aspect-square bg-surface-container-lowest items-center justify-between p-xl relative overflow-hidden"
              style={[styles.mainCard, shadowStyle]}
            >
              {/* Frequency Display */}
              <Text className="text-on-surface-variant text-[14px] font-medium" style={styles.hzText}>
                {guitarStringFrequencies[focusedStringIndex]?.toFixed(1) ?? "440.0"} Hz
              </Text>

              {/* Central Note */}
              <View className="items-center">
                <Animated.Text
                  style={[
                    styles.noteText,
                    { color: isTuned ? colors.success : colors.primary, opacity: noteOpacity },
                  ]}
                  accessibilityLiveRegion="polite"
                >
                  {displayNote}
                </Animated.Text>
                <View
                  className="w-2 h-2 rounded-full mt-base"
                  style={{ backgroundColor: meterColor }}
                />
              </View>

              {/* Semi-circular Gauge */}
              <View style={styles.gaugeWrap}>
                <View style={styles.gaugeRingTrack} />
                <View style={styles.gaugeRingActive} />
                {/* Needle */}
                <View
                  style={[
                    styles.needleContainer,
                    { transform: [{ rotate: `${needleAngleDeg}deg` }] },
                  ]}
                >
                  <View style={[styles.needle, { backgroundColor: meterColor }]} />
                  <View
                    style={[
                      styles.needleHead,
                      { backgroundColor: meterColor, borderColor: colors.surfaceContainerLowest },
                    ]}
                  />
                </View>
              </View>

              <Text
                className="text-label-sm font-bold mt-sm"
                style={{ color: meterColor, fontVariant: ["tabular-nums"] }}
                accessibilityLiveRegion="polite"
              >
                {isActive ? formatCents(cents) : "-- cents"}
              </Text>

              {/* Decoration glows */}
              <View style={styles.glowTopRight} />
              <View style={styles.glowBottomLeft} />
            </View>

            {/* String Selectors */}
            <View className="w-full mt-xl flex-row" style={{ gap: 12 }}>
              {preset.notes.map((note, idx) => {
                const isFocused = isActive && idx === focusedStringIndex;
                const isTunedString = tunedStrings[idx];
                const stringNum = STRING_NUMBERS[idx];
                const displayLabel = idx === 0 ? note.toLowerCase() : note;

                return (
                  <View key={idx} className="flex-1 items-center" style={{ gap: 8 }}>
                    <Text
                      className="text-[12px] font-bold"
                      style={{
                        color: isFocused ? colors.primary : colors.outline,
                      }}
                    >
                      {stringNum}
                    </Text>
                    <View
                      className="w-10 h-10 rounded-full items-center justify-center"
                      style={{
                        backgroundColor: isFocused
                          ? colors.primaryContainer
                          : isTunedString
                            ? `${colors.success}1A`
                            : "transparent",
                        borderWidth: 1,
                        borderColor: isFocused
                          ? colors.primaryContainer
                          : isTunedString
                            ? colors.success
                            : colors.outlineVariant,
                      }}
                      accessibilityLabel={`${stringNum}弦 ${note} ${isTunedString ? "チューニング完了" : "未チューニング"}`}
                    >
                      <Text
                        className="text-[14px] font-bold"
                        style={{
                          color: isFocused
                            ? colors.onPrimaryContainer
                            : isTunedString
                              ? colors.success
                              : colors.onSurface,
                        }}
                      >
                        {displayLabel}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Quick Controls (Preset chips + start) */}
            <View className="mt-xl flex-row flex-wrap justify-center" style={{ gap: 12 }}>
              {(Object.keys(tuningPresets) as TuningPresetKey[]).map((key) => {
                const active = key === selectedPreset;
                return (
                  <Pressable
                    key={key}
                    onPress={() => handleSelectPreset(key)}
                    className="flex-row items-center bg-surface-container active:opacity-80"
                    style={{
                      paddingHorizontal: 24,
                      paddingVertical: 12,
                      borderRadius: 9999,
                      gap: 8,
                      backgroundColor: active
                        ? colors.primary
                        : colors.surfaceContainer,
                    }}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: active }}
                  >
                    <Icon
                      name={active ? "mic" : "equalizer"}
                      size={18}
                      color={active ? colors.onPrimary : colors.onSurfaceVariant}
                    />
                    <Text
                      className="text-label-sm"
                      style={{
                        color: active ? colors.onPrimary : colors.onSurfaceVariant,
                        fontWeight: "600",
                      }}
                    >
                      {tuningPresets[key].label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Start / Stop CTA */}
            <Pressable
              onPress={handleToggleActive}
              className="w-full mt-xl items-center justify-center active:opacity-90"
              style={{
                height: 52,
                borderRadius: 16,
                backgroundColor: isActive ? colors.error : colors.primary,
              }}
              accessibilityRole="button"
              accessibilityLabel={isActive ? "チューナーを停止" : "チューナーを開始"}
            >
              <Text
                className="text-body-lg"
                style={{ color: colors.onPrimary, fontWeight: "700", letterSpacing: 0.5 }}
              >
                {isActive ? "停止" : "デモを開始"}
              </Text>
            </Pressable>

            <Text className="text-on-surface-variant text-label-sm text-center mt-sm" style={{ lineHeight: 18 }}>
              マイクからのピッチ検出にはネイティブビルドが必要です
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ErrorBoundary>
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
  mainCard: {
    borderRadius: 32,
  },
  hzText: {
    fontVariant: ["tabular-nums"],
  },
  noteText: {
    fontSize: 120,
    fontWeight: "800",
    lineHeight: 120,
    letterSpacing: -7.2, // -0.06em × 120
    fontVariant: ["tabular-nums"],
  },
  // 半円ゲージ: 直径 256 のリングを下半分にクリップ
  gaugeWrap: {
    width: "100%",
    height: 96,
    marginTop: 16,
    alignItems: "center",
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  gaugeRingTrack: {
    position: "absolute",
    width: 256,
    height: 256,
    bottom: -128,
    borderWidth: 12,
    borderColor: "#fce3df", // surface-container-high
    borderRadius: 128,
  },
  gaugeRingActive: {
    position: "absolute",
    width: 60,
    height: 256,
    bottom: -128,
    left: "50%",
    marginLeft: -30,
    borderTopWidth: 12,
    borderColor: "#ff6b5b", // primary-container
  },
  needleContainer: {
    position: "absolute",
    bottom: 0,
    width: 4,
    height: 80,
    alignItems: "center",
    transformOrigin: "bottom",
  },
  needle: {
    width: 3,
    height: 80,
    borderRadius: 2,
  },
  needleHead: {
    position: "absolute",
    top: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
  glowTopRight: {
    position: "absolute",
    top: -64,
    right: -64,
    width: 192,
    height: 192,
    borderRadius: 96,
    backgroundColor: "rgba(255,107,91,0.05)",
  },
  glowBottomLeft: {
    position: "absolute",
    bottom: -64,
    left: -64,
    width: 192,
    height: 192,
    borderRadius: 96,
    backgroundColor: "rgba(0,175,143,0.05)",
  },
});

// textStylesをimportしているが直接使っていないので参照を残す
void textStyles;
