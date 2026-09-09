# guitar_lovers デザインガイド

> **注意（2026-09）**: このドキュメントは旧構成（ダーク配色・4タブ）時点の内容で、現行実装とは一致しない。現行のデザイントークンは `src/shared/theme/`（Modern Guitarist Light / Material 3風）を正本とし、タブ構成は `docs/product-definition.md` に従う。ここに残しているのは生成プロンプトの手順とロゴ素材の参照用。

このドキュメントはClaude Codeが画面実装時に参照するためのデザイン仕様書。Stitch / Gemini / Recraft等で生成したアセットを `screens/` `logo/` に配置し、ここに仕様を記述する。

## ディレクトリ構成

```
docs/design/
├── README.md         # このファイル（仕様書）
├── logo/             # ロゴ・アプリアイコン
│   ├── icon.svg
│   ├── icon-1024.png
│   └── wordmark.svg
└── screens/          # 画面モック（PNG）
    ├── tuner.png
    ├── practice.png
    ├── practice-loop.png      # ABループ操作中
    ├── practice-metronome.png # メトロノーム展開
    ├── history.png
    ├── history-add.png        # 練習記録追加モーダル
    └── news.png
```

## デザインコンセプト

ギター愛好家向けの練習支援アプリ。

- **トーン**: 集中できる / モダン / 音楽的 / 没入感
- **キーワード**: focused, modern, glassmorphism, dark, expressive
- **避けるべき表現**: チープ、過剰装飾、可読性を犠牲にした派手さ

## デザイントークン

### カラーパレット（現在値）

`tailwind.config.js` 準拠。NativeWindクラスとして利用可能。ダークテーマ＋グラスモーフィズム基調。

| 用途 | トークン | HEX | NativeWindクラス |
|------|----------|-----|------------------|
| 背景（メイン） | `bg-dark` | `#0B0F19` | `bg-bg-dark` |
| 背景（カード） | `bg-light-dark` | `#151A26` | `bg-bg-light-dark` |
| 背景（より明るいレイヤー） | `bg-gray` | `#2A3040` | `bg-bg-gray` |
| プライマリ（パープル） | `primary` | `#6C63FF` | `bg-primary` `text-primary` |
| セカンダリ（シアン） | `secondary` | `#00E5FF` | `bg-secondary` `text-secondary` |
| エラー | `error` | `#FF5252` | `text-error` |
| 文字（メイン） | `text-white` | `#FFFFFF` | `text-text-white` |
| 文字（サブ） | `text-gray` | `#8F9BB3` | `text-text-gray` |
| 文字（薄） | `text-light-gray` | `#C5CEE0` | `text-text-light-gray` |
| ガラス枠線 | `glass-border` | `rgba(255,255,255,0.2)` | `border-glass-border` |
| ガラス表面 | `glass-surface` | `rgba(255,255,255,0.1)` | `bg-glass-surface` |

### グラデーション（ガイド）

ヒーローエリア・大きなアクションには下記のグラデーションを使用可。

- **メイン**: `#6C63FF → #00E5FF`（パープル→シアン）
- **アクセント**: `#6C63FF → #B388FF`（パープル→ライトパープル）

NativeWindでは `expo-linear-gradient` を使用。

### タイポグラフィ

| 用途 | サイズ | weight | NativeWind |
|------|--------|--------|------------|
| Display（チューナーの音名等） | 64 | 700 | `text-6xl font-bold` |
| H1（画面タイトル） | 28 | 700 | `text-3xl font-bold text-text-white` |
| H2（セクション） | 22 | 600 | `text-2xl font-semibold` |
| H3（カード見出し） | 18 | 600 | `text-lg font-semibold` |
| Body | 16 | 400 | `text-base text-text-light-gray` |
| Caption | 13 | 400 | `text-sm text-text-gray` |
| Mono（コード/数値） | 14 | 500 | `text-sm font-mono` |

### Spacing

- 画面外周padding: `px-4` (16px)
- カード間: `gap-3` (12px)
- セクション間: `gap-6` (24px)

### Border Radius

- カード: `rounded-2xl` (16px)
- ボタン: `rounded-xl` (12px)
- ピル/タグ: `rounded-full`
- グラスカード: `rounded-3xl` (24px)

### グラスモーフィズム指定

カード使用時の標準スタイル:

```tsx
className="bg-glass-surface border border-glass-border
           rounded-2xl backdrop-blur-md"
```

## 画面リスト

各画面の実装ファイルパスとモック画像の対応。

| 画面 | 実装ファイル | モック | 状態 |
|------|--------------|--------|------|
| チューナー | `src/features/tuner/screens/TunerScreen.tsx` | `screens/tuner.png` | TODO |
| 練習（YouTube＋AB＋メトロノーム） | `src/features/practice/screens/PracticeScreen.tsx` | `screens/practice.png` | TODO |
| 練習（ABループ操作中） | 同上 | `screens/practice-loop.png` | TODO |
| 練習（メトロノーム展開） | 同上 | `screens/practice-metronome.png` | TODO |
| 履歴（統計＋週次バー） | `src/features/history/screens/HistoryScreen.tsx` | `screens/history.png` | TODO |
| 履歴（追加モーダル） | 同上 | `screens/history-add.png` | TODO |
| ニュース | `src/features/news/screens/NewsScreen.tsx` | `screens/news.png` | TODO |

