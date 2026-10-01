import React, { useState, useEffect } from "react";
import "./Inventory.css";
import { api } from "./api";

const WEIGHTS = ["100g", "200g", "500g", "750g", "1kg"];

function Inventory({
  onDashboard,
  onOrders,
  onCustomers,
  onsales,
  onAddProduct,
  onLogout,
}) {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // holds in-progress edits per product id: { [id]: { "100g": "42", ... } }
  const [edits, setEdits] = useState({});
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const rows = await api.getProducts();
      setProducts(rows);
      setEdits({});
    } catch (err) {
      setError("Could not load inventory. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (stock) => {
    const values = WEIGHTS.map((w) => stock[w] ?? 0);
    const min = Math.min(...values);
    if (min <= 0) return "OUT";
    if (min < 10) return "LOW";
    return "OK";
  };

  const isEditing = (id) => Boolean(edits[id]);

  const startEdit = (product) => {
    setEdits((prev) => ({
      ...prev,
      [product.id]: { ...product.stock },
    }));
  };

  const changeEditValue = (id, weight, value) => {
    setEdits((prev) => ({
      ...prev,
      [id]: { ...prev[id], [weight]: value },
    }));
  };

  const cancelEdit = (id) => {
    setEdits((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const saveStock = async (product) => {
    setSavingId(product.id);
    try {
      const newStock = {};
      WEIGHTS.forEach((w) => {
        newStock[w] = Math.max(0, Number(edits[product.id][w]) || 0);
      });

      await api.updateProduct(product.id, {
        name: product.name,
        category: product.category,
        subcategory: product.subcategory,
        basePrice: product.basePrice,
        stock: newStock,
      });

      cancelEdit(product.id);
      await loadProducts();
    } catch (err) {
      alert(err.message || "Failed to update stock");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}" completely? This cannot be undone.`)) return;
    try {
      await api.deleteProduct(product.id);
      await loadProducts();
    } catch (err) {
      alert(err.message || "Failed to delete product");
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const totalCategories = new Set(products.map((p) => p.category)).size;
  const availableCount = products.filter((p) => getStatus(p.stock) === "OK").length;
  const lowCount = products.filter((p) => getStatus(p.stock) === "LOW").length;
  const outCount = products.filter((p) => getStatus(p.stock) === "OUT").length;

  return (
    <div className="inventory-layout">

      {/* SIDEBAR */}
      <div className="inventory-sidebar">
        <h2>Mahajana Mill</h2>

        <div className="menu" onClick={onDashboard}>Dashboard</div>
        <div className="menu" onClick={onOrders}>Orders</div>
        <div className="menu" onClick={onCustomers}>Customers</div>
        <div className="menu active">Inventory</div>
        <div className="menu" onClick={onsales}>sales</div>
        <div className="menu logout" onClick={onLogout}>
          Logout
        </div>
      </div>

      {/* MAIN */}
      <div className="inventory-main">

        <div className="inventory-topbar">
          <h1>Inventory Management</h1>

          <input
            type="text"
            placeholder="Search product or category..."
            className="inventory-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            onClick={onAddProduct}
            style={{
              marginLeft: 12,
              padding: "10px 18px",
              borderRadius: 8,
              border: "1px solid #f4b400",
              background: "transparent",
              color: "#f4b400",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            + Add Product
          </button>
        </div>

        {error && <p style={{ color: "#e05c4f" }}>{error}</p>}

        {/* CARDS */}
        <div className="inventory-cards">

          <div className="inventory-card">
            <h3>Total Categories</h3>
            <h2>{totalCategories}</h2>
          </div>

          <div className="inventory-card">
            <h3>Available Products</h3>
            <h2>{availableCount}</h2>
          </div>

          <div className="inventory-card">
            <h3>Low Stock</h3>
            <h2>{lowCount}</h2>
          </div>

          <div className="inventory-card">
            <h3>Out of Stock</h3>
            <h2>{outCount}</h2>
          </div>

        </div>

        {/* TABLE — per-weight stock, editable, straight from MySQL */}
        <div className="inventory-table-card" style={{ overflowX: "auto" }}>

          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                {WEIGHTS.map((w) => (
                  <th key={w}>{w}</th>
                ))}
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={WEIGHTS.length + 4} style={{ textAlign: "center", padding: "30px" }}>
                    No products found.
                  </td>
                </tr>
              )}

              {filtered.map((p) => {
                const status = getStatus(p.stock);
                const editing = isEditing(p.id);

                return (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.category}</td>

                    {WEIGHTS.map((w) => (
                      <td key={w}>
                        {editing ? (
                          <input
                            type="number"
                            value={edits[p.id][w]}
                            onChange={(e) => changeEditValue(p.id, w, e.target.value)}
                            style={{ width: 60, padding: 4, borderRadius: 4, border: "1px solid #f4b400", background: "#111", color: "#fff" }}
                          />
                        ) : (
                          p.stock[w] ?? 0
                        )}
                      </td>
                    ))}

                    <td>
                      <span
                        className={`status ${
                          status === "OK" ? "ok" : status === "LOW" ? "low" : "out"
                        }`}
                      >
                        {status}
                      </span>
                    </td>

                    <td style={{ whiteSpace: "nowrap" }}>
                      {editing ? (
                        <>
                          <button
                            onClick={() => saveStock(p)}
                            disabled={savingId === p.id}
                            style={{ marginRight: 6, padding: "5px 10px", borderRadius: 6, border: "none", background: "#f4b400", color: "#000", fontWeight: 600, cursor: "pointer" }}
                          >
                            {savingId === p.id ? "..." : "Save"}
                          </button>
                          <button
                            onClick={() => cancelEdit(p.id)}
                            style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #666", background: "transparent", color: "#ccc", cursor: "pointer" }}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(p)}
                            style={{ marginRight: 6, padding: "5px 10px", borderRadius: 6, border: "1px solid #f4b400", background: "transparent", color: "#f4b400", cursor: "pointer" }}
                          >
                            Edit Stock
                          </button>
                          <button
                            onClick={() => handleDelete(p)}
                            style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #e05c4f", background: "transparent", color: "#e05c4f", cursor: "pointer" }}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Inventory;
