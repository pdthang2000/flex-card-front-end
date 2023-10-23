import { createSlice } from '@reduxjs/toolkit';
import { SetState } from './state';

const slices = createSlice({
  name: 'Set',
  initialState: { ...new SetState() },
  reducers: {},
});

const setReducer = slices.reducer;
export default setReducer;