モック画像を `screens/` に配置したら「TODO」を「READY」に更新。

ルーティング側（`src/app/(tabs)/*.tsx`）はscreenをimportするだけの薄い層なので、UI調整は `features/<name>/screens/` 配下を編集。

## 生成プロンプト

### ロゴ・アプリアイコン

#### Gemini / ChatGPT 用（コンセプト出し）

```
Minimal mobile app icon for "guitar lovers" — a guitar practice app.
Stylized abstract guitar element (headstock silhouette, single
vibrating string, or sound wave). Purple #6C63FF to cyan #00E5FF
gradient. Dark navy background #0B0F19. Modern glassmorphism feel,
flat with subtle depth, rounded corners, no text, centered.
Sophisticated, focused, music-tech aesthetic.
```

調整パターン:
- 「ヘッドストックモチーフ版」/「弦/サウンドウェーブ版」
- 「グラデーションを抑えて単色版も」
- 「より幾何学的に」/「よりオーガニックに」

#### Recraft 用（SVG化）

気に入った1枚を「Image to Vector」で取り込み、SVGエクスポート。

### 画面UIモック（Stitch）

[stitch.withgoogle.com](https://stitch.withgoogle.com) で以下を共通プレフィックスとして使用。

#### 共通スタイル指定

```
Style: dark mode glassmorphism, modern music app UI.
Background navy #0B0F19, card surface rgba(255,255,255,0.1)
with backdrop blur and 1px white/20% border.
Primary purple #6C63FF, secondary cyan #00E5FF, gradient accents.
Text white #FFFFFF and light gray #C5CEE0. Rounded cards (16-24px),
generous whitespace, focused and immersive.
Bottom tab navigation with 4 tabs.
```

#### 画面別プロンプト

**チューナー**
```
[共通スタイル]
Screen: guitar tuner.
- Top: tuning preset selector (e.g., "Standard E", chevron to switch)
- Center: huge note display "E" (96pt+, gradient text purple-cyan)
- Below note: cents indicator (-50 to +50) with horizontal bar
- 6 string buttons in a row at bottom of center area (E A D G B E)
- Status text: "In tune" / "Sharp" / "Flat" with color
- Demo mode badge (subtle, top-right)
```

**練習（YouTube＋AB＋メトロノーム）**
```
[共通スタイル]
Screen: practice with YouTube video.
- Top: YouTube video player (16:9, rounded corners)
- Below: AB loop controls — A marker time, B marker time,
  loop toggle button, "Set A" / "Set B" buttons
- Playback controls: speed (0.5x-1.5x), restart loop
- Metronome strip: BPM display, tap-tempo, on/off toggle,
  expand-to-full-metronome button
- Bookmarks list: saved positions in current video (chips)
- Bottom: favorites & presets quick access
```

**履歴**
```
[共通スタイル]
Screen: practice history with stats.
- Top stat cards (3 in a row): total time, streak, sessions this week
- Weekly bar chart: 7 days, gradient bars purple-cyan
- Recent sessions list: date, duration, song/preset, tags
- FAB bottom-right: "+ Add session" with gradient
- Share button in header
```

**履歴 - 追加モーダル**
```
[共通スタイル]
Modal sheet from bottom: add practice session.
- Title "Log practice"
- Date picker (today by default)
- Duration input (minutes, large numeric)
- Song / preset selector (chips, multi-select)
- Optional notes (multiline)
- Cancel / Save buttons (Save uses gradient)
```

**ニュース**
```
[共通スタイル]
Screen: guitar-related news feed.
- Top: search bar + category chips
- Card list: each with thumbnail (left), title (bold),
  source + date (caption), 2-line preview
- Pull-to-refresh indicator (gradient spinner)
```

## モック画像の取り扱い注意

Stitchで生成した画面モックには以下が混入することがあるが、**実装では無視する**:

- **モック内のロゴ画像** — Stitchが自動生成したものであり、本物のロゴではない。
  正規のロゴは `docs/design/logo/icon.svg` を使用。
- **英語のUI文言** — レイアウト確認用。実装は日本語に置き換える。
- **ダミーのデータ** — レイアウト確認用。

参照すべきは「**レイアウト構造・spacing・配色・コンポーネント配置**」のみ。

## アセット配置後のClaude Codeへの指示例

```
docs/design/screens/practice.png を参考に、
src/features/practice/screens/PracticeScreen.tsx を再実装してください。

- カラートークンは docs/design/README.md の定義に従う
- NativeWindクラスを使用
- ロゴは docs/design/logo/icon.svg を使用（モック内のロゴは無視）
- UI文言は日本語で実装（モック内の英語は参考のみ）
- 既存のhooks (useQuery, AsyncStorageアクセス) と
  Zustandストアの呼び出しは維持
```

## 更新履歴

- 2026-04-30: 初版作成
