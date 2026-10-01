import React, { useState, useEffect } from "react";
import "./Orders.css";
import { api } from "./api";

function Orders({
  onDashboard,
  onCustomers,
  onInventory,
  onSales,
  onLogout,
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const rows = await api.getOrders();
      // backend already returns id/customer/category/product/date/qty/price/payment/status
      setOrders(
        rows.map((r) => ({
          id: `MG${String(r.orderId).padStart(3, "0")}`,
          customer: r.customer,
          category: r.category,
          product: r.product,
          date: r.date,
          qty: r.qty,
          price: r.price,
          payment: r.payment,
          status: r.status,
        }))
      );
    } catch (err) {
      setError("Could not load orders. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders
    .filter((o) => filter === "All" || o.status === filter)
    .filter(
      (o) =>
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.toLowerCase().includes(search.toLowerCase()) ||
        o.product.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="mg-layout">
      {/* SIDEBAR */}
      <div className="mg-sidebar">
        <h2>Mahajana Mill</h2>

        <div className="menu" onClick={onDashboard}>Dashboard</div>
        <div className="menu active">Orders</div>
        <div className="menu" onClick={onCustomers}>Customers</div>
        <div className="menu" onClick={onInventory}>Inventory</div>
        <div className="menu" onClick={onSales}>Sales</div>

        <div className="menu logout" onClick={onLogout}>Logout</div>
      </div>

      {/* MAIN */}
      <div className="mg-main">
        {/* TOPBAR */}
        <div className="mg-topbar">
          <h1>Orders Dashboard</h1>

          <input
            className="mg-search"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* FILTER BUTTONS */}
        <div className="mg-filters">
          {["All", "Pending", "Shipped", "Delivered"].map((f) => (
            <button
              key={f}
              className={filter === f ? "active" : ""}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
          <button onClick={loadOrders} disabled={loading}>
            {loading ? "Refreshing..." : "↻ Refresh"}
          </button>
        </div>

        {error && <p className="mg-error">{error}</p>}

        {/* TABLE */}
        <div className="mg-table-card">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Category</th>
                <th>Product</th>
                <th>Date</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {!loading && filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center", padding: "30px" }}>
                    No orders yet.
                  </td>
                </tr>
              )}

              {filteredOrders.map((o, i) => (
                <tr key={i} className="fade">
                  <td>{o.id}</td>
                  <td>{o.customer}</td>
                  <td>{o.category}</td>
                  <td>{o.product}</td>
                  <td>{o.date}</td>
                  <td>{o.qty}</td>
                  <td>Rs. {o.price}</td>
                  <td>{o.payment}</td>

                  <td>
                    <span className={`status ${o.status.toLowerCase()}`}>
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Orders;
