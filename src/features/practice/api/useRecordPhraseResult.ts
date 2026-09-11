import { useMutation, useQueryClient } from "@tanstack/react-query";
import { recordPhraseResult } from "@/shared/services/storage";
import type { PhraseAttempt } from "@/shared/types/models";
import { showMutationError } from "@/shared/lib/showMutationError";
import { phraseAttemptsQueryKey } from "./usePhraseAttempts";
import { practicePhrasesQueryKey } from "./usePracticePhrases";

/** フレーズ練習の結果を記録し、弾けた場合はフレーズの到達BPMも更新する */
export function useRecordPhraseResult() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (attempt: PhraseAttempt) => recordPhraseResult(attempt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: phraseAttemptsQueryKey });
      queryClient.invalidateQueries({ queryKey: practicePhrasesQueryKey });
    },
    onError: showMutationError,
  });
}
