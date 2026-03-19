// src/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { PublicRoute } from "./components/PublicRoutes";
import { ProtectedRoute } from "./components/ProtectedRoutes";

import HomePage from "./pages/HomePage";
import Dashboard from "./features/stats/Dashboard";
import ItemFeed from "./features/items/ItemFeed";
import CollectionList from "./features/collections/CollectionList";
import GraphView from "./features/graph/GraphView";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import ItemDetail from "./features/items/ItemDetail";
import MainLayout from "./components/layout/MainLayout";
import SearchResults from "./features/search/SearchResults";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ── Public Routes ── */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      {/* ── Protected Routes ── */}
      {/* /app/* hata diya — seedha / pe rakho */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* ✅ Ab /dashboard seedha kaam karega */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/items/:id" element={<ItemDetail />} />
        <Route path="/feed" element={<ItemFeed />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/collections" element={<CollectionList />} />
        <Route path="/collections/:id" element={<CollectionList />} />
        <Route path="/graph" element={<GraphView />} />
      </Route>

      {/* ── 404 ── */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
};

export default AppRoutes;