/**
 * シャドウトークン（iOS/Android 両対応）
 *
 * Stitch DESIGN.md の Elevation 体系:
 * - Level 0: フラット（背景）
 * - Level 1 (layered): カード `0 4px 12px rgba(0,0,0,0.03), 0 1px 2px rgba(0,0,0,0.02)`
 * - Level 2 (elevated): モーダル `0 12px 32px rgba(0,0,0,0.08)`
 *
 * RN の StyleSheet は 1 つの shadow しか取れないため、layered は主要レイヤーのみを採用。
 */

export const shadows = {
  /** Level 1 — カード（layered shadow の主要層を採用） */
  layered: {
    shadowColor: "#000",
    shadowOpacity: 0.04, // 0.03 + 0.02 を合成した近似
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  /** Level 2 — モーダル・ドロップダウン */
  elevated: {
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },

  // ===== 旧トークン互換 =====

  /** @deprecated 新コードでは `layered` を使う */
  sm: {
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  /** @deprecated 新コードでは `layered` を使う */
  md: {
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  /** @deprecated 新コードでは `elevated` を使う */
  lg: {
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
} as const;

export type ShadowKey = keyof typeof shadows;
