import React, { useState, useEffect } from "react";
import "./SellerDashboard.css";
import { api } from "./api";

function SellerDashboard({
  onAddProduct,
  onViewOrders,
  onViewCustomers,
  onInventory,
  onSales,
  onLogout
}) {
  const [active, setActive] = useState("dashboard");

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    monthlySales: [],
    stockStatus: [],
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.getDashboardStats();
      // merge with defaults rather than replacing outright — protects
      // against an older backend response that's missing a newer field
      setStats((prev) => ({ ...prev, ...data }));
    } catch (err) {
      setError("Could not load dashboard data. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleMenu = (menu, callback) => {
    setActive(menu);
    if (callback) callback();
  };

  const statusClass = (status) => {
    if (status === "Out of Stock") return "stock-out";
    if (status === "Low Stock") return "stock-low";
    return "stock-ok";
  };

  const orderStatusClass = (status) => {
    if (status === "Delivered") return "order-delivered";
    if (status === "Shipped") return "order-shipped";
    return "order-pending";
  };

  return (
    <div className="dashboard-layout">

      {/* ================= SIDEBAR ================= */}
      <div className="sidebar">
        <h2 className="logo">Mahajana Mill</h2>

        <div
          className={`menu ${active === "dashboard" ? "active" : ""}`}
          onClick={() => handleMenu("dashboard")}
        >
          Dashboard
        </div>

        <div
          className={`menu ${active === "orders" ? "active" : ""}`}
          onClick={() => handleMenu("orders", onViewOrders)}
        >
          Orders
        </div>

        <div
          className={`menu ${active === "customers" ? "active" : ""}`}
          onClick={() => handleMenu("customers", onViewCustomers)}
        >
          Customers
        </div>

        <div
          className={`menu ${active === "inventory" ? "active" : ""}`}
          onClick={() => handleMenu("inventory", onInventory)}
        >
          Inventory
        </div>

        <div
          className={`menu ${active === "sales" ? "active" : ""}`}
          onClick={() => handleMenu("sales", onSales)}
        >
          Sales
        </div>

        <div className="menu logout" onClick={onLogout}>
          Logout
        </div>
      </div>

      {/* ================= MAIN ================= */}
      <div className="main">

        {/* DASHBOARD */}
        {active === "dashboard" && (
          <div className="fade-in">

            <h1 style={{ color: "gold" }}>Seller Dashboard</h1>
            <p>Welcome to Mahajana Grinding Mill System</p>

            {error && <p style={{ color: "#e05c4f", marginTop: 12 }}>{error}</p>}

            {/* CARDS */}
            <div className="overview-grid">
              <div className="overview-card">Products <h2>{loading ? "…" : stats.totalProducts}</h2></div>
              <div className="overview-card">Categories <h2>{loading ? "…" : stats.totalCategories}</h2></div>
              <div className="overview-card">Orders <h2>{loading ? "…" : stats.totalOrders}</h2></div>
              <div className="overview-card">Customers <h2>{loading ? "…" : stats.totalCustomers}</h2></div>
              <div className="overview-card">Revenue <h2>{loading ? "…" : `Rs. ${Number(stats.totalRevenue).toLocaleString()}`}</h2></div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="quick-actions">
              <h2 className="quick-title"> Quick Actions</h2>

              <div className="quick-row">
                <button className="quick-btn" onClick={onAddProduct}>
                  Add Product
                </button>

                <button className="quick-btn" onClick={onViewOrders}>
                  View Orders
                </button>

                <button className="quick-btn" onClick={() => handleMenu("inventory", onInventory)}>
                  Manage Stock
                </button>
              </div>
            </div>

            {/* ANALYTICS */}
            <div className="dashboard-content">

              <div className="sales-section">
                <h2>Sales Analytics (last 6 months)</h2>

                {loading && <p style={{ color: "#bdbdbd", marginTop: 10 }}>Loading...</p>}

                {!loading && stats.monthlySales.length === 0 && (
                  <p style={{ color: "#bdbdbd", marginTop: 10 }}>No orders yet — this fills in as real orders come in.</p>
                )}

                {stats.monthlySales.map((item, i) => (
                  <div className="sales-item" key={i}>
                    <span>{item.month}</span>
                    <div className="bar">
                      <div className="fill" style={{ width: item.value }}></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="stock-section">
                <h2>Stock Status</h2>

                {loading && <p style={{ color: "#bdbdbd", marginTop: 10 }}>Loading...</p>}

                {stats.stockStatus.map((item, i) => (
                  <div className={`stock-item ${statusClass(item.status)}`} key={i}>
                    {item.name} - {item.status}
                  </div>
                ))}
              </div>

            </div>

            {/* RECENT ORDERS */}
            <div className="recent-orders" style={{ marginTop: 20 }}>
              <h2> Recent Orders</h2>

              {loading && <p style={{ color: "#bdbdbd", marginTop: 10 }}>Loading...</p>}

              {!loading && stats.recentOrders.length === 0 && (
                <p style={{ color: "#bdbdbd", marginTop: 10 }}>No orders placed yet.</p>
              )}

              {!loading && stats.recentOrders.length > 0 && (
                <table className="recent-orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Placed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders.map((o, i) => (
                      <tr key={i}>
                        <td>{o.id}</td>
                        <td>{o.customer}</td>
                        <td>Rs. {o.total}</td>
                        <td>
                          <span className={`order-status ${orderStatusClass(o.status)}`}>
                            {o.status}
                          </span>
                        </td>
                        <td>{o.placedAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ORDERS */}
        {active === "orders" && (
          <div className="fade-in">
            <h2> Orders Section</h2>
          </div>
        )}

        {/* CUSTOMERS */}
        {active === "customers" && (
          <div className="fade-in">
            <h2>Customers Section</h2>
          </div>
        )}

        {/* INVENTORY */}
        {active === "inventory" && (
          <div className="fade-in">
            <h2> Inventory Section</h2>
          </div>
        )}

        {/* SALES */}
        {active === "sales" && (
          <div className="fade-in">
            <h2> Sales Analytics</h2>
          </div>
        )}

      </div>
    </div>
  );
}

export default SellerDashboard;
