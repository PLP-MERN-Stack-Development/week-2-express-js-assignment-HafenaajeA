const request = require("supertest");
const app = require("../../server");

const API_KEY = process.env.API_KEY || "test-api-key";
const authHeader = { "x-api-key": API_KEY };

test("GET /products returns products", async () => {
  const response = await request(app).get("/api/products").set(authHeader);
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("products");
});

test("POST /products creates a product", async () => {
  const newProduct = {
    name: "Test Product",
    description: "Test Description",
    price: 100,
    category: "test",
    inStock: true,
  };
  const response = await request(app)
    .post("/api/products")
    .set(authHeader)
    .send(newProduct);
  expect(response.status).toBe(201);
  expect(response.body).toHaveProperty("product");
  expect(response.body.product.name).toBe(newProduct.name);
});

test("GET /products/:id returns a product", async () => {
  const response = await request(app).get("/api/products/1").set(authHeader);
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("product");
});

test("PUT /products/:id updates a product", async () => {
  const updatedProduct = { name: "Updated Product", price: 150 };
  const response = await request(app)
    .put("/api/products/1")
    .set(authHeader)
    .send(updatedProduct);
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("product");
  expect(response.body.product.name).toBe(updatedProduct.name);
});

test("DELETE /products/:id deletes a product", async () => {
  const response = await request(app).delete("/api/products/1").set(authHeader);
  expect(response.status).toBe(204);
});
