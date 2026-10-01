import React, { useEffect, useState } from "react";
import "./Sales.css";
import "./chartSetup";
import { Line, Bar } from "react-chartjs-2";
import { api } from "./api";

const CATEGORY_BAR_COLORS = ["gold-bar", "green-bar", "blue-bar", "purple-bar", "red-bar"];

function Sales({
  onDashboard,
  onOrders,
  onProducts,
  onCustomers,
  onInventory,
  onSales,
  onReports,
  onLogout,
}) {
  const [loaded, setLoaded] = useState(false);
  const [summary, setSummary] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    delivered: 0,
    pending: 0,
    cancelled: 0,
    months: [],
    topProducts: [],
    topCategories: [],
    paymentBreakdown: [],
  });
  const [error, setError] = useState("");

  useEffect(() => {
    setTimeout(() => setLoaded(true), 200);
    loadSummary();
  }, []);

  const loadSummary = async () => {
    setError("");
    try {
      const data = await api.getSalesSummary();
      setSummary((prev) => ({ ...prev, ...data }));
    } catch (err) {
      setError("Could not load sales data. Is the backend running?");
    }
  };

  const lineData = {
    labels: summary.months.map((m) => m.label),
    datasets: [
      {
        label: "Sales",
        data: summary.months.map((m) => m.revenue),
        borderColor: "#f4b400",
        backgroundColor: "rgba(244,180,0,0.15)",
        tension: 0.4,
      },
    ],
  };

  const barData = {
    labels: summary.months.map((m) => m.label),
    datasets: [
      {
        label: "Delivered",
        data: summary.months.map((m) => m.delivered),
        backgroundColor: "#f4b400",
      },
      {
        label: "Pending",
        data: summary.months.map((m) => m.pending),
        backgroundColor: "#333",
      },
    ],
  };

  const badgeLabel = (badge) => {
    if (badge === "high") return "High";
    if (badge === "medium") return "Medium";
    return "Low";
  };

  return (
    <div className={`sales-dashboard ${loaded ? "loaded" : ""}`}>

      {/* SIDEBAR */}
      <div className="mg-sidebar">
        <h2>Mahajana Mill</h2>

        <div className="menu" onClick={onDashboard}>Dashboard</div>
        <div className="menu" onClick={onOrders}>Orders</div>
        <div className="menu" onClick={onCustomers}>Customers</div>
        <div className="menu" onClick={onInventory}>Inventory</div>
        <div className="menu active">Sales</div>
        <div className="menu logout" onClick={onLogout}>Logout</div>
      </div>

      {/* MAIN */}
      <main className="sales-main fade-in">

        <div className="sales-navbar">
          <div>
            <h2 className="glow-text">Sales Analytics</h2>
            <p>Mahajana Grinding Mill Dashboard</p>
          </div>
        </div>

        {error && <p style={{ color: "#e05c4f" }}>{error}</p>}

        {/* KPI */}
        <div className="kpi-grid">
          <div className="kpi-card gold">Total Orders <h2>{summary.totalOrders}</h2></div>
          <div className="kpi-card green">Revenue <h2>Rs. {Number(summary.totalRevenue).toLocaleString()}</h2></div>
          <div className="kpi-card blue">Delivered <h2>{summary.delivered}</h2></div>
          <div className="kpi-card orange">Pending <h2>{summary.pending}</h2></div>
          <div className="kpi-card red">Cancelled <h2>{summary.cancelled}</h2></div>
        </div>

        {/* CHARTS */}
        <div className="chart-grid">
          <div className="panel">
            <h3>Monthly Sales Trend (last 6 months)</h3>
            <Line data={lineData} />
          </div>

          <div className="panel">
            <h3>Orders Overview (last 6 months)</h3>
            <Bar data={barData} />
          </div>
        </div>

        {/* TOP PRODUCTS - Full Row */}
        <div className="panel full-row-panel">
          <h3> Top Products</h3>
          <table className="product-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Units Sold</th>
                <th>Revenue</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {summary.topProducts.length === 0 && (
                <tr><td colSpan="4" style={{ textAlign: "center", padding: 20 }}>No sales yet.</td></tr>
              )}
              {summary.topProducts.map((p, i) => (
                <tr key={i}>
                  <td>{p.name}</td>
                  <td>{p.orders}</td>
                  <td>Rs. {p.revenue}</td>
                  <td><span className={`badge ${p.badge}`}>{badgeLabel(p.badge)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* OTHER 3 PANELS - Below */}
        <div className="bottom-grid">
          <div className="panel slide-up">
            <h3> Top Categories</h3>
            <div className="category-list">
              {summary.topCategories.length === 0 && <p style={{ color: "#bdbdbd" }}>No sales yet.</p>}
              {summary.topCategories.map((c, i) => (
                <div className="cat-item" key={i}>
                  <span>{c.category}</span>
                  <div className="cat-bar" style={{ width: `${c.percent}%` }}></div>
                  <span>{c.percent}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel slide-up delay-1">
            <h3> Revenue by Category</h3>
            <div className="category-list">
              {summary.topCategories.length === 0 && <p style={{ color: "#bdbdbd" }}>No sales yet.</p>}
              {summary.topCategories.map((c, i) => (
                <div className="cat-item" key={i}>
                  <span>{c.category}</span>
                  <div
                    className={`cat-bar ${CATEGORY_BAR_COLORS[i % CATEGORY_BAR_COLORS.length]}`}
                    style={{ width: `${c.percent}%` }}
                  ></div>
                  <span>Rs. {c.revenue}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel slide-up delay-2">
            <h3> Orders by Payment Method</h3>
            <div className="category-list">
              {summary.paymentBreakdown.length === 0 && <p style={{ color: "#bdbdbd" }}>No orders yet.</p>}
              {summary.paymentBreakdown.map((p, i) => (
                <div className="cat-item" key={i}>
                  <span>{p.method}</span>
                  <div
                    className={`cat-bar ${CATEGORY_BAR_COLORS[i % CATEGORY_BAR_COLORS.length]}`}
                    style={{ width: `${p.percent}%` }}
                  ></div>
                  <span>{p.count} orders</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Sales;
