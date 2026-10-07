const products = [
    {
        id: 1,
        name: "Air Runner X",
        description: "Lightweight running shoes for everyday use",
        category: "shoes",
        brand: "Nike",
        price: 5999,
        discount: 20,
        finalPrice: 4799,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
        rating: 4.5,
        stock: 25,
        sizes: [7, 8, 9, 10],
        colors: ["Black", "White"]
    },

    {
        id: 2,
        name: "Classic White Sneakers",
        description: "Classic white sneakers with comfortable sole",
        category: "shoes",
        brand: "Adidas",
        price: 4499,
        discount: 15,
        finalPrice: 3824,
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772",
        rating: 4.3,
        stock: 18,
        sizes: [6, 7, 8, 9],
        colors: ["White"]
    },

    {
        id: 3,
        name: "Oversized Cotton T-Shirt",
        description: "Comfortable oversized cotton t-shirt",
        category: "clothing",
        brand: "Urban Wear",
        price: 999,
        discount: 10,
        finalPrice: 899,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
        rating: 4.2,
        stock: 40,
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "White", "Grey"]
    },

    {
        id: 4,
        name: "Denim Jacket",
        description: "Classic denim jacket for casual outfits",
        category: "clothing",
        brand: "Denim Co",
        price: 2499,
        discount: 15,
        finalPrice: 2124,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5",
        rating: 4.4,
        stock: 15,
        sizes: ["M", "L", "XL"],
        colors: ["Blue", "Black"]
    },

    {
        id: 5,
        name: "Running Pro Shoes",
        description: "Comfortable shoes designed for running",
        category: "shoes",
        brand: "Puma",
        price: 3999,
        discount: 10,
        finalPrice: 3599,
        image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2",
        rating: 4.6,
        stock: 30,
        sizes: [7, 8, 9, 10, 11],
        colors: ["Black", "Red"]
    }
];

module.exports = products;