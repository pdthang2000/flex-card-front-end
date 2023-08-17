import {all} from 'redux-saga/effects';
import mainPageSagas from "./features/main-page/saga";

function* AppSagas() {
    yield all([
      mainPageSagas(),
    ]);
}

export default AppSagas;
