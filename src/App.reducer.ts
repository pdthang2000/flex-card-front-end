import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import mainPage from './features/main-page/reducer';
import AppSagas from './App.sagas';
import { combineReducers } from 'redux';
import set from './features/sets/reducer';

const RootReducer = combineReducers({
  mainPage,
  set,
});

const sagaMiddleware = createSagaMiddleware({
  onError(e) {
    console.trace(e);
  },
});

const reduxStore = configureStore({
  reducer: RootReducer,
  middleware: [sagaMiddleware],
});

sagaMiddleware.run(AppSagas);

export default reduxStore;
