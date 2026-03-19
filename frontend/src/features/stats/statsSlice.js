// src/features/stats/statsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import statsService from "../../services/statsService";

const initialState = {
  totalItems: 0,
  totalCollections: 0,
  itemsThisWeek: 0,
  typeBreakdown: {},
  topTags: [],
  recentItems: [],
  isLoading: false,
  error: null,
};

export const fetchStats = createAsyncThunk(
  "stats/fetch",
  async (_, thunkAPI) => {
    try {
      return await statsService.getDashboardStats();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch stats"
      );
    }
  }
);

const statsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.totalItems = action.payload.totalItems;
        state.totalCollections = action.payload.totalCollections;
        state.itemsThisWeek = action.payload.itemsThisWeek;
        state.typeBreakdown = action.payload.typeBreakdown;
        state.topTags = action.payload.topTags;
        state.recentItems = action.payload.recentItems;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default statsSlice.reducer;