/**
 * アプリエントリポイント
 * 起動時に練習タブへ即座にリダイレクトする
 */

import { Redirect } from "expo-router";

/**
 * インデックスコンポーネント
 * アプリ起動時にデフォルトタブ（練習）へ遷移する
 */
export default function Index() {
  return <Redirect href={{ pathname: "/(tabs)/practice" }} />;
}
