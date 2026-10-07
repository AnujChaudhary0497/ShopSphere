import api from "./api";

// Get Dashboard Statistics
export const getDashboardStats = async () => {
    const response = await api.get("/dashboard/stats");
    return response.data;
};