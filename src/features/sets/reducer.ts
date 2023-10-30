import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SetState } from './state';
import { Sett } from '../../models/Sett';
import { IListResponse } from '../../models/IResponse';
import { keyBy } from 'lodash';

const slices = createSlice({
  name: 'Set',
  initialState: { ...new SetState() },
  reducers: {
    loadingSetList: (state, { payload }: PayloadAction<any>) => {
      console.log();
    },
    loadedSetList: (
      state,
      { payload }: PayloadAction<IListResponse<Sett[]>>,
    ) => {
      state.sets = keyBy(payload.data.list, 'id');
      state.setIds = payload.data.list.map((set: Sett) => set.id);
    },
  },
});

export const { loadingSetList, loadedSetList } = slices.actions;

const setReducer = slices.reducer;
export default setReducer;
