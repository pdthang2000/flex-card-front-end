export type ApiStatus = "SUCCESS" | "FAILED";

export type PaginatedResult<T> = {
  pagination: { page: number; size: number; total: number };
  items: T[];
};

export type Tag = {
  id: string;
  name: string;
};

export type Flashcard = {
  id: string;
  front: string;
  back: string;
  tags: Tag[];
  createdAt: string;
};

export type FlashcardListResponse = {
  data: PaginatedResult<Flashcard>;
  status: ApiStatus;
};

export type TagListResponse = {
  data: PaginatedResult<Tag>;
  status: ApiStatus;
};
