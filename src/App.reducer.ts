import {configureStore} from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import mainPage from "./features/main-page/reducer";
import AppSagas from "./App.sagas";
import {combineReducers} from 'redux';

const RootReducer = combineReducers({
  mainPage,
});

const sagaMiddleware = createSagaMiddleware({
  onError(e) {
    console.trace(e);
  }
});

const reduxStore = configureStore({
  reducer: RootReducer,
  middleware: [sagaMiddleware]
});

sagaMiddleware.run(AppSagas);

export default reduxStore;