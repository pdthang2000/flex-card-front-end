import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MainPageState } from './state';
import { IListResponse } from '../../models/IResponse';
import { Card } from '../../models/Card';
import { keyBy } from 'lodash';
import { CardListPayload } from '../../payloads/CardListPayload';

const slices = createSlice({
  name: 'MainPage',
  initialState: { ...new MainPageState() },
  reducers: {
    loadingCardList: (state, { payload }: PayloadAction<CardListPayload>) => {
      state.loading = true;
    },
    loadedCardList: (
      state,
      { payload }: PayloadAction<IListResponse<Card[]>>,
    ) => {
      state.ids = payload.data.list.map((card: Card) => card.id);
      state.cards = keyBy(payload.data.list, 'id');
      state.pagination = payload.data.pagination;
      state.loading = false;
    },
  },
});

export const { loadingCardList, loadedCardList } = slices.actions;

const mainPageReducer = slices.reducer;
export default mainPageReducer;
