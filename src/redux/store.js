// import {  applyMiddleware, legacy_createStore } from 'redux';
// import createSagaMiddleware from 'redux-saga';
// import rootReducer from './reducers/rootReducer';
// import rootSaga from './saga/rootSaga';

// const sagaMiddleware = createSagaMiddleware()

// export const store = legacy_createStore(
//     rootReducer, applyMiddleware(sagaMiddleware));

// sagaMiddleware.run(rootSaga) 


// store.js
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

import rootReducer from './reducers/rootReducer'; // combineReducers({ ... })
import rootSaga from './saga/rootSaga';

// 1. Create saga middleware
const sagaMiddleware = createSagaMiddleware();

// 2. Persist config
const persistConfig = {
  key: 'root',
  storage,
};

// 3. Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4. Create store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false, // disable thunk if not using it
      immutableCheck: false,
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(sagaMiddleware), // add saga
});

// 5. Run sagas
sagaMiddleware.run(rootSaga);

// 6. Create persistor
export const persistor = persistStore(store);
