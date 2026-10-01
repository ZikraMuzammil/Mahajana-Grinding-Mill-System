const express = require("express");
const router = express.Router();
const db = require("../config/db");

/* ============================================================
   GET /api/dashboard/stats
   Powers SellerDashboard.js overview cards, sales chart, and
   stock status list — all computed live from real tables.
============================================================ */
router.get("/stats", async (req, res) => {
  try {
    const [[{ totalProducts }]] = await db.query(
      "SELECT COUNT(*) AS totalProducts FROM products"
    );

    const [[{ totalCategories }]] = await db.query(
      "SELECT COUNT(DISTINCT category) AS totalCategories FROM products"
    );

    const [[{ totalOrders }]] = await db.query(
      "SELECT COUNT(*) AS totalOrders FROM orders"
    );

    const [[{ totalCustomers }]] = await db.query(
      "SELECT COUNT(*) AS totalCustomers FROM customers"
    );

    const [[{ totalRevenue }]] = await db.query(
      "SELECT COALESCE(SUM(total), 0) AS totalRevenue FROM orders"
    );

    // real revenue per month for the last 6 calendar months — built here in
    // JS (not just from SQL GROUP BY) so months with zero orders still show
    // up as a real 0% bar instead of being silently skipped
    const [monthRows] = await db.query(`
      SELECT DATE_FORMAT(created_at, '%Y-%m') AS ym,
             SUM(total) AS total
      FROM orders
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
      GROUP BY ym
    `);

    const totalsByYm = {};
    monthRows.forEach((r) => { totalsByYm[r.ym] = Number(r.total); });

    const last6 = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleString("en-US", { month: "short" });
      last6.push({ ym, label, total: totalsByYm[ym] || 0 });
    }

    const maxTotal = Math.max(1, ...last6.map((m) => m.total));
    const monthlySales = last6.map((m) => ({
      month: m.label,
      value: (m.total === 0 ? 0 : Math.max(4, Math.round((m.total / maxTotal) * 100))) + "%",
    }));



    // stock status: classify each product by its lowest-stock weight tier
    const [productRows] = await db.query("SELECT name, stock_json FROM products");
    const stockStatus = productRows.map((r) => {
      const stock = typeof r.stock_json === "string" ? JSON.parse(r.stock_json) : r.stock_json;
      const values = Object.values(stock);
      const min = Math.min(...values);
      let status = "Available";
      if (min <= 0) status = "Out of Stock";
      else if (min < 10) status = "Low Stock";
      return { name: r.name, status };
    });

    // surface the most urgent ones first (out of stock, then low stock)
    const priority = { "Out of Stock": 0, "Low Stock": 1, "Available": 2 };
    stockStatus.sort((a, b) => priority[a.status] - priority[b.status]);

    // last 5 orders, most recent first — for the "Recent Orders" panel
    const [recentOrders] = await db.query(`
      SELECT id, customer_name, total, status,
             DATE_FORMAT(created_at, '%d/%m/%Y %h:%i %p') AS placedAt
      FROM orders
      ORDER BY created_at DESC
      LIMIT 5
    `);

    res.json({
      totalProducts,
      totalCategories,
      totalOrders,
      totalCustomers,
      totalRevenue: Number(totalRevenue),
      monthlySales,
      stockStatus: stockStatus.slice(0, 8),
      recentOrders: recentOrders.map((o) => ({
        id: `MG${String(o.id).padStart(3, "0")}`,
        customer: o.customer_name,
        total: Number(o.total),
        status: o.status,
        placedAt: o.placedAt,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load dashboard stats" });
  }
});

module.exports = router;
