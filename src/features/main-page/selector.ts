import AppState from '../../App.state';
import { createSelector } from '@reduxjs/toolkit';

export const selectMainPageState = (state: AppState) => {
  return state.mainPage;
};

export const selectCardList = createSelector(selectMainPageState, (state) =>
  state.cardIds.map((id) => state.cards[id]),
);

export const selectSetInformation = createSelector(
  selectMainPageState,
  (state) => ({
    id: state.setId,
    title: state.setTitle,
    cardCount: state.cardCount,
    description: state.description,
  }),
);

export const selectSetFormObj = createSelector(selectMainPageState, (state) => {
  const setFormObj: any = {
    id: state.setId,
    title: state.setTitle,
    cardCount: state.cardCount,
    description: state.description,
  };
  state.cardIds.forEach((id, index) => {
    setFormObj[index] = {
      id,
      back: state.cards[id]?.back,
      front: state.cards[id]?.front,
      // orderId: state.cards[id]?.orderId,
    };
  });
  return setFormObj;
});

export const selectCardListLoading = createSelector(
  selectMainPageState,
  (state) => state.loading,
);

export const selectCardListPagination = createSelector(
  selectMainPageState,
  (state) => state.pagination,
);

export const selectSetId = createSelector(
  selectMainPageState,
  (state) => state.setId,
);
