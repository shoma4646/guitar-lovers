import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePracticePhrase } from "@/shared/services/storage";
import { practicePhrasesQueryKey } from "./usePracticePhrases";

/** 練習フレーズをAsyncStorageから削除する */
export function useDeletePracticePhrase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePracticePhrase(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: practicePhrasesQueryKey });
    },
  });
}
