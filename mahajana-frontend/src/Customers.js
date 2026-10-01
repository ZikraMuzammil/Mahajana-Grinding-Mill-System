import React, { useState, useEffect } from "react";
import "./Customers.css";
import { api } from "./api";

function Customers({ onDashboard, onOrders, onInventory, onSales, onLogout }) {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    setError("");

    try {
      const rows = await api.getCustomers();

      const formatted = rows.map((c) => ({
        id: `C${String(c.id).padStart(3, "0")}`,
        name: c.customer_name || "",
        email: c.email || "",
        phone: c.phone || "",
        address: c.address || "",
        orders: Number(c.orders ?? 0),
        total: Number(c.total ?? 0).toFixed(2),
      }));

      setCustomers(formatted);
    } catch (err) {
      console.error(err);
      setError("Could not load customers. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const q = search.toLowerCase();
  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(search) ||
      c.id.toLowerCase().includes(q)
  );

  return (
    <div className="mg-layout">
      {/* Sidebar */}
      <div className="mg-sidebar">
        <h2>Mahajana Mill</h2>

        <div className="menu" onClick={onDashboard}>Dashboard</div>
        <div className="menu" onClick={onOrders}>Orders</div>
        <div className="menu active">Customers</div>
        <div className="menu" onClick={onInventory}>Inventory</div>
        <div className="menu" onClick={onSales}>Sales</div>

        <div className="menu logout" onClick={onLogout}>
          Logout
        </div>
      </div>

      {/* Main */}
      <div className="mg-main">
        <div className="mg-topbar">
          <h1>Customers</h1>

          <input
            className="mg-search"
            placeholder="Search customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {error && <p style={{ color: "#ff6666" }}>{error}</p>}

        <div className="mg-table-card fade-in">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Orders</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: 30 }}>
                    Loading...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: 30 }}>
                    No customers found.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.name}</td>
                    <td>{c.email}</td>
                    <td>{c.phone}</td>
                    <td>{c.address}</td>
                    <td>{c.orders}</td>
                    <td>Rs. {c.total}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Customers;
