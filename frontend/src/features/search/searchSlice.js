// src/features/search/searchSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import searchService from "../../services/searchService";

const initialState = {
  results: [],
  allTags: [],
  isLoading: false,
  isLoadingTags: false,
  error: null,
  lastQuery: "",
};

// ── Semantic Search ───────────────────────────────────
export const semanticSearch = createAsyncThunk(
  "search/semantic",
  async (query, thunkAPI) => {
    try {
      return await searchService.semanticSearch(query);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Search failed"
      );
    }
  }
);

// ── Search by Tag ─────────────────────────────────────
export const searchByTag = createAsyncThunk(
  "search/byTag",
  async (tag, thunkAPI) => {
    try {
      return await searchService.searchByTag(tag);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Tag search failed"
      );
    }
  }
);

// ── Get All Tags ──────────────────────────────────────
export const fetchAllTags = createAsyncThunk(
  "search/allTags",
  async (_, thunkAPI) => {
    try {
      return await searchService.getAllTags();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch tags"
      );
    }
  }
);

// ── Search Slice ──────────────────────────────────────
const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    clearResults: (state) => {
      state.results = [];
      state.lastQuery = "";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // ── Semantic Search ──────────────────────────
      .addCase(semanticSearch.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(semanticSearch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.results = action.payload.results;
        state.lastQuery = action.payload.query;
      })
      .addCase(semanticSearch.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ── Search by Tag ────────────────────────────
      .addCase(searchByTag.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchByTag.fulfilled, (state, action) => {
        state.isLoading = false;
        state.results = action.payload.items;
        state.lastQuery = action.payload.tag;
      })
      .addCase(searchByTag.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ── All Tags ─────────────────────────────────
      .addCase(fetchAllTags.pending, (state) => {
        state.isLoadingTags = true;
      })
      .addCase(fetchAllTags.fulfilled, (state, action) => {
        state.isLoadingTags = false;
        state.allTags = action.payload.tags;
      })
      .addCase(fetchAllTags.rejected, (state) => {
        state.isLoadingTags = false;
      });
  },
});

export const { clearResults } = searchSlice.actions;
export default searchSlice.reducer;