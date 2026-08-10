/**
 * カラーパレット定義（Modern Guitarist Light テーマ）
 *
 * Stitch DESIGN.md（modern_guitarist）準拠の Material Design 3 風トークンを基盤に、
 * 既存コードで使われている短名トークンをエイリアスとして残して互換を維持する。
 *
 * - 新コードは Stitch トークン名（`surface`, `surfaceContainer`, `primary`, `primaryContainer`,
 *   `secondary`, `tertiary`, `onSurface`, `outline` など）を使う。
 * - NativeWind 側からは `tailwind.config.js` 経由で `bg-surface`, `text-on-surface`,
 *   `bg-primary-container` のようなケバブ名のクラスとして利用する。
 */

// ===== Surface（背景階調） =====

/** ページ最下層の背景（warm off-white） */
const surface = "#fff8f7";
/** 暗めサーフェス（dark mode 寄り） */
const surfaceDim = "#edd5d1";
/** 明るめサーフェス */
const surfaceBright = "#fff8f7";
/** 純白のカード背景（Level 1 浮き） */
const surfaceContainerLowest = "#ffffff";
/** 控えめなカード背景 */
const surfaceContainerLow = "#fff0ee";
/** カード背景（標準） */
const surfaceContainer = "#ffe9e6";
/** 強調カード背景 */
const surfaceContainerHigh = "#fce3df";
/** 最強調カード背景 */
const surfaceContainerHighest = "#f6ddda";
/** 反転サーフェス（ダーク） */
const inverseSurface = "#3c2d2b";
/** 反転サーフェス上のテキスト */
const inverseOnSurface = "#ffedea";
/** サーフェス着色用ベース */
const surfaceTint = "#ae3026";
/** サーフェスバリアント（旧UIのグレー領域に相当） */
const surfaceVariant = "#f6ddda";

// ===== On Surface（テキスト/前景） =====

/** メインテキスト（near-black warm） */
const onSurface = "#251817";
/** 補助テキスト（warm gray） */
const onSurfaceVariant = "#59413e";
/** 背景色（background = surface と同値） */
const background = "#fff8f7";
/** 背景上のテキスト */
const onBackground = "#251817";

// ===== Primary（Coral / ブランドカラー） =====

/** 最重要アクション（Start Lesson, Tune） */
const primary = "#ae3026";
/** Primary 上のテキスト */
const onPrimary = "#ffffff";
/** 強調背景（明るめのコーラル） */
const primaryContainer = "#ff6b5b";
/** Primary container 上のテキスト */
const onPrimaryContainer = "#6d0003";
/** 反転Primary（ダーク時） */
const inversePrimary = "#ffb4aa";
const primaryFixed = "#ffdad5";
const primaryFixedDim = "#ffb4aa";
const onPrimaryFixed = "#410001";
const onPrimaryFixedVariant = "#8c1712";

// ===== Secondary（Amber / 進捗・ストリーク） =====

const secondary = "#855300";
const onSecondary = "#ffffff";
const secondaryContainer = "#fea619";
const onSecondaryContainer = "#684000";
const secondaryFixed = "#ffddb8";
const secondaryFixedDim = "#ffb95f";
const onSecondaryFixed = "#2a1700";
const onSecondaryFixedVariant = "#653e00";

// ===== Tertiary（Green / 成功・サクセスメトリクス） =====

const tertiary = "#006b57";
const onTertiary = "#ffffff";
const tertiaryContainer = "#00af8f";
const onTertiaryContainer = "#003a2e";
const tertiaryFixed = "#74f9d5";
const tertiaryFixedDim = "#54dcba";
const onTertiaryFixed = "#002019";
const onTertiaryFixedVariant = "#005141";

// ===== Error =====

const error = "#ba1a1a";
const onError = "#ffffff";
const errorContainer = "#ffdad6";
const onErrorContainer = "#93000a";

// ===== Outline（罫線・ヘアライン） =====

