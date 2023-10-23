import { Dictionary } from '@reduxjs/toolkit';
import { Card } from '../../models/Card';
import { PaginationObject } from '../../models/PaginationObject';

export class MainPageState {
  cardIds: string[] = [];
  cards: Dictionary<Card> = {};
  loading = false;
  setId = '';
  setTitle = '';
  pagination: PaginationObject = {};
}
