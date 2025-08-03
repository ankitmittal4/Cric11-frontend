import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Async thunk for fetching matches
export const fetchMatches = createAsyncThunk(
  "matches/fetchMatches",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/match/all`);
      return response.data.data;
    } catch (error) {
      console.error("❌ API call failed:", error);
      return rejectWithValue(error.response?.data || "Failed to fetch matches");
    }
  }
);

const initialState = {
  matches: [],
  loading: false,
  error: null,
  token: null,
  name: null,
};

export const matchSlice = createSlice({
  name: "matches",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setActiveUser: (state, action) => {
      state.name = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.matches = action.payload;
        state.error = null;
        console.log("💾 Updated state matches:", state.matches);
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setToken, setActiveUser } = matchSlice.actions;
export default matchSlice.reducer;
