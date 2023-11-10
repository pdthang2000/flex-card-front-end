import { Card } from './Card';

export enum SET_KEYS {
  ID = 'id',
  TITLE = 'title',
  CARDS = 'cards',
  CARD_COUNT = 'cardCount',
  DESCRIPTION = 'description',
}

export const setKeyValues = [...Object.values(SET_KEYS)];

export interface Sett {
  id: string;
  title: string;
  description?: string;
  cards: Card[];
  cardCount: number;
}
