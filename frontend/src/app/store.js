// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import itemsReducer from "../features/items/itemsSlice"
import searchReducer from "../features/search/searchSlice"
import collectionsReducer from "../features/collections/collectionsSlice"
import graphReducer from "../features/graph/graphSlice"
import statsReducer from "../features/stats/statsSlice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    items: itemsReducer,
    search: searchReducer,
    collections: collectionsReducer,
    graph: graphReducer,
    stats: statsReducer,
  },
});

export default store;