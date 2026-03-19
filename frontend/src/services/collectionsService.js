// src/services/collectionsService.js
import api from "./api";

const createCollection = async (data) => {
  const response = await api.post("/collections", data);
  return response.data;
};

const getAllCollections = async () => {
  const response = await api.get("/collections");
  return response.data;
};

const getCollectionById = async (id) => {
  const response = await api.get(`/collections/${id}`);
  return response.data;
};

const updateCollection = async (id, updates) => {
  const response = await api.patch(`/collections/${id}`, updates);
  return response.data;
};

const deleteCollection = async (id) => {
  const response = await api.delete(`/collections/${id}`);
  return response.data;
};

const collectionsService = {
  createCollection,
  getAllCollections,
  getCollectionById,
  updateCollection,
  deleteCollection,
};

export default collectionsService;