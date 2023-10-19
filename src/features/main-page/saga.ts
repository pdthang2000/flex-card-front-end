import { all, call, put, select, takeLeading } from 'redux-saga/effects';
import { loadedCardList, loadingCardList } from './reducer';
import { Card } from '../../models/Card';
import mainPageService from './service';
import { DefaultIListResponse, DefaultIResponse } from '../../models/IResponse';
import { selectCardListLoading } from './selector';
import { unset } from 'lodash';
import { updatedCard, updatingCard } from '../sets/reducer';

const sagas = [
  takeLeading(loadingCardList, function* ({ payload }) {
    const loading: boolean = yield select(selectCardListLoading);
    if (!loading) return;

    try {
      const response: DefaultIListResponse<Card[]> = yield call(
        mainPageService.list,
        payload,
      );
      yield put(loadedCardList(response.data));
    } catch (error) {
      console.log(error);
    }
  }),
  takeLeading(updatingCard, function* ({ payload }) {
    const cardId = payload.id;
    unset(payload, 'id');

    try {
      const response: DefaultIResponse<Card> = yield call(
        mainPageService.update,
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
