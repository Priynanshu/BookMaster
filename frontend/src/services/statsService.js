// src/services/statsService.js
import api from "./api";

const getDashboardStats = async () => {
  const response = await api.get("/stats");
  return response.data;
};

const statsService = { getDashboardStats };
export default statsService;