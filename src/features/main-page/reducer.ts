import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {MainPageState} from "./state";
import {IResponse} from "../../models/IResponse";
import {Card} from "../../models/Card";
import {keyBy} from "lodash";

const slices = createSlice({
  name: 'MainPage',
  initialState: {...new MainPageState()},
  reducers: {
    loadingCardList: (state, {payload}: PayloadAction<any>) => {
      state.loading = true;
    },
    loadedCardList: (state, {payload}: PayloadAction<IResponse<Card[]>>) => {
      state.ids = payload.data.data.map((card: Card) => card.id);
      state.cards = keyBy(payload.data.data, 'id');
      state.loading = false;
    }
  }
});

export const {
  loadingCardList,
  loadedCardList,
} = slices.actions;

const mainPageReducer = slices.reducer;
export default mainPageReducer;