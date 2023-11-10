import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SetState } from './state';
import { setKeyValues, Sett } from '../../models/Sett';
import { IListResponse, IResponse } from '../../models/IResponse';
import { keyBy } from 'lodash';
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
  name: 'Set',
  initialState: { ...new SetState() },
  reducers: {
    loadingSetList: (state, { payload }: PayloadAction<any>) => {
      state.loading = true;
    },
    loadedSetList: (
      state,
      { payload }: PayloadAction<IListResponse<Sett[]>>,
    ) => {
      state.loading = false;
      state.sets = keyBy(payload.data.list, 'id');
      state.setIds = payload.data.list.map((set: Sett) => set.id);
    },
    creatingSet: (state, { payload }: PayloadAction<any>) => {
      state.loading = true;
      payload = transformToCardsData(payload);
    },
    createdSet: (state, { payload }: PayloadAction<IResponse<Sett>>) => {
      state.loading = false;
    },
    updatingSet: (state, { payload }: PayloadAction<any>) => {
      state.loading = true;
      payload = transformToCardsData(payload);
    },
    updatedSet: (state, { payload }: PayloadAction<IResponse<Sett>>) => {
      state.loading = false;
    },
  },
});

export const {
  loadingSetList,
  loadedSetList,
  creatingSet,
  createdSet,
  updatedSet,
  updatingSet,
} = slices.actions;

const setReducer = slices.reducer;
export default setReducer;
