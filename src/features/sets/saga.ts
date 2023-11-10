import { all, call, put, takeLeading } from 'redux-saga/effects';
import { DefaultIListResponse, DefaultIResponse } from '../../models/IResponse';
import setService from './service';
import { loadedSet, loadingSet } from '../main-page/reducer';
import { Sett } from '../../models/Sett';
import {
  createdSet,
  creatingSet,
  loadedSetList,
  loadingSetList,
  updatedSet,
  updatingSet,
} from './reducer';

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
    } catch (error) {
      console.error(error);
    }
  }),
  takeLeading(creatingSet, function* ({ payload }) {
    try {
      const response: DefaultIResponse<Sett> = yield call(
        setService.create,
        payload,
      );
      yield put(createdSet(response.data));
    } catch (error) {
      console.error(error);
    }
  }),
  takeLeading(updatingSet, function* ({ payload }) {
    try {
      const response: DefaultIResponse<Sett> = yield call(
        setService.update,
        payload.id,
        { ...payload, id: undefined },
      );
      console.log(response);
      yield put(updatedSet(response));
    } catch (error) {
      console.error(error);
    }
  }),
];

function* setSagas() {
  yield all(sagas);
}

export default setSagas;
