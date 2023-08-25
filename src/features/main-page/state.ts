import { Dictionary } from '@reduxjs/toolkit';
import { Card } from '../../models/Card';

export class MainPageState {
  ids: string[] = [];
  cards: Dictionary<Card> = {};
  loading = false;
}
