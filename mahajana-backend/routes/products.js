const express = require("express");
const router = express.Router();
const db = require("../config/db");

const DEFAULT_STOCK = { "100g": 50, "200g": 50, "500g": 50, "750g": 50, "1kg": 50 };

function parseStock(row) {
  return typeof row.stock_json === "string" ? JSON.parse(row.stock_json) : row.stock_json;
}

/* ============================================================
   GET /api/products?category=Spice
   Returns all products for one category, stock parsed from JSON.
   Used by each product page to show live stock per weight, and by
   the admin ViewProducts / Inventory pages (call with no category
   to get everything).
============================================================ */
router.get("/", async (req, res) => {
  const { category } = req.query;

  try {
    const [rows] = category
      ? await db.query("SELECT * FROM products WHERE category = ? ORDER BY created_at DESC", [category])
      : await db.query("SELECT * FROM products ORDER BY created_at DESC");

    const parsed = rows.map((r) => ({
      id: r.id,
      name: r.name,
      category: r.category,
      subcategory: r.subcategory,
      basePrice: Number(r.base_price),
      stock: parseStock(r),
    }));

    res.json(parsed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load products" });
  }
});

/* ============================================================
   GET /api/products/stock-map?category=Spice
   Lightweight: { "Product Name": { "100g": 40, ... } }
============================================================ */
router.get("/stock-map", async (req, res) => {
  const { category } = req.query;

  try {
    const [rows] = category
      ? await db.query("SELECT name, stock_json FROM products WHERE category = ?", [category])
      : await db.query("SELECT name, stock_json FROM products");

    const map = {};
    rows.forEach((r) => { map[r.name] = parseStock(r); });

    res.json(map);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load stock" });
  }
});

/* ============================================================
   POST /api/products
   Used by AddProduct.js "Save Product" (admin)
   Body: { name, category, subcategory, basePrice, stock (optional object) }
============================================================ */
router.post("/", async (req, res) => {
  const { name, category, subcategory, basePrice, stock } = req.body;

  if (!name || basePrice === undefined) {
    return res.status(400).json({ error: "Name and basePrice are required" });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO products (name, category, subcategory, base_price, stock_json)
       VALUES (?, ?, ?, ?, ?)`,
      [name, category || "General", subcategory || "", Number(basePrice), JSON.stringify(stock || DEFAULT_STOCK)]
    );
    res.status(201).json({ id: result.insertId, name, category, subcategory, basePrice, stock: stock || DEFAULT_STOCK });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add product" });
  }
});

/* ============================================================
   PUT /api/products/:id
   Used by ViewProducts.js "Save" (edit)
============================================================ */
router.put("/:id", async (req, res) => {
  const { name, category, subcategory, basePrice, stock } = req.body;

  try {
    await db.query(
      `UPDATE products SET name=?, category=?, subcategory=?, base_price=?, stock_json=? WHERE id=?`,
      [name, category, subcategory || "", Number(basePrice), JSON.stringify(stock || DEFAULT_STOCK), req.params.id]
    );
    res.json({ message: "Product updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update product" });
  }
});

/* ============================================================
   PATCH /api/products/:id/stock
   Adjust stock for one weight tier directly (admin restock)
   Body: { weight: "500g", qty: 20 }   -> adds qty to current stock
============================================================ */
router.patch("/:id/stock", async (req, res) => {
  const { weight, qty } = req.body;

  try {
    const [[row]] = await db.query("SELECT stock_json FROM products WHERE id = ?", [req.params.id]);
    if (!row) return res.status(404).json({ error: "Product not found" });

    const stock = parseStock(row);
    stock[weight] = Math.max((stock[weight] || 0) + Number(qty), 0);

    await db.query("UPDATE products SET stock_json = ? WHERE id = ?", [JSON.stringify(stock), req.params.id]);
    res.json({ message: "Stock updated", stock });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update stock" });
  }
});

/* ============================================================
   DELETE /api/products/:id
   Used by ViewProducts.js "Delete"
============================================================ */
router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM products WHERE id=?", [req.params.id]);
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

module.exports = router;
