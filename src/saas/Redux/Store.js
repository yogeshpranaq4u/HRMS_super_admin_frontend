// import { configureStore } from "@reduxjs/toolkit";
// import EmployeeReduser from "../Redux/Reducer";

// export const store = configureStore({
//   reducer: EmployeeReduser,
// });
import { configureStore,} from "@reduxjs/toolkit";
import EmployeeReducer from "../Redux/Reducer";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
// Configuration for redux-persist
const persistConfig = {
  key: 'root',
  storage,
};

// Wrap your reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, EmployeeReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false, // Disable immutability checks
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
