import { useMutation, useQueryClient } from "@tanstack/react-query";
import { archivePracticePhrase } from "@/shared/services/storage";
import { showMutationError } from "@/shared/lib/showMutationError";
import { practicePhrasesQueryKey } from "./usePracticePhrases";

/** 練習フレーズをアーカイブする（今日の練習メニューから除外する） */
export function useArchivePracticePhrase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => archivePracticePhrase(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: practicePhrasesQueryKey });
    },
    onError: showMutationError,
  });
}
