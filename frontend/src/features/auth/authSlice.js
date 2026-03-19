// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/authService";

// ── Initial State ─────────────────────────────────────
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// ── Async Thunks ──────────────────────────────────────
// Thunk = async function jo Redux action dispatch karta hai

// Register thunk
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      return await authService.register(userData);
    } catch (error) {
      // Error message backend se lo
      const message = error.response?.data?.message || "Registration failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Login thunk
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      return await authService.login(credentials);
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Logout thunk
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      return await authService.logout();
    } catch (error) {
      const message = error.response?.data?.message || "Logout failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get current user thunk
// App load hone par call karo — user logged in hai ya nahi check karo
export const getMe = createAsyncThunk(
  "auth/getMe",
  async (_, thunkAPI) => {
    try {
      return await authService.getMe();
    } catch (error) {
      const message = error.response?.data?.message || "Session expired";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ── Auth Slice ────────────────────────────────────────
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Error clear karo — form reset pe
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // ── Register ──────────────────────────────────
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ── Login ─────────────────────────────────────
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // ── Logout ────────────────────────────────────
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })

      // ── Get Me ────────────────────────────────────
      .addCase(getMe.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(getMe.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;