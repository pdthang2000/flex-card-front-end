import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, api } from "@/lib/api";
import { qk } from "@/lib/queryKeys";
import type { FlashcardListResponse } from "@/types";

export function useListFlashcards(params: { tagNames?: string; page: number; size: number }) {
  const { tagNames, page, size } = params;
  return useQuery({
    queryKey: qk.flashcards({ tagNames, page, size }),
    queryFn: () =>
      get<FlashcardListResponse>("/flashcard", { tagNames, page, size }),
    placeholderData: (prev) => prev, // keepPreviousData
  });
}

export function useCreateFlashcard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { front: string; back: string; tagNames?: string[] }) =>
      api.post("/flashcard", payload).then((r) => r.data),
    onSuccess: () => {
      // Invalidate first page of many lists. Simple & effective.
      qc.invalidateQueries({ queryKey: ["flashcards"] });
    },
  });
}

export function useUpdateFlashcard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string; front: string; back: string; tagNames?: string[] }) =>
      api.patch(`/flashcard/${id}`, payload).then((r) => r.data),
    onSuccess: () => {
      // qc.invalidateQueries({ queryKey: ["flashcards"] });
    },
  });
}

export function useDeleteFlashcard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string }) =>
      api.delete(`/flashcard/${id}`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["flashcards"] });
    },
  });
}
