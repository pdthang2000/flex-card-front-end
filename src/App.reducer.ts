import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import cardState from './features/cards/reducer';
import AppSagas from './App.sagas';
import { combineReducers } from 'redux';
import setState from './features/sets/reducer';

const RootReducer = combineReducers({
  cardState,
  setState,
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
