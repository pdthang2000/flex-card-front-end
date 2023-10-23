import { all, call, put, takeLeading } from 'redux-saga/effects';
import { DefaultIResponse } from '../../models/IResponse';
import setService from './service';
import { loadedSet, loadingSet } from '../main-page/reducer';
import { Sett } from '../../models/Sett';

const sagas = [
  takeLeading(loadingSet, function* ({ payload }) {
    try {
      const response: DefaultIResponse<Sett> = yield call(
        setService.getSet,
        payload,
      );
      yield put(loadedSet(response.data));
    } catch (e) {
      console.log(e);
    }
  }),
];

function* setSagas() {
  yield all(sagas);
}

export default setSagas;
