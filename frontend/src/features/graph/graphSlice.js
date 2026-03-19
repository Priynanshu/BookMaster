// src/features/graph/graphSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

const initialState = {
  nodes: [],
  edges: [],
  isLoading: false,
  error: null,
};

export const fetchGraphData = createAsyncThunk(
  "graph/fetchData",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/graph");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch graph data"
      );
    }
  }
);

const graphSlice = createSlice({
  name: "graph",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGraphData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGraphData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.nodes = action.payload.nodes;
        state.edges = action.payload.edges;
      })
      .addCase(fetchGraphData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default graphSlice.reducer;