const Product = require("../models/product.model");

// Get All Products
const getProducts = async (req, res) => {
    try {
        const products = await Product.findAll();

        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch products",
            error: error.message
        });
    }
};


// Get Product By ID
const getProductById = async (req, res) => {
    try {
        const productId = Number(req.params.id);

        const product = await Product.findByPk(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch product",
            error: error.message
        });
    }
};


// Create Product
const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            category,
            brand,
            price,
            discount,
            image,
            rating,
            stock,
            sizes,
            colors
        } = req.body;

        const finalPrice =
            Number(price) -
            (Number(price) * Number(discount || 0)) / 100;

        const product = await Product.create({
            name,
            description,
            category,
            brand,
            price,
            discount: discount || 0,
            finalPrice,
            image,
            rating: rating || 0,
            stock: stock || 0,
            sizes,
            colors
        });

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create product",
            error: error.message
        });
    }
};


// Update Product
const updateProduct = async (req, res) => {
    try {
        const productId = Number(req.params.id);

        const product = await Product.findByPk(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const {
            name,
            description,
            category,
            brand,
            price,
            discount,
            image,
            rating,
            stock,
            sizes,
            colors
        } = req.body;

        const updatedPrice = price ?? product.price;
        const updatedDiscount = discount ?? product.discount;

        const finalPrice =
            Number(updatedPrice) -
            (Number(updatedPrice) * Number(updatedDiscount)) / 100;

        await product.update({
            name: name ?? product.name,
            description: description ?? product.description,
            category: category ?? product.category,
            brand: brand ?? product.brand,
            price: updatedPrice,
            discount: updatedDiscount,
            finalPrice,
            image: image ?? product.image,
            rating: rating ?? product.rating,
            stock: stock ?? product.stock,
            sizes: sizes ?? product.sizes,
            colors: colors ?? product.colors
        });

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update product",
            error: error.message
        });
    }
};


// Delete Product
const deleteProduct = async (req, res) => {
    try {
        const productId = Number(req.params.id);

        const product = await Product.findByPk(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        await product.destroy();

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete product",
            error: error.message
        });
    }
};


module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};