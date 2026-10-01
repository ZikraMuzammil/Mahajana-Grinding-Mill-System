const express = require("express");
const router = express.Router();
const db = require("../config/db");

/* ============================================================
   GET /api/sales/summary
   Powers Sales.js — every number here is computed live from
   orders / order_items, nothing hardcoded.
============================================================ */
router.get("/summary", async (req, res) => {
  try {
    const [[{ totalOrders }]] = await db.query("SELECT COUNT(*) AS totalOrders FROM orders");
    const [[{ totalRevenue }]] = await db.query("SELECT COALESCE(SUM(total),0) AS totalRevenue FROM orders");
    const [[{ delivered }]] = await db.query("SELECT COUNT(*) AS delivered FROM orders WHERE status='Delivered'");
    const [[{ pending }]] = await db.query("SELECT COUNT(*) AS pending FROM orders WHERE status='Pending'");
    const [[{ cancelled }]] = await db.query("SELECT COUNT(*) AS cancelled FROM orders WHERE status='Cancelled'");

    // last 6 calendar months, always fully populated (0 where no data)
    const [monthRows] = await db.query(`
      SELECT DATE_FORMAT(created_at, '%Y-%m') AS ym,
             SUM(total) AS revenue,
             SUM(CASE WHEN status='Delivered' THEN 1 ELSE 0 END) AS delivered,
             SUM(CASE WHEN status='Pending' THEN 1 ELSE 0 END) AS pending
      FROM orders
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
      GROUP BY ym
    `);

    const byYm = {};
    monthRows.forEach((r) => { byYm[r.ym] = r; });

    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleString("en-US", { month: "short" });
      const row = byYm[ym];
      months.push({
        label,
        revenue: row ? Number(row.revenue) : 0,
        delivered: row ? Number(row.delivered) : 0,
        pending: row ? Number(row.pending) : 0,
      });
    }

    // top 5 products by revenue, from real order_items
    const [topProducts] = await db.query(`
      SELECT product_name AS name,
             SUM(qty) AS orders,
             SUM(line_total) AS revenue
      FROM order_items
      GROUP BY product_name
      ORDER BY revenue DESC
      LIMIT 5
    `);

    const maxProductRevenue = Math.max(1, ...topProducts.map((p) => Number(p.revenue)));
    const topProductsWithBadge = topProducts.map((p) => {
      const ratio = Number(p.revenue) / maxProductRevenue;
      const badge = ratio > 0.6 ? "high" : ratio > 0.3 ? "medium" : "low";
      return { name: p.name, orders: Number(p.orders), revenue: Number(p.revenue), badge };
    });

    // revenue share by category, from real order_items
    const [categoryRows] = await db.query(`
      SELECT category, SUM(line_total) AS revenue
      FROM order_items
      GROUP BY category
      ORDER BY revenue DESC
    `);
    const totalCategoryRevenue = categoryRows.reduce((s, r) => s + Number(r.revenue), 0) || 1;
    const topCategories = categoryRows.map((r) => ({
      category: r.category,
      revenue: Number(r.revenue),
      percent: Math.round((Number(r.revenue) / totalCategoryRevenue) * 100),
    }));

    // orders by payment method, from real orders
    const [paymentRows] = await db.query(`
      SELECT payment_method AS method, COUNT(*) AS count
      FROM orders
      GROUP BY payment_method
    `);
    const totalPaymentOrders = paymentRows.reduce((s, r) => s + Number(r.count), 0) || 1;
    const paymentBreakdown = paymentRows.map((r) => ({
      method: r.method || "Unknown",
      count: Number(r.count),
      percent: Math.round((Number(r.count) / totalPaymentOrders) * 100),
    }));

    res.json({
      totalOrders,
      totalRevenue: Number(totalRevenue),
      delivered,
      pending,
      cancelled,
      months,
      topProducts: topProductsWithBadge,
      topCategories,
      paymentBreakdown,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load sales summary" });
  }
});

module.exports = router;
