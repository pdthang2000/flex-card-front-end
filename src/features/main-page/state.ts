import { Dictionary } from '@reduxjs/toolkit';
import { Card } from '../../models/Card';
import { PaginationObject } from '../../models/PaginationObject';

export class MainPageState {
  ids: string[] = [];
  cards: Dictionary<Card> = {};
  loading = false;
  pagination: PaginationObject = {};
}
