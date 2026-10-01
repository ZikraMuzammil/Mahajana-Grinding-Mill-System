const express = require("express");
const router = express.Router();
const db = require("../config/db");

/* ============================
   CREATE ORDER
============================ */

router.post("/", async (req, res) => {
  const {
    customerId = null,
    name,
    phone,
    email,
    address,
    city,
    postal,
    notes,
    delivery,
    payment,
    coupon,
    total,
    items = [],
    stripePaymentIntentId = null,
    paymentStatus = "unpaid",
  } = req.body;

  if (!name || !phone || !address || items.length === 0) {
    return res.status(400).json({
      error: "Missing required order fields",
    });
  }

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    let finalCustomerId = null;
    let orderEmail = email || null;

    if (customerId) {
      // logged-in customer: trust the account id
      finalCustomerId = customerId;

      // if no email was typed, use the account email
      if (!orderEmail) {
        const [[acc]] = await conn.query(
          "SELECT email FROM customers WHERE id=?",
          [customerId]
        );
        if (acc) orderEmail = acc.email;
      }
    } else if (orderEmail) {
      // guest checkout: find or create a customer by email
      const [[customer]] = await conn.query(
        "SELECT id FROM customers WHERE email=?",
        [orderEmail]
      );

      if (customer) {
        finalCustomerId = customer.id;
      } else {
        const [newCustomer] = await conn.query(
          `INSERT INTO customers
           (customer_name, email, phone, address, password)
           VALUES (?,?,?,?,?)`,
          [name, orderEmail, phone, address, `guest-${Date.now()}`]
        );
        finalCustomerId = newCustomer.insertId;
      }
    }

    // Insert order
    const [orderResult] = await conn.query(
      `INSERT INTO orders
       (
         customer_id,
         customer_name,
         phone,
         email,
         address,
         city,
         postal,
         notes,
         delivery_method,
         payment_method,
         coupon,
         total,
         status,
         stripe_payment_intent_id,
         payment_status
       )
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        finalCustomerId,
        name,
        phone,
        orderEmail,
        address,
        city,
        postal,
        notes,
        delivery,
        payment,
        coupon,
        total,
        "Pending",
        stripePaymentIntentId,
        paymentStatus,
      ]
    );

    const orderId = orderResult.insertId;

    // Insert products
    for (const item of items) {
      await conn.query(
        `INSERT INTO order_items
         (
           order_id,
           product_name,
           category,
           weight,
           qty,
           unit_price,
           line_total
         )
         VALUES (?,?,?,?,?,?,?)`,
        [
          orderId,
          item.name,
          item.category || "General",
          item.weight,
          item.qty,
          item.unitPrice,
          item.lineTotal,
        ]
      );

      // reduce stock
      const [[product]] = await conn.query(
        `SELECT id, stock_json
         FROM products
         WHERE name=? AND category=?`,
        [item.name, item.category || "General"]
      );

      if (product) {
        let stock =
          typeof product.stock_json === "string"
            ? JSON.parse(product.stock_json)
            : product.stock_json;

        stock[item.weight] = Math.max((stock[item.weight] || 0) - item.qty, 0);

        await conn.query(`UPDATE products SET stock_json=? WHERE id=?`, [
          JSON.stringify(stock),
          product.id,
        ]);
      }
    }

    await conn.commit();

    res.json({
      message: "Order placed successfully",
      orderId,
    });
  } catch (err) {
    await conn.rollback();
    console.log(err);
    res.status(500).json({
      error: "Failed to place order",
    });
  } finally {
    conn.release();
  }
});

/* ============================
   GET ORDERS
   /api/orders                      -> all orders (admin)
   /api/orders?email=a@b.com        -> orders for that email
   /api/orders?customerId=5         -> orders for that account
   /api/orders?email=..&customerId= -> either one matches
============================ */

router.get("/", async (req, res) => {
  const { email, customerId } = req.query;

  try {
    const conditions = [];
    const params = [];

    if (email) {
      conditions.push("o.email = ?");
      params.push(email);
    }
    if (customerId) {
      conditions.push("o.customer_id = ?");
      params.push(customerId);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" OR ")}` : "";

    const [rows] = await db.query(
      `SELECT
         oi.id AS lineId,
         o.id AS orderId,
         o.customer_name AS customer,
         oi.category,
         CONCAT(oi.product_name, ' ', oi.weight) AS product,
         oi.qty,
         oi.line_total AS price,
         o.total AS orderTotal,
         DATE_FORMAT(o.created_at, '%d/%m/%Y') AS date,
         o.address,
         o.payment_method AS payment,
         o.payment_method AS paymentMethod,
         o.status
       FROM order_items oi
       JOIN orders o ON o.id = oi.order_id
       ${where}
       ORDER BY o.created_at DESC, o.id DESC, oi.id ASC`,
      params
    );

    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Failed to load orders",
    });
  }
});

/* ============================
   UPDATE STATUS
============================ */

router.patch("/:id/status", async (req, res) => {
  const { status } = req.body;

  const allowed = ["Pending", "Shipped", "Delivered", "Cancelled"];

  if (!allowed.includes(status)) {
    return res.status(400).json({
      error: "Invalid status",
    });
  }

  try {
    await db.query(`UPDATE orders SET status=? WHERE id=?`, [
      status,
      req.params.id,
    ]);

    res.json({
      message: "Status updated",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Failed",
    });
  }
});

module.exports = router;