import type { PhraseAttempt, PracticePhrase } from "@/shared/types/models";
import { resolveCurrentBpm } from "@/features/practice/lib/progression";

/** フレーズ1件分のBPM推移サマリ */
export interface PhraseProgressSummary {
  phrase: PracticePhrase;
  /** 練習開始時点のBPM。最初の練習結果があればそのBPM、無ければ現在BPMを使う */
  startBpm: number;
  /** 現在の到達BPM */
  currentBpm: number;
  /** 目標BPM */
  targetBpm: number;
  /** 開始BPMから目標BPMまでの達成率（0〜1に正規化） */
  progressRatio: number;
}

/**
 * フレーズと関連する練習結果からBPM推移サマリを計算する
 * @param phrase - 対象フレーズ
 * @param attempts - 対象フレーズの練習結果一覧（順不同で可）
 */
export function summarizePhraseProgress(
  phrase: PracticePhrase,
  attempts: PhraseAttempt[],
): PhraseProgressSummary {
  const sorted = [...attempts].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  const startBpm = sorted[0]?.bpm ?? phrase.currentBpm;
  const currentBpm = resolveCurrentBpm(phrase.currentBpm, attempts);
  const targetBpm = phrase.targetBpm;
  const span = targetBpm - startBpm;
  const progressRatio =
    span <= 0
      ? currentBpm >= targetBpm
        ? 1
        : 0
      : clamp((currentBpm - startBpm) / span, 0, 1);

  return { phrase, startBpm, currentBpm, targetBpm, progressRatio };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
