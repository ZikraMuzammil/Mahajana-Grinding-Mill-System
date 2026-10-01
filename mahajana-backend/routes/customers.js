const express = require("express");
const router = express.Router();
const db = require("../config/db");

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);

    const { customer_name, email, phone, address, password } = req.body;

    if (!customer_name || !email || !phone || !password) {
      return res.status(400).json({
        error: "Full name, email, phone and password are required",
      });
    }

    // check email exists
    const checkSql = "SELECT id FROM customers WHERE email = ?";
    const [existing] = await db.query(checkSql, [email]);

    if (existing.length > 0) {
      return res.status(409).json({ error: "Email already exists" });
    }

    // insert user
    const insertSql =
      "INSERT INTO customers (customer_name, email, phone, address, password) VALUES (?, ?, ?, ?, ?)";

    const [data] = await db.query(insertSql, [
      customer_name,
      email,
      phone,
      address,
      password,
    ]);

    res.json({
      success: true,
      id: data.insertId,
      message: "Customer registered successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const sql =
      "SELECT id, customer_name, email, phone, address FROM customers WHERE email = ? AND password = ?";

    const [result] = await db.query(sql, [email, password]);

    if (result.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json({
      success: true,
      user: result[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ================= GET ALL CUSTOMERS (with real order stats) ================= */
// Used by Customers.js admin page. Joins against orders (matched by email,
// since orders can be placed without an account) to compute how many orders
// each customer has placed and how much they've spent, then classifies them
// into New / Regular / Frequent / VIP.
router.get("/", async (req, res) => {
  try {
    const sql = `
      SELECT
        c.id,
        c.customer_name,
        c.phone,
        c.address,
        c.email,
        c.created_at,
        COUNT(o.id) AS orderCount,
        COALESCE(SUM(o.total), 0) AS totalSpent
      FROM customers c
      LEFT JOIN orders o ON o.email = c.email
      GROUP BY c.id, c.customer_name, c.phone, c.address, c.email, c.created_at
      ORDER BY c.created_at DESC
    `;

    const [result] = await db.query(sql);

    const withType = result.map((row) => {
      const orders = Number(row.orderCount);
      let type = "New";
      if (orders >= 10) type = "VIP";
      else if (orders >= 5) type = "Frequent";
      else if (orders >= 2) type = "Regular";

      return {
        id: row.id,
        customer_name: row.customer_name,
        phone: row.phone,
        address: row.address,
        email: row.email,
        created_at: row.created_at,
        orders,
        total: Number(row.totalSpent),
        type,
      };
    });

    res.json(withType);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
