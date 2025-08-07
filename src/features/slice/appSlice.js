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
      // console.log("Contest in matches: ", response.data.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch contests in matches");
    }
  }
);

// Async thunk for fetching contest detail in matches
const fetchContestDetail = createAsyncThunk(
  "matches/contestDetail",
  async (data, { rejectWithValue, getState }) => {
    try {
      // const token = getState().app.token;
      const response = await axios.post(`${API_URL}/contests/get`, data);
      // console.log("Contest detail: ", response.data.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch contests in matches");
    }
  }
);

// Async thunk for fetching my contest
const fetchMyContests = createAsyncThunk(
  "matches/myContests",
  async (data, { rejectWithValue, getState }) => {
    try {
      // const token = getState().app.token;
      const response = await axios.get(`${API_URL}/user-contest/all`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // console.log("My Contests: ", response.data.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch my contests");
    }
  }
);

// Async thunk for fetching contest detail in matches
const fetchUserContestDetail = createAsyncThunk(
  "matches/userContestDetail",
  async (data, { rejectWithValue, getState }) => {
    try {
      // const token = getState().app.token;
      const response = await axios.post(`${API_URL}/user-contest/get`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },);
      console.log("Transactions: ", response.data.data);
      return response.data.data[0];
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch user contest detail");
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

//Create contest
const createContest = createAsyncThunk(
  "contest/create",
  async (data, { rejectWithValue, getState }) => {
    try {
      // const token = getState().app.token;
      const response = await axios.post(`${API_URL}/user-contest/create`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const opponentData = {
        userContestId: response.data.data._id,
        contestId: data.contestId,
      };
      await axios.post(
        `${API_URL}/opponent/create`,
        opponentData,
      );
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
  contestDetail: null,
  createContestRes: null,
  myContests: [],
  userContestDetail: null,
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

    // Fetch contest detail extra reducers builder
    builder
      .addCase(fetchContestDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContestDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.contestDetail = action.payload;
        state.error = null;
        // console.log("💾 Updated state matches:", state.matches);
      })
      .addCase(fetchContestDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch my contests extra reducers builder
    builder
      .addCase(fetchMyContests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyContests.fulfilled, (state, action) => {
        state.loading = false;
        state.myContests = action.payload;
        state.error = null;
        // console.log("💾 Updated state matches:", state.matches);
      })
      .addCase(fetchMyContests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch contest detail extra reducers builder
    builder
      .addCase(fetchUserContestDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserContestDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.userContestDetail = action.payload;
        state.error = null;
        // console.log("💾 Updated state matches:", state.matches);
      })
      .addCase(fetchUserContestDetail.rejected, (state, action) => {
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
        state.error = null;
      })
      .addCase(fetchBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

    // Fetch transactions extra reducers builder
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactionData = action.payload;
        state.error = null;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

    // Fetch transactions extra reducers builder
    builder
      .addCase(createContest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createContest.fulfilled, (state, action) => {
        state.loading = false;
        state.createContestRes = action.payload;
        state.error = null;
      })
      .addCase(createContest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { setToken, setActiveUser } = appSlice.actions;
export default appSlice.reducer;
export { fetchMatches, fetchBalance, fetchTransactions, fetchContestsInMatches, fetchMyContests, fetchUserContestDetail, fetchContestDetail, createContest };
