/**
 * YouTube再生速度の選択肢
 * UIの選択肢・ストア・永続化スキーマで共通に使う（IFrame Player APIが許容する値の部分集合）
 */

export const PLAYBACK_RATES = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0] as const;
export type PlaybackRate = (typeof PLAYBACK_RATES)[number];

/** 選択肢に含まれる再生速度かを判定する */
export function isPlaybackRate(value: number): value is PlaybackRate {
  return (PLAYBACK_RATES as readonly number[]).includes(value);
}
