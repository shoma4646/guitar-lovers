/**
 * 角丸トークン
 *
 * StyleSheet で参照するキー（`radius.lg` 等）は従来名のままにして既存コードを破壊しない。
 * Stitch DESIGN.md の "soft-tech" 体系（4 / 8 / 12 / 16 / 24 / 9999）は NativeWind 側の
 * Tailwind config に直接展開されている（`rounded`, `rounded-md`, `rounded-lg`, `rounded-xl` 等）。
 */

export const radius = {
  /** 4px ドット・小バッジ */
  xs: 4,
  /** 8px チップ・小カード */
  sm: 8,
  /** 12px 標準カード */
  md: 12,
  /** 14px カード（最頻） */
  lg: 14,
  /** 18px 大きめカード */
  xl: 18,
  /** 22px ヒーローカード */
  "2xl": 22,
  /** 28px ピル状ボタン */
  pill: 28,
  /** 9999 円形 */
  full: 9999,
} as const;

export type RadiusKey = keyof typeof radius;
