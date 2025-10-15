import type { Tag } from "./Tag";

export type Flashcard = {
  id: string;
  front: string;
  back: string;
  _tags?: Tag[];
  createdAt: string;
};
