import type { PhraseAttempt } from "@/shared/types/models";
import { BPM_MAX } from "@/shared/constants/bpm";

/** 1回の成功で引き上げる目標BPMの幅 */
const BPM_STEP = 5;

/**
 * 練習結果一覧から最新の1件を返す（dateで降順比較）
 * @param attempts - 対象フレーズの練習結果一覧
 */
export function getLatestAttempt(
  attempts: PhraseAttempt[],
): PhraseAttempt | undefined {
  if (attempts.length === 0) return undefined;
  return [...attempts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )[0];
}

/**
 * 今日の目標BPMを計算する
 *
 * 直近の結果が到達BPM以上のテンポで「弾けた（ok）」なら到達BPMから+5。
 * それ以外（あやしい・弾けなかった・到達BPMより遅いテンポでの成功・記録なし）は据え置く。
 * 上限はフレーズの目標BPM（既に超えていれば到達BPM）とメトロノーム上限のいずれか低い方。
 * @param currentBpm - フレーズの現在の到達BPM
 * @param latestAttempt - 直近の練習結果（無ければundefined）
 * @param targetBpm - フレーズの目標BPM
 */
export function computeTodayTargetBpm(
  currentBpm: number,
  latestAttempt: PhraseAttempt | undefined,
  targetBpm: number,
): number {
  const clearedAtCurrentTempo =
    latestAttempt?.result === "ok" && latestAttempt.bpm >= currentBpm;
  if (!clearedAtCurrentTempo) {
    return currentBpm;
  }
  return Math.min(currentBpm + BPM_STEP, Math.max(targetBpm, currentBpm), BPM_MAX);
}
