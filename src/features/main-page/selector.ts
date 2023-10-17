import AppState from '../../App.state';
import { createSelector } from '@reduxjs/toolkit';

export const selectMainPageState = (state: AppState) => {
  return state.mainPage;
};

export const selectCardList = createSelector(selectMainPageState, (state) =>
  state.ids.map((id) => state.cards[id]),
);

export const selectCardListLoading = createSelector(
  selectMainPageState,
  (state) => state.loading,
);

export const selectCardListPagination = createSelector(
  selectMainPageState,
  (state) => state.pagination,
);
