import AppState from '../../App.state';

export const selectSetState = (state: AppState) => {
  return state.set;
};
