import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SetState } from './state';
import { IResponse } from '../../models/IResponse';
import { Card } from '../../models/Card';
import { cloneDeep, keyBy } from 'lodash';

const slices = createSlice({
  name: 'Set',
  initialState: { ...new SetState() },
  reducers: {
    loadingSet: (state, { payload }: PayloadAction<any>) => {
      state.loading = true;
    },
    loadedSet: (state, { payload }: PayloadAction<IResponse<any>>) => {
      state.loading = false;
      state.cards = keyBy(payload.data, 'id');
      state.cardIds = payload.data.map((card: Card) => card.id);
    },
    updatingCard: (state, { payload }: PayloadAction<Card>) => {
      console.log();
    },
    updatedCard: (state, { payload }: PayloadAction<IResponse<Card>>) => {
      const newCards = cloneDeep(state.cards);
      newCards[payload.data.id] = payload.data;
      state.cards = newCards;
    },
  },
});

export const { loadingSet, loadedSet, updatingCard, updatedCard } =
  slices.actions;

const setReducer = slices.reducer;
export default setReducer;
