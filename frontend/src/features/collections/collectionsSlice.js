// src/features/collections/collectionsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import collectionsService from "../../services/collectionsService";

const initialState = {
  collections: [],
  currentCollection: null, // single collection + items
  isLoading: false,
  isCreating: false,
  error: null,
};

// ── Fetch All Collections ─────────────────────────────
export const fetchCollections = createAsyncThunk(
  "collections/fetchAll",
  async (_, thunkAPI) => {
    try {
      return await collectionsService.getAllCollections();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch collections"
      );
    }
  }
);

// ── Fetch Single Collection ───────────────────────────
export const fetchCollectionById = createAsyncThunk(
  "collections/fetchById",
  async (id, thunkAPI) => {
    try {
      return await collectionsService.getCollectionById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch collection"
      );
    }
  }
);

// ── Create Collection ─────────────────────────────────
export const createCollection = createAsyncThunk(
  "collections/create",
  async (data, thunkAPI) => {
    try {
      return await collectionsService.createCollection(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create collection"
      );
    }
  }
);

// ── Delete Collection ─────────────────────────────────
export const deleteCollection = createAsyncThunk(
  "collections/delete",
  async (id, thunkAPI) => {
    try {
      await collectionsService.deleteCollection(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete collection"
      );
    }
  }
);

// ── Collections Slice ─────────────────────────────────
const collectionsSlice = createSlice({
  name: "collections",
  initialState,
  reducers: {
    clearCurrentCollection: (state) => {
      state.currentCollection = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // ── Fetch All ────────────────────────────────
      .addCase(fetchCollections.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCollections.fulfilled, (state, action) => {
        state.isLoading = false;
        state.collections = action.payload.collections;
      })
      .addCase(fetchCollections.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ── Fetch Single ─────────────────────────────
      .addCase(fetchCollectionById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCollectionById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCollection = action.payload;
      })
      .addCase(fetchCollectionById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ── Create ───────────────────────────────────
      .addCase(createCollection.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createCollection.fulfilled, (state, action) => {
        state.isCreating = false;
        // New collection list mein add karo
        state.collections.unshift(action.payload.collection);
      })
      .addCase(createCollection.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload;
      })

      // ── Delete ───────────────────────────────────
      .addCase(deleteCollection.fulfilled, (state, action) => {
        state.collections = state.collections.filter(
          (col) => col._id !== action.payload
        );
      });
  },
});

export const { clearCurrentCollection } = collectionsSlice.actions;
export default collectionsSlice.reducer;