// src/services/itemsService.js
import api from "./api";

// ── Save URL ──────────────────────────────────────────
const saveItem = async ({ url, collectionId }) => {
  const response = await api.post("/items/save", { url, collectionId });
  return response.data;
};

// ── Get All Items ─────────────────────────────────────
const getAllItems = async (filters = {}) => {
  const response = await api.get("/items", { params: filters });
  return response.data;
};

// ── Get Single Item ───────────────────────────────────
const getItemById = async (id) => {
  const response = await api.get(`/items/${id}`);
  return response.data;
};

// ── Update Item ───────────────────────────────────────
const updateItem = async (id, updates) => {
  const response = await api.patch(`/items/${id}`, updates);
  return response.data;
};

// ── Delete Item ───────────────────────────────────────
const deleteItem = async (id) => {
  const response = await api.delete(`/items/${id}`);
  return response.data;
};

// ── Get Related Items ─────────────────────────────────
const getRelatedItems = async (id) => {
  const response = await api.get(`/items/${id}/related`);
  return response.data;
};

// ── Get Resurfaced Items ──────────────────────────────
const getResurfacedItems = async () => {
  const response = await api.get("/items/resurfaced");
  return response.data;
};

const uploadPDF = async (formData, onUploadProgress) => {
  const response = await api.post("/items/upload-pdf", formData, {
    headers: { 
      "Content-Type": "multipart/form-data" // ← multipart important hai
    },
    onUploadProgress, // progress track karne ke liye
  });
  return response.data;
};

const itemsService = {
  saveItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
  getRelatedItems,
  getResurfacedItems,
  uploadPDF
};

export default itemsService;