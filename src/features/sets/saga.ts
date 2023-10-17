import { all, call, put, takeLeading } from 'redux-saga/effects';
import { loadedSet, loadingSet } from './reducer';
import { DefaultIResponse } from '../../models/IResponse';
import setService from './service';

const sagas = [
  takeLeading(loadingSet, function* ({ payload }) {
    // const loading: boolean = yield select(selectCardListLoading);
    // if (!loading) return;
    try {
      const response: DefaultIResponse<any> = yield call(
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
