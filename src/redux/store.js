import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { demoSlice } from "./demo/slice";
import { toastStackSlice } from "./ToastStack/slice";

const rootReducer = combineReducers({
  demo: demoSlice.reducer,
  toastStack: toastStackSlice.reducer,
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
