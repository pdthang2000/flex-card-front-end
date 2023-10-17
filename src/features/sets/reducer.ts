import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SetState } from './state';
import { IResponse } from '../../models/IResponse';
import { Card } from '../../models/Card';
import { keyBy } from 'lodash';

const slices = createSlice({
  name: 'MainPage',
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
  },
});

export const { loadingSet, loadedSet } = slices.actions;

const setReducer = slices.reducer;
export default setReducer;
