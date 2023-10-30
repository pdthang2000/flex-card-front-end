import { Dictionary } from '@reduxjs/toolkit';
import { Sett } from '../../models/Sett';

export class SetState {
  setIds: string[] = [];
  sets: Dictionary<Sett> = {};
  loading = false;
}
