import { useQuery } from "@tanstack/react-query";
import { getPracticePhrases } from "@/shared/services/storage";
import type { PracticePhrase } from "@/shared/types/models";

export const practicePhrasesQueryKey = ["practice", "phrases"] as const;

/** 練習フレーズ一覧をAsyncStorageから取得する */
export function usePracticePhrases() {
  return useQuery<PracticePhrase[]>({
    queryKey: practicePhrasesQueryKey,
    queryFn: getPracticePhrases,
  });
}
