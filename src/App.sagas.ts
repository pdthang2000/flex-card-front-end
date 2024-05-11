import { all } from 'redux-saga/effects';
import mainPageSagas from './features/cards/saga';
import setSagas from './features/sets/saga';

function* AppSagas() {
  yield all([mainPageSagas(), setSagas()]);
}

export default AppSagas;
