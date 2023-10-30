import { all, call, put, takeLeading } from 'redux-saga/effects';
import { DefaultIListResponse, DefaultIResponse } from '../../models/IResponse';
import setService from './service';
import { loadedSet, loadingSet } from '../main-page/reducer';
import { Sett } from '../../models/Sett';
import { loadedSetList, loadingSetList } from './reducer';

const sagas = [
  takeLeading(loadingSet, function* ({ payload }) {
    try {
      const response: DefaultIResponse<Sett> = yield call(
        setService.get,
        payload,
      );
      yield put(loadedSet(response.data));
    } catch (e) {
      console.log(e);
    }
  }),
  takeLeading(loadingSetList, function* ({ payload }) {
    try {
      const response: DefaultIListResponse<Sett> = yield call(
        setService.list,
        payload,
      );
      yield put(loadedSetList(response.data));
    } catch (e) {
      console.log(e);
    }
  }),
];

function* setSagas() {
  yield all(sagas);
}

export default setSagas;
