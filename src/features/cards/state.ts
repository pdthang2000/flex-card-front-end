import { Dictionary } from '@reduxjs/toolkit';
import { Card } from '../../models/Card';
import { PaginationObject } from '../../models/PaginationObject';

export class CardState {
  cardIds: string[] = [];
  cards: Dictionary<Card> = {};
  cardCount? = 0;
  loading = false;
  setId? = '';
  newSetId? = '';
  setTitle? = '';
  description? = '';
  pagination: PaginationObject = {};
}
