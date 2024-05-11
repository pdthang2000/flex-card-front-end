import AppState from '../../App.state';
import { createSelector } from '@reduxjs/toolkit';

export const selectCardState = (state: AppState) => {
  return state.cardState;
};

export const selectCardList = createSelector(selectCardState, (state) =>
  state.cardIds.map((id) => state.cards[id]),
);

export const selectSetInformation = createSelector(
  selectCardState,
  (state) => ({
    setId: state?.setId,
    title: state?.setTitle,
    cardCount: state?.cardCount,
    description: state?.description,
  }),
);

export const selectSetFormObj = createSelector(selectCardState, (state) => {
  const setFormObj: any = {
    title: state?.setTitle,
    cardCount: state?.cardCount,
    description: state?.description,
  };
  state?.cardIds.forEach((id, index) => {
    setFormObj[index] = {
      id,
      back: state.cards[id]?.back,
      front: state.cards[id]?.front,
    };
  });
  return setFormObj;
});

export const selectCardListLoading = createSelector(
  selectCardState,
  (state) => state.loading,
);

export const selectCardListPagination = createSelector(
  selectCardState,
  (state) => state.pagination,
);

export const selectSetId = createSelector(
  selectCardState,
  (state) => state.setId,
);

export const selectNewSetId = createSelector(
  selectCardState,
  (state) => state.newSetId,
);
