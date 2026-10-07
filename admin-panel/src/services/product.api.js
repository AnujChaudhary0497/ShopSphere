import api from "./api";

// Get All Products
export const getProducts = async () => {
    const response = await api.get("/products");
    return response.data;
};

// Get Product By ID
export const getProductById = async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
};

// Create Product
export const createProduct = async (data) => {
    const response = await api.post("/products", data);
    return response.data;
};

// Update Product
export const updateProduct = async (id, data) => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
};

// Delete Product
export const deleteProduct = async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
};