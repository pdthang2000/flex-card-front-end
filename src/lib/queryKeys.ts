export const qk = {
  flashcards: (args: { tagId?: string; page: number; size: number }) =>
    ["flashcards", args] as const,
};