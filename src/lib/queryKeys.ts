export const qk = {
  flashcards: (args: { tagNames?: string; page: number; size: number }) =>
    ["flashcards", args] as const,
};