import { Dictionary } from '@reduxjs/toolkit';
import { Card } from '../../models/Card';

export class SetState {
  cardIds: string[] = [];
  cards: Dictionary<Card> = {};
  loading = false;
  setId = '';
}
