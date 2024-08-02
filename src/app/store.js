import { configureStore } from "@reduxjs/toolkit";

import matchReducer from "../features/matches/matchSlice";

export const store = configureStore({
  reducer: matchReducer,
});
