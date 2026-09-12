import { useMutation, useQueryClient } from "@tanstack/react-query";
import { archivePracticePhrase } from "@/shared/services/storage";
import { showMutationError } from "@/shared/lib/showMutationError";
import { practicePhrasesQueryKey } from "./usePracticePhrases";

/** 練習フレーズをアーカイブする（今日の練習メニューと進捗一覧に表示しない。記録は保持する） */
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
