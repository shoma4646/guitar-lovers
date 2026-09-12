import { Alert } from "react-native";

/** mutation失敗時の共通エラーハンドラ。ユーザーへ通知しコンソールへ記録する */
export function showMutationError(error: unknown): void {
  Alert.alert(
    "保存に失敗しました",
    "端末の空き容量やストレージの状態を確認してください"
  );
  console.error("[mutation]", error);
}
