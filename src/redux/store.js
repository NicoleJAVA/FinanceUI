import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { demoSlice } from "./demo/slice";
import { toastStackSlice } from "./ToastStack/slice";
import {transactionSlice} from './transaction/slice';

const rootReducer = combineReducers({
  demo: demoSlice.reducer,
  toastStack: toastStackSlice.reducer,
  transactions: transactionSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),

  devTools: true,
});

export default { store };
