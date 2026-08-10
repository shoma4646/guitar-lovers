/**
 * デザイントークンの集約エクスポート
 *
 * Stitch DESIGN.md（modern_guitarist）準拠の Modern Light テーマ。
 *
 * - 色（`colors`）と Typography（`textStyles`）は Stitch トークン名で展開しており、
 *   StyleSheet からも NativeWind 経由でも同じ命名で使える。
 * - `spacing` / `radius` の StyleSheet 用キーは旧名を維持。
 *   Stitch 名（`base`, `margin-mobile` 等）は `tailwind.config.js` 側にのみ展開される。
 */

export { colors, type ColorKey } from "./colors";
export {
  fontFamily,
  textStyles,
  fontSize,
  fontWeight,
  type FontFamilyKey,
  type TextStyleKey,
  type FontSizeKey,
  type FontWeightKey,
} from "./typography";
export { spacing, type SpacingKey } from "./spacing";
export { radius, type RadiusKey } from "./radius";
export { shadows, type ShadowKey } from "./shadows";
