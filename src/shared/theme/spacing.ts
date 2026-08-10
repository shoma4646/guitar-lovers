/**
 * スペーシングトークン
 *
 * StyleSheet で参照するキー（`spacing.xs` 等）は従来名のままにして既存コードを破壊しない。
 * 一方、NativeWind 側の Tailwind config では Stitch DESIGN.md 準拠の 8px ベースリズム
 * （`px-md`, `gap-lg`, `pt-xl`, `px-margin-mobile` 等）を採用しており、命名は意図的に分離している。
 */

export const spacing = {
  /** 4px */
  xs: 4,
  /** 8px */
  sm: 8,
  /** 12px */
  md: 12,
  /** 16px 標準余白 */
  lg: 16,
  /** 20px モバイル外マージン */
  xl: 20,
  /** 24px */
  "2xl": 24,
  /** 32px セクション間余白 */
  "3xl": 32,
  /** 40px */
  "4xl": 40,
  /** 80px ヒーロー余白 */
  "5xl": 80,
} as const;

export type SpacingKey = keyof typeof spacing;
