// server.js - Starter Express server for Week 2 assignment

// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const logger = require("./middleware/logger");
const authenticate = require("./middleware/auth");
const validateProduct = require("./middleware/validation");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());
app.use(logger);
app.use("/api", authenticate);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || "Something went wrong!",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// Sample in-memory products database
let products = [
  {
    id: "1",
    name: "Laptop",
    description: "High-performance laptop with 16GB RAM",
    price: 1200,
    category: "electronics",
    inStock: true,
  },
  {
    id: "2",
    name: "Smartphone",
    description: "Latest model with 128GB storage",
    price: 800,
    category: "electronics",
    inStock: true,
  },
  {
    id: "3",
    name: "Coffee Maker",
    description: "Programmable coffee maker with timer",
    price: 50,
    category: "kitchen",
    inStock: false,
  },
];

// Root route
app.get("/", (req, res) => {
  res.send(
    "Welcome to the Product API! Go to /api/products to see all products."
  );
});

// Product routes
app.get("/api/products", (req, res) => {
  try {
    const { category, page = 1, limit = 10, search } = req.query;
    const sanitizedPage = Math.max(1, parseInt(page));
    const sanitizedLimit = Math.min(100, Math.max(1, parseInt(limit)));

    let filteredProducts = [...products];

    if (category) {
      filteredProducts = filteredProducts.filter(
        (p) => p.category === category.toLowerCase().trim()
      );
    }

    if (search) {
      const searchTerm = search.toLowerCase().trim();
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm)
      );
    }

    const startIndex = (sanitizedPage - 1) * sanitizedLimit;
    const endIndex = sanitizedPage * sanitizedLimit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    res.json({
      total: filteredProducts.length,
      page: parseInt(sanitizedPage),
      totalPages: Math.ceil(filteredProducts.length / sanitizedLimit),
      products: paginatedProducts,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/products/:id", (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

app.post("/api/products", validateProduct, (req, res, next) => {
  try {
    const newProduct = {
      id: uuidv4(),
      ...req.body,
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
});

app.put("/api/products/:id", validateProduct, (req, res) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Product not found" });

  products[index] = {
    ...products[index],
    ...req.body,
    id: req.params.id,
  };
  res.json(products[index]);
});

app.delete("/api/products/:id", (req, res) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Product not found" });

  products.splice(index, 1);
  res.status(204).send();
});

app.get("/api/statistics", (req, res) => {
  const stats = products.reduce(
    (acc, product) => {
      acc.categories[product.category] =
        (acc.categories[product.category] || 0) + 1;
      acc.totalProducts++;
      if (product.inStock) acc.inStock++;
      acc.totalValue += product.price;
      return acc;
    },
    { categories: {}, totalProducts: 0, inStock: 0, totalValue: 0 }
  );

  res.json(stats);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app;
