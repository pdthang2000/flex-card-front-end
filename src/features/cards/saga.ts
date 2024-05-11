import { all, call, put, select, takeLeading } from 'redux-saga/effects';
import {
  createdSet,
  creatingSet,
  deletedSet,
  deletingSet,
  loadedCardList,
  loadingCardList,
  updatedCard,
  updatedSet,
  updatingCard,
  updatingSet,
} from './reducer';
import { Card } from '../../models/Card';
import cardService from './service';
import { DefaultIListResponse, DefaultIResponse } from '../../models/IResponse';
import { selectCardListLoading } from './selector';
import { unset } from 'lodash';
import { Sett } from '../../models/Sett';
import setService from '../sets/service';

const sagas = [
  takeLeading(loadingCardList, function* ({ payload }) {
    const loading: boolean = yield select(selectCardListLoading);
    if (!loading) return;

    try {
      const response: DefaultIListResponse<Card[]> = yield call(
        cardService.list,
        payload,
      );
      yield put(loadedCardList(response.data));
    } catch (error) {
      console.log(error);
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
      yield put(updatedSet(response));
    } catch (error) {
      console.error(error);
    }
  }),
  takeLeading(deletingSet, function* ({ payload }) {
    try {
      const response: DefaultIResponse<any> = yield call(
        setService.delete,
        payload,
      );
      yield put(deletedSet(response));
    } catch (error) {
      console.error(error);
    }
  }),
  takeLeading(updatingCard, function* ({ payload }) {
    const cardId = payload.id;
    unset(payload, 'id');

    try {
      const response: DefaultIResponse<Card> = yield call(
        cardService.update,
        cardId,
        payload,
      );

      yield put(updatedCard(response.data));
    } catch (error) {
      console.log(error);
    }
  }),
];

function* mainPageSagas() {
  yield all(sagas);
}

export default mainPageSagas;
