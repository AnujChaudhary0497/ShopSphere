import { useEffect, useState } from "react";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/product.api";

const initialFormData = {
  name: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  discount: "",
  image: "",
  rating: "",
  stock: "",
  sizes: "",
  colors: "",
};

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState(initialFormData);

  // =========================
  // FETCH PRODUCTS
  // =========================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getProducts();

      setProducts(response.data || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);

      setError(error.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // =========================
  // FORM CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setFormData(initialFormData);
    setFormError("");
    setEditingProduct(null);
  };

  // =========================
  // OPEN ADD MODAL
  // =========================

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  // =========================
  // OPEN EDIT MODAL
  // =========================

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormError("");

    setFormData({
      name: product.name || "",
      description: product.description || "",
      category: product.category || "",
      brand: product.brand || "",
      price: product.price || "",
      discount: product.discount || "",
      image: product.image || "",
      rating: product.rating || "",
      stock: product.stock || "",
      sizes: Array.isArray(product.sizes)
        ? product.sizes.join(", ")
        : "",
      colors: Array.isArray(product.colors)
        ? product.colors.join(", ")
        : "",
    });

    setShowModal(true);
  };

  // =========================
  // CLOSE MODAL
  // =========================

  const closeModal = () => {
    if (submitting) {
      return;
    }

    setShowModal(false);
    resetForm();
  };

  // =========================
  // ADD / UPDATE PRODUCT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setFormError("");

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        brand: formData.brand.trim(),

        price: Number(formData.price),

        discount: Number(formData.discount || 0),

        image: formData.image.trim() || null,

        rating: Number(formData.rating || 0),

        stock: Number(formData.stock || 0),

        sizes: formData.sizes
          ? formData.sizes
              .split(",")
              .map((size) => size.trim())
              .filter(Boolean)
          : [],

        colors: formData.colors
          ? formData.colors
              .split(",")
              .map((color) => color.trim())
              .filter(Boolean)
          : [],
      };

      // =========================
      // UPDATE
      // =========================

      if (editingProduct) {
        await updateProduct(
          editingProduct.id,
          productData
        );
      }

      // =========================
      // CREATE
      // =========================

      else {
        await createProduct(productData);
      }

      // Refresh products
      await fetchProducts();

      // Close modal
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Failed to save product:", error);

      setFormError(
        error.message || "Failed to save product"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // DELETE PRODUCT
  // =========================

  const handleDeleteProduct = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(productId);

      await deleteProduct(productId);

      await fetchProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);

      alert(
        error.message || "Failed to delete product"
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="dashboard-page">

      {/* =========================
                HEADER
            ========================= */}

      <div className="dashboard-header">
        <h1>Products</h1>

        <p>Manage your products</p>
      </div>

      {/* =========================
                PRODUCT CARD
            ========================= */}

      <div className="dashboard-card">
        <div className="card-header">
          <h3>All Products</h3>

          <button
            className="add-product-button"
            onClick={openAddModal}
          >
            Add Product
          </button>
        </div>

        {/* =========================
                    LOADING
                ========================= */}

        {loading && (
          <div className="empty-state">
            <p>Loading products...</p>
          </div>
        )}

        {/* =========================
                    ERROR
                ========================= */}

        {!loading && error && (
          <div className="empty-state">
            <p>{error}</p>
          </div>
        )}

        {/* =========================
                    EMPTY
                ========================= */}

        {!loading &&
          !error &&
          products.length === 0 && (
            <div className="empty-state">
              <p>No products found</p>
            </div>
          )}

        {/* =========================
                    TABLE
                ========================= */}

        {!loading &&
          !error &&
          products.length > 0 && (
            <div className="products-table-wrapper">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Product</th>
                    <th>Brand</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Rating</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>

                      {/* IMAGE */}

                      <td>
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="product-image"
                          />
                        ) : (
                          <div className="product-image-placeholder">
                            No Image
                          </div>
                        )}
                      </td>

                      {/* NAME */}

                      <td>
                        <span className="product-name">
                          {product.name}
                        </span>
                      </td>

                      {/* BRAND */}

                      <td>{product.brand}</td>

                      {/* CATEGORY */}

                      <td>{product.category}</td>

                      {/* PRICE */}

                      <td>
                        ₹{product.finalPrice}
                      </td>

                      {/* STOCK */}

                      <td>{product.stock}</td>

                      {/* RATING */}

                      <td>
                        ⭐ {product.rating}
                      </td>

                      {/* ACTION */}

                      <td>
                        <div className="product-actions">

                          <button
                            className="edit-product-button"
                            onClick={() =>
                              openEditModal(product)
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="delete-product-button"
                            onClick={() =>
                              handleDeleteProduct(
                                product.id
                              )
                            }
                            disabled={
                              deletingId === product.id
                            }
                          >
                            {deletingId === product.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>

      {/* =========================
                ADD / EDIT MODAL
            ========================= */}

      {showModal && (
        <div
          className="modal-overlay"
          onClick={closeModal}
        >
          <div
            className="product-modal"
            onClick={(e) => e.stopPropagation()}
          >

            {/* MODAL HEADER */}

            <div className="modal-header">

              <div>
                <h2>
                  {editingProduct
                    ? "Edit Product"
                    : "Add Product"}
                </h2>

                <p>
                  {editingProduct
                    ? "Update product information"
                    : "Create a new product"}
                </p>
              </div>

              <button
                className="modal-close"
                onClick={closeModal}
                disabled={submitting}
              >
                ×
              </button>

            </div>

            {/* FORM */}

            <form
              className="product-form"
              onSubmit={handleSubmit}
            >

              {/* FORM ERROR */}

              {formError && (
                <div className="form-error">
                  {formError}
                </div>
              )}

              <div className="form-grid">

                {/* NAME */}

                <div className="product-form-group">
                  <label>Product Name</label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    required
                  />
                </div>

                {/* BRAND */}

                <div className="product-form-group">
                  <label>Brand</label>

                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="Enter brand"
                    required
                  />
                </div>

                {/* CATEGORY */}

                <div className="product-form-group">
                  <label>Category</label>

                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Enter category"
                    required
                  />
                </div>

                {/* PRICE */}

                <div className="product-form-group">
                  <label>Price</label>

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Enter price"
                    min="0"
                    required
                  />
                </div>

                {/* DISCOUNT */}

                <div className="product-form-group">
                  <label>Discount (%)</label>

                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    placeholder="Enter discount"
                    min="0"
                    max="100"
                  />
                </div>

                {/* STOCK */}

                <div className="product-form-group">
                  <label>Stock</label>

                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="Enter stock"
                    min="0"
                    required
                  />
                </div>

                {/* RATING */}

                <div className="product-form-group">
                  <label>Rating</label>

                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    placeholder="0 - 5"
                    min="0"
                    max="5"
                    step="0.1"
                  />
                </div>

                {/* IMAGE */}

                <div className="product-form-group">
                  <label>Image URL</label>

                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                </div>

                {/* SIZES */}

                <div className="product-form-group">
                  <label>Sizes</label>

                  <input
                    type="text"
                    name="sizes"
                    value={formData.sizes}
                    onChange={handleChange}
                    placeholder="S, M, L, XL"
                  />
                </div>

                {/* COLORS */}

                <div className="product-form-group">
                  <label>Colors</label>

                  <input
                    type="text"
                    name="colors"
                    value={formData.colors}
                    onChange={handleChange}
                    placeholder="Black, White, Blue"
                  />
                </div>

              </div>

              {/* DESCRIPTION */}

              <div className="product-form-group full-width">
                <label>Description</label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter product description"
                  rows="4"
                  required
                />
              </div>

              {/* ACTIONS */}

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeModal}
                  disabled={submitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-product-button"
                  disabled={submitting}
                >
                  {submitting
                    ? "Saving..."
                    : editingProduct
                      ? "Update Product"
                      : "Add Product"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;