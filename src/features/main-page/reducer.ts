import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MainPageState } from './state';
import { IListResponse, IResponse } from '../../models/IResponse';
import { Card } from '../../models/Card';
import { cloneDeep, keyBy } from 'lodash';
import { CardListPayload } from '../../payloads/CardListPayload';
import { Sett } from '../../models/Sett';

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
      state.cardIds = payload.data.list.map((card: Card) => card.id);
      state.cards = keyBy(payload.data.list, 'id');
      state.pagination = payload.data.pagination;
      state.loading = false;
    },
    loadingSet: (state, { payload }: PayloadAction<any>) => {
      state.loading = true;
    },
    loadedSet: (state, { payload }: PayloadAction<IResponse<Sett>>) => {
      state.loading = false;
      state.cards = keyBy(payload.data.cards, 'id');
      state.cardIds = payload.data.cards.map((card: Card) => card.id);
      state.setId = payload.data.id;
      state.setTitle = payload.data.title;
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

export const {
  loadingCardList,
  loadedCardList,
  loadingSet,
  loadedSet,
  updatingCard,
  updatedCard,
} = slices.actions;

const mainPageReducer = slices.reducer;
export default mainPageReducer;
