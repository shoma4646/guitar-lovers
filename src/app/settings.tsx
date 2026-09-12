/**
 * 設定画面ルート（モーダル表示）
 *
 * _layout.tsxのStack定義を変更せず、この画面自身でmodal表示を宣言する。
 */

import { Stack } from "expo-router";
import { SettingsScreen } from "@/features/settings/screens/SettingsScreen";

export default function Settings() {
  return (
    <>
      <Stack.Screen options={{ presentation: "modal", headerShown: false }} />
      <SettingsScreen />
    </>
  );
}
