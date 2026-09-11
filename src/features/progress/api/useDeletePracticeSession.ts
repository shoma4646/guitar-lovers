import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePracticeSession } from "@/shared/services/storage";
import { showMutationError } from "@/shared/lib/showMutationError";
import { practiceSessionsQueryKey } from "./usePracticeSessions";

/** 練習セッションをAsyncStorageから削除する */
export function useDeletePracticeSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePracticeSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: practiceSessionsQueryKey });
    },
    onError: showMutationError,
  });
}
