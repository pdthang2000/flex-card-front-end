import AppState from '../../App.state';
import { createSelector } from '@reduxjs/toolkit';

export const selectSetState = (state: AppState) => {
  return state.setState;
};

export const selectSetList = createSelector(selectSetState, (state) =>
  state.setIds.map((id) => state.sets[id]),
);

export const selectSetStateLoading = createSelector(
  selectSetState,
  (state) => state.loading,
);
