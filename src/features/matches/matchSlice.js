import { createSlice, nanoid } from "@reduxjs/toolkit";
const initialState = {
  matches: [],
  //   editingMatchId: null,
  // todos: [{ id: 1, text: "Hello World!!!" }],
};

export const matchSlice = createSlice({
  name: "Ankit",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      //   console.log("state.token:", state.token);
    },
    setActiveUser: (state, action) => {
      state.name = action.payload;
      //   console.log("state.name:", state.name);
    },
  },
});
export const { setToken, setActiveUser } = matchSlice.actions;
export default matchSlice.reducer;
