import {  applyMiddleware, legacy_createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers/rootReducer';
import rootSaga from './saga/rootSaga';

const sagaMiddleware = createSagaMiddleware()

export const store = legacy_createStore(
    rootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga) 