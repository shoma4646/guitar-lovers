import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePracticePhrase } from "@/shared/services/storage";
import type { PracticePhrase } from "@/shared/types/models";
import { showMutationError } from "@/shared/lib/showMutationError";
import { practicePhrasesQueryKey } from "./usePracticePhrases";

type UpdateArgs = {
  id: string;
  patch: Partial<Omit<PracticePhrase, "id">>;
};

/** 練習フレーズの一部フィールドを更新する */
export function useUpdatePracticePhrase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: UpdateArgs) => updatePracticePhrase(id, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: practicePhrasesQueryKey });
    },
    onError: showMutationError,
  });
}
