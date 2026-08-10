/**
 * 練習タブ（Stitch modern_3 風）
 *
 * URL入力・動画プレイヤー・タイマー・再生速度・ABループ・ブックマーク・メトロノームの
 * 各カードを束ねるコンテナ。WebViewの再生制御（sendToPlayer）はここで一元管理し、
 * 子コンポーネントへはpropsとして渡す。
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, Pressable, ScrollView, Alert, StyleSheet } from "react-native";
import WebView from "react-native-webview";
import { randomUUID } from "expo-crypto";
import {
  usePracticeStore,
  extractVideoId,
  type PlaybackRate,
} from "@/stores/practice";
import { colors } from "@/shared/theme";
import { Icon } from "@/shared/components/atoms/Icon";
import type { PracticePhrase } from "@/shared/types/models";
import { useSavePracticeSession } from "@/features/progress/api/useSavePracticeSession";
import { useAddRecentVideo } from "@/features/practice/api/useAddRecentVideo";
import { useSavePracticePhrase } from "@/features/practice/api/useSavePracticePhrase";
import { useUpdatePracticePhrase } from "@/features/practice/api/useUpdatePracticePhrase";
import { useSavePhraseAttempt } from "@/features/practice/api/useSavePhraseAttempt";
import { MetronomeWidget } from "./MetronomeWidget";
import { VideoLoaderCard } from "./VideoLoaderCard";
import { VideoPlayerCard } from "./VideoPlayerCard";
import { PracticeTimerCard } from "./PracticeTimerCard";
import { PlaybackRateChips } from "./PlaybackRateChips";
import { ABLoopCard, type SavePhraseInput } from "./ABLoopCard";
import { BookmarksCard } from "./BookmarksCard";
import { TodayMenuCard } from "./TodayMenuCard";
import { PhraseResultSheet } from "./PhraseResultSheet";
import { cardShadowStyle, cardStyle } from "./cardStyle";

export function PracticeTab() {
  const urlInput = usePracticeStore((s) => s.urlInput);
  const loadedVideoId = usePracticeStore((s) => s.loadedVideoId);
  const videoTitle = usePracticeStore((s) => s.videoTitle);
  const elapsedSeconds = usePracticeStore((s) => s.elapsedSeconds);
  const practiceStartTime = usePracticeStore((s) => s.practiceStartTime);
  const abLoop = usePracticeStore((s) => s.abLoop);
  const bookmarks = usePracticeStore((s) => s.bookmarks);
  const playbackRate = usePracticeStore((s) => s.playbackRate);
  const metronomeBpm = usePracticeStore((s) => s.metronomeBpm);

  const currentTime = usePracticeStore((s) => s.currentTime);
  const setCurrentTime = usePracticeStore((s) => s.setCurrentTime);
  const setDuration = usePracticeStore((s) => s.setDuration);

  const setUrlInput = usePracticeStore((s) => s.setUrlInput);
  const loadVideo = usePracticeStore((s) => s.loadVideo);
  const setABLoop = usePracticeStore((s) => s.setABLoop);
  const clearABLoop = usePracticeStore((s) => s.clearABLoop);
  const addBookmark = usePracticeStore((s) => s.addBookmark);
  const removeBookmark = usePracticeStore((s) => s.removeBookmark);
  const setPlaybackRate = usePracticeStore((s) => s.setPlaybackRate);
  const setMetronomeBpm = usePracticeStore((s) => s.setMetronomeBpm);
  const startPracticeTimer = usePracticeStore((s) => s.startPracticeTimer);
  const stopPracticeTimer = usePracticeStore((s) => s.stopPracticeTimer);
  const resetPracticeTimer = usePracticeStore((s) => s.resetPracticeTimer);
  const videoStartSeconds = usePracticeStore((s) => s.videoStartSeconds);
  const videoInitialRate = usePracticeStore((s) => s.videoInitialRate);

  const { mutate: addRecent } = useAddRecentVideo();
  const { mutateAsync: saveSession } = useSavePracticeSession();
  const { mutate: savePhrase } = useSavePracticePhrase();
  const { mutate: updatePhrase } = useUpdatePracticePhrase();
  const { mutate: saveAttempt } = useSavePhraseAttempt();

  // 「今日の練習メニュー」から開始したフレーズ練習。設定中は結果記録バナーを表示する
  const [activePractice, setActivePractice] = useState<{
    phrase: PracticePhrase;
    todayTargetBpm: number;
  } | null>(null);
  const [showResultSheet, setShowResultSheet] = useState(false);

  const webViewRef = useRef<WebView>(null);

  const sendToPlayer = useCallback((cmd: Record<string, unknown>) => {
    webViewRef.current?.postMessage(JSON.stringify(cmd));
  }, []);

  const [displaySeconds, setDisplaySeconds] = useState(0);
  const isTimerRunning = practiceStartTime !== null;

  useEffect(() => {
    if (!isTimerRunning) {
      setDisplaySeconds(elapsedSeconds);
      return;
    }
    const timer = setInterval(() => {
      const additional = Math.floor(
        (Date.now() - (practiceStartTime ?? 0)) / 1000,
      );
      setDisplaySeconds(elapsedSeconds + additional);
    }, 1000);
    return () => clearInterval(timer);
  }, [isTimerRunning, elapsedSeconds, practiceStartTime]);

  // ABループ: B 点到達時に A 点へシーク
  useEffect(() => {
    if (!abLoop.enabled || abLoop.pointA === null || abLoop.pointB === null) {
      return;
    }
    if (currentTime >= abLoop.pointB) {
      sendToPlayer({ action: "seek", time: abLoop.pointA });
    }
  }, [currentTime, abLoop, sendToPlayer]);

  const handleLoadVideo = useCallback(() => {
    if (!urlInput.trim()) {
      Alert.alert("エラー", "YouTubeのURLを入力してください");
      return;
    }
    const videoId = extractVideoId(urlInput.trim());
    if (!videoId) {
      Alert.alert("エラー", "有効なYouTube URLを入力してください");
      return;
    }
    loadVideo(videoId);
    addRecent({
      videoId,
      title: `YouTube動画 (${videoId})`,
      lastWatchedAt: new Date().toISOString(),
    });
  }, [urlInput, loadVideo, addRecent]);

  const handleSaveSession = useCallback(async () => {
    const performSave = async () => {
      await saveSession({
        id: randomUUID(),
        date: new Date().toISOString(),
        duration: displaySeconds,
        videoId: loadedVideoId ?? undefined,
      });
      resetPracticeTimer();
      Alert.alert("記録完了", "練習を記録しました");
    };
    if (displaySeconds < 30) {
      Alert.alert("確認", "練習時間が30秒未満です。記録しますか？", [
        { text: "キャンセル", style: "cancel" },
        { text: "記録する", onPress: () => void performSave() },
      ]);
      return;
    }
    await performSave();
  }, [displaySeconds, loadedVideoId, resetPracticeTimer, saveSession]);

  const handleAddBookmark = useCallback(() => {
    addBookmark({
      id: randomUUID(),
      time: Math.floor(currentTime),
      label: `ブックマーク ${bookmarks.length + 1}`,
      createdAt: new Date().toISOString(),
    });
  }, [addBookmark, bookmarks.length, currentTime]);

  const handleSavePhrase = useCallback(
    (input: SavePhraseInput) => {
      if (!loadedVideoId || abLoop.pointA === null || abLoop.pointB === null) {
        return;
      }
      const now = new Date().toISOString();
      savePhrase({
        id: randomUUID(),
        videoId: loadedVideoId,
        videoTitle: videoTitle || `YouTube動画 (${loadedVideoId})`,
        name: input.name,
        startSec: abLoop.pointA,
        endSec: abLoop.pointB,
        currentBpm: input.currentBpm,
        targetBpm: input.targetBpm,
        playbackRate,
        createdAt: now,
        updatedAt: now,
      });
      Alert.alert("保存しました", `「${input.name}」を今日の練習メニューに追加しました`);
    },
    [loadedVideoId, videoTitle, abLoop.pointA, abLoop.pointB, playbackRate, savePhrase],
  );

  const handleStartPhrase = useCallback(
    (phrase: PracticePhrase, todayTargetBpm: number) => {
      loadVideo(phrase.videoId, phrase.videoTitle, {
        abLoop: { pointA: phrase.startSec, pointB: phrase.endSec, enabled: true },
        // フレーズ保存時のPLAYBACK_RATES由来の値なのでPlaybackRateとして扱える
        playbackRate: phrase.playbackRate as PlaybackRate,
      });
      setMetronomeBpm(todayTargetBpm);
      setActivePractice({ phrase, todayTargetBpm });
    },
    [loadVideo, setMetronomeBpm],
  );

  const handleFinishPractice = useCallback(() => {
    setShowResultSheet(true);
  }, []);

  const handleSubmitResult = useCallback(
    ({ bpm, result }: { bpm: number; result: "ok" | "partial" | "ng" }) => {
      if (!activePractice) return;
      const now = new Date().toISOString();
      saveAttempt({
        id: randomUUID(),
        phraseId: activePractice.phrase.id,
        date: now,
        bpm,
        result,
      });
      if (result === "ok") {
        updatePhrase({
          id: activePractice.phrase.id,
          patch: { currentBpm: bpm, updatedAt: now },
        });
      }
      setShowResultSheet(false);
      setActivePractice(null);
    },
    [activePractice, saveAttempt, updatePhrase],
  );

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 今日の練習メニュー */}
        <TodayMenuCard onStartPhrase={handleStartPhrase} />

        {/* 練習中のフレーズ（今日の練習メニューから開始した場合のみ表示） */}
        {activePractice && (
          <View
            className="bg-surface-container-lowest flex-row items-center"
            style={[cardStyle, cardShadowStyle, { marginBottom: 16, gap: 12 }]}
          >
            <View
              className="items-center justify-center"
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: `${colors.tertiaryContainer}33`,
              }}
            >
              <Icon name="star" size={18} color={colors.tertiary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                className="text-body-md"
                style={{ color: colors.onSurface, fontWeight: "600" }}
                numberOfLines={1}
              >
                練習中: {activePractice.phrase.name}
              </Text>
              <Text
                className="text-label-sm"
                style={{ color: colors.onSurfaceVariant }}
              >
                今日の目標 {activePractice.todayTargetBpm} BPM
              </Text>
            </View>
            <Pressable
              onPress={handleFinishPractice}
              className="active:opacity-90"
              style={{
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 9999,
                backgroundColor: colors.primary,
              }}
              accessibilityRole="button"
            >
              <Text
                className="text-label-sm"
                style={{ color: colors.onPrimary, fontWeight: "700" }}
              >
                終了して記録
              </Text>
            </Pressable>
          </View>
        )}

        {/* URL Input Card */}
        <VideoLoaderCard
          value={urlInput}
          onChangeText={setUrlInput}
          onLoad={handleLoadVideo}
        />

        {/* Video Player (if loaded) */}
        {loadedVideoId && (
          <VideoPlayerCard
            ref={webViewRef}
            videoId={loadedVideoId}
            startSeconds={videoStartSeconds}
            initialRate={videoInitialRate}
            onTimeUpdate={setCurrentTime}
            onDurationReady={setDuration}
          />
        )}

        {/* Timer Card */}
        <PracticeTimerCard
          displaySeconds={displaySeconds}
          isTimerRunning={isTimerRunning}
          onToggleTimer={isTimerRunning ? stopPracticeTimer : startPracticeTimer}
          onSaveSession={() => void handleSaveSession()}
        />

        {/* Playback Rate Chips */}
        <PlaybackRateChips
          value={playbackRate}
          onChange={(rate: PlaybackRate) => {
            setPlaybackRate(rate);
            sendToPlayer({ action: "setRate", rate });
          }}
        />

        {/* AB Loop Card */}
        <ABLoopCard
          abLoop={abLoop}
          currentTime={currentTime}
          onSetPointA={() => setABLoop({ pointA: Math.floor(currentTime) })}
          onSetPointB={() => setABLoop({ pointB: Math.floor(currentTime) })}
          onToggleLoop={() => setABLoop({ enabled: !abLoop.enabled })}
          onClear={clearABLoop}
          defaultBpm={metronomeBpm}
          onSavePhrase={handleSavePhrase}
        />

        {/* Bookmarks Card */}
        <BookmarksCard
          bookmarks={bookmarks}
          onAdd={handleAddBookmark}
          onRemove={removeBookmark}
        />

        {/* Metronome */}
        <MetronomeWidget />
      </ScrollView>
      <PhraseResultSheet
        visible={showResultSheet}
        phrase={activePractice?.phrase ?? null}
        todayTargetBpm={activePractice?.todayTargetBpm ?? 0}
        onClose={() => setShowResultSheet(false)}
        onSubmit={handleSubmitResult}
      />
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
});
