import type { PhraseAttempt } from "@/shared/types/models";

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
 * 直近の結果が「弾けた（ok）」なら現在BPMから+5、
 * 「あやしい（partial）」「弾けなかった（ng）」または記録が無い場合は現在BPMを据え置く。
 * @param currentBpm - フレーズの現在の到達BPM
 * @param latestAttempt - 直近の練習結果（無ければundefined）
 */
export function computeTodayTargetBpm(
  currentBpm: number,
  latestAttempt: PhraseAttempt | undefined,
): number {
  if (latestAttempt?.result === "ok") {
    return currentBpm + BPM_STEP;
  }
  return currentBpm;
}
