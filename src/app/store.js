import { configureStore } from "@reduxjs/toolkit";

import appReducer from "../features/slice/appSlice";

export const store = configureStore({
  reducer: {
    app: appReducer,
  },
});
