import type { Flashcard } from "@/entities/Flashcard";
import type { Tag } from "@/entities/Tag";

export type ApiStatus = "SUCCESS" | "FAILED";

export type PaginatedResult<T> = {
  pagination: { page: number; size: number; total: number };
  items: T[];
};

export type { Flashcard } from "@/entities/Flashcard";
export type { Tag } from "@/entities/Tag";

export type FlashcardListResponse = {
  data: PaginatedResult<Flashcard>;
  status: ApiStatus;
};

export type TagListResponse = {
  data: PaginatedResult<Tag>;
  status: ApiStatus;
};