/** 標準のアウトライン */
const outline = "#8c716d";
/** ヘアライン罫線（最薄） */
const outlineVariant = "#e0bfba";

// ===== ユーティリティ色（M3 外、ステータス系） =====

/** チューニング合致・ストリーク達成（emerald） */
const success = "#10B981";
/** 警告・シャープ寄り（M3のerrorで代用される箇所もあるが意味分離） */
const danger = error;
/** 情報・フラット寄り */
const info = "#2979FF";

export const colors = {
  // ===== M3 風 Stitch トークン（新規・camelCase） =====
  surface,
  surfaceDim,
  surfaceBright,
  surfaceContainerLowest,
  surfaceContainerLow,
  surfaceContainer,
  surfaceContainerHigh,
  surfaceContainerHighest,
  inverseSurface,
  inverseOnSurface,
  surfaceTint,
  surfaceVariant,

  onSurface,
  onSurfaceVariant,
  background,
  onBackground,

  primary,
  onPrimary,
  primaryContainer,
  onPrimaryContainer,
  inversePrimary,
  primaryFixed,
  primaryFixedDim,
  onPrimaryFixed,
  onPrimaryFixedVariant,

  secondary,
  onSecondary,
  secondaryContainer,
  onSecondaryContainer,
  secondaryFixed,
  secondaryFixedDim,
  onSecondaryFixed,
  onSecondaryFixedVariant,

  tertiary,
  onTertiary,
  tertiaryContainer,
  onTertiaryContainer,
  tertiaryFixed,
  tertiaryFixedDim,
  onTertiaryFixed,
  onTertiaryFixedVariant,

  error,
  onError,
  errorContainer,
  onErrorContainer,

  outline,
  outlineVariant,

  success,
  danger,
  info,

  // ===== 既存コード互換エイリアス =====

  /** @deprecated 新コードでは `surface` を使う */
  surfaceCard: surfaceContainerLowest,
  /** @deprecated 新コードでは `surfaceContainerLow` を使う */
  surfaceMuted: surfaceContainerLow,
  /** @deprecated ダークアクセントは `inverseSurface` を使う */
  surfaceDark: inverseSurface,

  /** @deprecated 新コードでは `primary` を使う */
  brand: primary,
  /** @deprecated 新コードでは `primaryContainer` または `primary` の薄色を使う */
  brandSoft: primaryContainer,
  /** @deprecated 新コードでは `onPrimaryContainer` を使う */
  brandStrong: onPrimaryContainer,

  /** @deprecated 新コードでは `onSurface` を使う */
  textPrimary: onSurface,
  /** @deprecated 新コードでは `onSurfaceVariant` を使う */
  textMuted: onSurfaceVariant,
  /** @deprecated 新コードでは `onPrimary` を使う */
  textOnBrand: onPrimary,
  /** @deprecated 新コードでは `inverseOnSurface` を使う */
  textOnDark: inverseOnSurface,

  /** @deprecated 新コードでは `outlineVariant` を使う */
  border: outlineVariant,

  // ===== Phase A 旧互換（さらに古い） =====

  /** @deprecated 新コードでは `surface` を使う */
  bgDark: surface,
  /** @deprecated 新コードでは `surfaceContainerLowest` を使う */
  bgLightDark: surfaceContainerLowest,
  /** @deprecated 新コードでは `surfaceContainerLow` を使う */
  bgGray: surfaceContainerLow,
  /** @deprecated 新コードでは `onSurface` または `onPrimary` を使う */
  textWhite: onSurface,
  /** @deprecated 新コードでは `onSurfaceVariant` を使う */
  textGray: onSurfaceVariant,
  /** @deprecated 新コードでは `success` を使う */
  tuned: success,
  /** @deprecated フラット表示は `info` を使う */
  flat: info,
  /** @deprecated シャープ表示は `danger` を使う */
  sharp: danger,
} as const;

export type ColorKey = keyof typeof colors;
