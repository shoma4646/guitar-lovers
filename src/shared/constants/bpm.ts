/**
 * BPMの許容範囲
 * メトロノーム・フレーズ保存・結果記録・永続化スキーマで共通に使う
 */

export const BPM_MIN = 40;
export const BPM_MAX = 240;

/** 許容範囲内の整数BPMかを判定する */
export function isValidBpm(value: number): boolean {
  return Number.isInteger(value) && value >= BPM_MIN && value <= BPM_MAX;
}

/** BPMを許容範囲内に丸める */
export function clampBpm(value: number): number {
  return Math.max(BPM_MIN, Math.min(BPM_MAX, value));
}
