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

// Async thunk for fetching contest in matches
const fetchContestsInMatches = createAsyncThunk(
  "matches/fetchContests",
  async (data, { rejectWithValue, getState }) => {
    try {
      // const token = getState().app.token;
      const response = await axios.post(`${API_URL}/contests/all`, data);
      // console.log("Transactions: ", response.data.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch contests in matches");
    }
  }
);

// Async thunk for fetching wallet balance
const fetchBalance = createAsyncThunk(
  "user/fetchBalance",
  async (_, { rejectWithValue, getState }) => {
    try {
      // const token = getState().app.token;
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

// Async thunk for fetching transactions
const fetchTransactions = createAsyncThunk(
  "user/fetchTransactions",
  async (data, { rejectWithValue, getState }) => {
    try {
      // const token = getState().app.token;
      const response = await axios.post(`${API_URL}/transactions/all`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // console.log("Transactions: ", response.data.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch transactions");
    }
  }
);


const initialState = {
  matches: [],
  contests: [],
  loading: false,
  error: null,
  token: null,
  name: null,
  balance: null,
  transactionData: null,
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

    // Fetch contests in matches extra reducers builder
    builder
      .addCase(fetchContestsInMatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContestsInMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.contests = action.payload;
        state.error = null;
        // console.log("💾 Updated state matches:", state.matches);
      })
      .addCase(fetchContestsInMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch balance extra reducers builder
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

    // Fetch transactions extra reducers builder
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactionData = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { setToken, setActiveUser } = appSlice.actions;
export default appSlice.reducer;
export { fetchMatches, fetchBalance, fetchTransactions, fetchContestsInMatches };
