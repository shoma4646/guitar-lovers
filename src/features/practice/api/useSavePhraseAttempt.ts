import { useMutation, useQueryClient } from "@tanstack/react-query";
import { savePhraseAttempt } from "@/shared/services/storage";
import type { PhraseAttempt } from "@/shared/types/models";
import { phraseAttemptsQueryKey } from "./usePhraseAttempts";

/** フレーズ練習結果をAsyncStorageに保存する */
export function useSavePhraseAttempt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (attempt: PhraseAttempt) => savePhraseAttempt(attempt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: phraseAttemptsQueryKey });
    },
  });
}
