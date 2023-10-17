import AppState from '../../App.state';
import { createSelector } from '@reduxjs/toolkit';

export const selectSetState = (state: AppState) => {
  return state.set;
};

export const selectCardsInSet = createSelector(selectSetState, (state) =>
  state.cardIds.map((id) => state.cards[id]),
);
