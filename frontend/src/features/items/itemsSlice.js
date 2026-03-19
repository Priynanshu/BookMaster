// src/features/items/itemsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import itemsService from "../../services/itemsService";

// ── Initial State ─────────────────────────────────────
const initialState = {
  items: [],
  currentItem: null,
  relatedItems: [],
  resurfacedItems: [],
  isLoading: false,
  isSaving: false, // URL save karte waqt alag loader
  error: null,
  totalItems: 0,
};

// ── Async Thunks ──────────────────────────────────────

// Save URL
export const saveItem = createAsyncThunk(
  "items/save",
  async (itemData, thunkAPI) => {
    try {
      return await itemsService.saveItem(itemData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to save item"
      );
    }
  }
);

// ── Upload PDF Thunk ──────────────────────────────────
export const uploadPDFItem = createAsyncThunk(
  "items/uploadPDF",
  async (formData, thunkAPI) => {
    try {
      return await itemsService.uploadPDF(formData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "PDF upload failed"
      );
    }
  }
);

// Get All Items
export const fetchItems = createAsyncThunk(
  "items/fetchAll",
  async (filters, thunkAPI) => {
    try {
      return await itemsService.getAllItems(filters);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch items"
      );
    }
  }
);

// Get Single Item
export const fetchItemById = createAsyncThunk(
  "items/fetchById",
  async (id, thunkAPI) => {
    try {
      return await itemsService.getItemById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch item"
      );
    }
  }
);

// Update Item
export const updateItem = createAsyncThunk(
  "items/update",
  async ({ id, updates }, thunkAPI) => {
    try {
      return await itemsService.updateItem(id, updates);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update item"
      );
    }
  }
);

// Delete Item
export const deleteItem = createAsyncThunk(
  "items/delete",
  async (id, thunkAPI) => {
    try {
      await itemsService.deleteItem(id);
      return id; // deleted item ka id return karo
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete item"
      );
    }
  }
);

// Get Related Items
export const fetchRelatedItems = createAsyncThunk(
  "items/fetchRelated",
  async (id, thunkAPI) => {
    try {
      return await itemsService.getRelatedItems(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch related items"
      );
    }
  }
);

// Get Resurfaced Items
export const fetchResurfacedItems = createAsyncThunk(
  "items/fetchResurfaced",
  async (_, thunkAPI) => {
    try {
      return await itemsService.getResurfacedItems();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch resurfaced items"
      );
    }
  }
);

// ── Items Slice ───────────────────────────────────────
const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentItem: (state) => {
      state.currentItem = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // ── Save Item ────────────────────────────────
      .addCase(saveItem.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(saveItem.fulfilled, (state, action) => {
        state.isSaving = false;
        // Naya item list ke top pe add karo
        state.items.unshift(action.payload.item);
        state.totalItems += 1;
      })
      .addCase(saveItem.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload;
      })

      // ── Fetch All Items ──────────────────────────
      .addCase(fetchItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items;
        state.totalItems = action.payload.total;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ── Fetch Single Item ────────────────────────
      .addCase(fetchItemById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchItemById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentItem = action.payload.item;
      })
      .addCase(fetchItemById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ── Update Item ──────────────────────────────
      .addCase(updateItem.fulfilled, (state, action) => {
        // List mein updated item replace karo
        const index = state.items.findIndex(
          (item) => item._id === action.payload.item._id
        );
        if (index !== -1) {
          state.items[index] = action.payload.item;
        }
        // Current item bhi update karo
        if (state.currentItem?._id === action.payload.item._id) {
          state.currentItem = action.payload.item;
        }
      })

      // ── Delete Item ──────────────────────────────
      .addCase(deleteItem.fulfilled, (state, action) => {
        // List se deleted item hatao
        state.items = state.items.filter(
          (item) => item._id !== action.payload
        );
        state.totalItems -= 1;
      })

      // ── Fetch Related Items ──────────────────────
      .addCase(fetchRelatedItems.fulfilled, (state, action) => {
        state.relatedItems = action.payload.related;
      })

      // ── Upload PDF ────────────────────────────────────────
      .addCase(uploadPDFItem.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(uploadPDFItem.fulfilled, (state, action) => {
        state.isSaving = false;
        state.items.unshift(action.payload.item); // list mein add karo
        state.totalItems += 1;
      })
      .addCase(uploadPDFItem.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload;
      })

      // ── Fetch Resurfaced Items ───────────────────
      .addCase(fetchResurfacedItems.fulfilled, (state, action) => {
        state.resurfacedItems = action.payload.items;
      });

  },
});

export const { clearError, clearCurrentItem } = itemsSlice.actions;
export default itemsSlice.reducer;