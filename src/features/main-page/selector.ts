import AppState from "../../App.state";
import {createSelector} from "@reduxjs/toolkit";


export const selectCategoryState = (state: AppState) => {
  console.log('mainPage: ', state);
  return state.mainPage;
}

export const selectCardList = createSelector(
  selectCategoryState,
  state => state.ids.map(id => state.cards[id])
)

export const selectCardListLoading = createSelector(
  selectCategoryState,
  state => state.loading,
)
