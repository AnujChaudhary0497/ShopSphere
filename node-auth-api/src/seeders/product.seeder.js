const Product = require("../models/product.model");
const products = require("../data/products.data");

const seedProducts = async () => {
  try {
    await Product.bulkCreate(products);

    console.log("Products seeded successfully");
  } catch (error) {
    console.error("Product seeding failed:", error.message);
  }
};

module.exports = seedProducts;
