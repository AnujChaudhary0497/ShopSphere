import api from "./api";

// Get All Orders
export const getOrders = async () => {
    const response = await api.get("/orders");
    return response.data;
};

// Get Order By ID
export const getOrderById = async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
};

// Create Order
export const createOrder = async (data) => {
    const response = await api.post("/orders", data);
    return response.data;
};

// Update Order
export const updateOrder = async (id, data) => {
    const response = await api.put(`/orders/${id}`, data);
    return response.data;
};

// Delete Order
export const deleteOrder = async (id) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
};