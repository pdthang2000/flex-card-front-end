import { Dictionary } from '@reduxjs/toolkit';
import { Card } from '../../models/Card';
import { PaginationObject } from '../../models/PaginationObject';

export class MainPageState {
  cardIds: string[] = [];
  cards: Dictionary<Card> = {};
  cardCount = 0;
  loading = false;
  setId = '';
  setTitle = '';
  description = '';
  pagination: PaginationObject = {};
}
