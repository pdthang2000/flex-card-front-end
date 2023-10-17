import { all, call, put, select, takeLeading } from 'redux-saga/effects';
import { loadedCardList, loadingCardList } from './reducer';
import { Card } from '../../models/Card';
import mainPageService from './service';
import { DefaultIListResponse } from '../../models/IResponse';
import { selectCardListLoading } from './selector';

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
    } catch (e) {
      console.log(e);
    }
  }),
];

function* mainPageSagas() {
  yield all(sagas);
}

export default mainPageSagas;
