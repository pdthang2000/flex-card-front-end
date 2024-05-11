import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CardState } from './state';
import { IListResponse, IResponse } from '../../models/IResponse';
import { Card } from '../../models/Card';
import { keyBy } from 'lodash';
import { CardListPayload } from '../../payloads/CardListPayload';
import { setKeyValues, Sett } from '../../models/Sett';
import { toast } from 'react-toastify';
import { globalNavigate } from '../../App';
import { RouterNames } from '../../enums/router';
const transformToCardsData = (payload: any) => {
  payload.cards = Object.keys(payload)
    .filter((key: any) => !setKeyValues.includes(key))
    .map((key) => {
      const item = payload[key] ?? {};
      item.front = item?.front ?? '';
      item.back = item?.back ?? '';
      return item;
    });

  Object.keys(payload)
    .filter((key: any) => !setKeyValues.includes(key))
    .forEach((key) => {
      delete payload[key];
    });

  return payload;
};

const slices = createSlice({
  name: 'Cards',
  initialState: { ...new CardState() },
  reducers: {
    clearSetState: (state) => {
      delete state.setTitle;
      delete state.description;
      state.cards = {};
      delete state.cardCount;
      state.cardIds = [];
    },
    loadingCardList: (state, { payload }: PayloadAction<CardListPayload>) => {
      state.loading = true;
    },
    loadedCardList: (
      state,
      { payload }: PayloadAction<IListResponse<Card[]>>,
    ) => {
      state.pagination = payload.data.pagination;
      state.cards = keyBy(payload.data.list, 'id');
      state.cardIds = payload.data.list.map((card: Card) => card.id);
      state.loading = false;
    },
    loadingSet: (state, { payload }: PayloadAction<any>) => {
      state.loading = true;
    },
    loadedSet: (state, { payload }: PayloadAction<IResponse<Sett>>) => {
      state.setId = payload.data.id;
      state.setTitle = payload.data.title;
      state.description = payload.data.description;
      state.cards = keyBy(payload.data.cards, 'id');
      state.cardCount = payload.data.cardCount;
      state.cardIds = payload.data.cards.map((card: Card) => card.id);
      state.loading = false;
    },
    removeNewSetId: (state) => {
      state.newSetId = undefined;
    },
    creatingSet: (state, { payload }: PayloadAction<any>) => {
      state.loading = true;
      payload = transformToCardsData(payload);
    },
    createdSet: (state, { payload }: PayloadAction<IResponse<Sett>>) => {
      state.loading = false;
      state.newSetId = payload.data.id;
    },
    updatingSet: (state, { payload }: PayloadAction<any>) => {
      state.loading = true;
      payload = transformToCardsData(payload);
    },
    updatedSet: (state, { payload }: PayloadAction<IResponse<Sett>>) => {
      state.loading = false;
    },
    deletingSet: (state, { payload }: PayloadAction<any>) => {
      state.loading = true;
    },
    deletedSet: (state, { payload }: PayloadAction<any>) => {
      state.loading = false;
      toast('🦄 Wow so easy!', {
        position: 'top-left',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
      });
      globalNavigate(`/${RouterNames.SETS}`);
    },
    updatingCard: (state, { payload }: PayloadAction<Card>) => {
      console.log();
    },
    updatedCard: (state, { payload }: PayloadAction<IResponse<Card>>) => {
      state.cards[payload.data.id] = payload.data;
    },
    shufflingCardList: (state) => {
      state.cardIds.sort(() => Math.random() - 0.5);
    },
    unShufflingCardList: (state) => {
      state.cardIds = Object.keys(state.cards);
    },
  },
});

export const {
  clearSetState,
  loadingCardList,
  loadedCardList,
  loadingSet,
  loadedSet,
  removeNewSetId,
  creatingSet,
  createdSet,
  updatingSet,
  updatedSet,
  deletingSet,
  deletedSet,
  updatingCard,
  updatedCard,
  shufflingCardList,
  unShufflingCardList,
} = slices.actions;

const cardReducer = slices.reducer;
export default cardReducer;
