import { useQuery } from "@tanstack/react-query";
import { getPhraseAttempts } from "@/shared/services/storage";
import type { PhraseAttempt } from "@/shared/types/models";

export const phraseAttemptsQueryKey = ["practice", "phraseAttempts"] as const;

/** 全フレーズ練習結果をAsyncStorageから取得する */
export function usePhraseAttempts() {
  return useQuery<PhraseAttempt[]>({
    queryKey: phraseAttemptsQueryKey,
    queryFn: getPhraseAttempts,
  });
}
