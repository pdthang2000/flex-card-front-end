export const qk = {
  flashcards: (args: { tagNames?: string; frontContains?: string; backContains?: string; page: number; size: number }) =>
    ["flashcards", args] as const,
  tags: (args: { page: number; size: number; name?: string }) =>
    ["tags", args] as const,
};
