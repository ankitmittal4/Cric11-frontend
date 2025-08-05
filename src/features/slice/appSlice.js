import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const accessToken = localStorage.getItem('accessToken');

// Async thunk for fetching matches
const fetchMatches = createAsyncThunk(
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

// Async thunk for fetching wallet balance
const fetchBalance = createAsyncThunk(
  "user/fetchBalance",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().app.token;
      const response = await axios.get(`${API_URL}/users/get-balance`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data.data.walletBalance;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch balance");
    }
  }
);


const initialState = {
  matches: [],
  loading: false,
  error: null,
  token: null,
  name: null,
  balance: null,
};

export const appSlice = createSlice({
  name: "app",
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
    // Fetch matches extra reducers builder
    builder
      .addCase(fetchMatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.matches = action.payload;
        state.error = null;
        // console.log("💾 Updated state matches:", state.matches);
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch matches extra reducers builder
    builder
      .addCase(fetchBalance.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload;
      })
      .addCase(fetchBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { setToken, setActiveUser } = appSlice.actions;
export default appSlice.reducer;
export { fetchMatches, fetchBalance };
