import React, { useEffect, useState } from "react";
import "./CustomerDashboard.css";
import { api } from "./api";

const STATUS_STEPS = ["Pending", "Shipped", "Delivered"];

function CustomerDashboard({ user, onProducts, onLogout }) {
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState("dashboard"); // dashboard | orders | profile | contact

  const [orderLines, setOrderLines] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setTimeout(() => setLoaded(true), 200);
    loadData();
    loadRecentlyViewed();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [rows, productRows] = await Promise.all([
        user?.email ? api.getOrders(user.email) : Promise.resolve([]),
        api.getProducts(),
      ]);

      setOrderLines(
        rows.map((r) => ({
          orderId: r.orderId,
          id: `MG${String(r.orderId).padStart(3, "0")}`,
          product: r.product,
          qty: r.qty,
          price: r.price,
          status: r.status,
          date: r.date,
          orderTotal: Number(r.orderTotal ?? r.price),
        }))
      );

      const shuffled = [...productRows].sort(() => Math.random() - 0.5);
      setRecommended(shuffled.slice(0, 8));
    } catch (err) {
      setError("Could not load your dashboard. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const loadRecentlyViewed = () => {
    try {
      const raw = localStorage.getItem("mahajana_recently_viewed");
      setRecentlyViewed(raw ? JSON.parse(raw).slice(0, 6) : []);
    } catch {
      setRecentlyViewed([]);
    }
  };

  const displayName = user?.customer_name || "Customer";

  // group flat order-line rows into real invoices, one per order id
  const invoiceMap = {};
  orderLines.forEach((line) => {
    if (!invoiceMap[line.orderId]) {
      invoiceMap[line.orderId] = {
        orderId: line.orderId,
        id: line.id,
        date: line.date,
        status: line.status,
        total: line.orderTotal,
        items: [],
      };
    }
    invoiceMap[line.orderId].items.push(line);
  });
  const invoices = Object.values(invoiceMap); // already DESC by date from backend

  const totalOrders = invoices.length;
  const totalSpent = invoices.reduce((sum, o) => sum + o.total, 0);
  const latestOrder = invoices[0];
  const latestStepIndex = latestOrder ? STATUS_STEPS.indexOf(latestOrder.status) : -1;

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const menuItem = (key, icon, label) => (
    <div
      className={`cd-item ${view === key ? "active" : ""}`}
      onClick={() => { setView(key); scrollTop(); }}
    >
      <span className="cd-item-icon">{icon}</span> {label}
    </div>
  );

  const statusBadgeClass = (status) => {
    if (status === "Delivered") return "delivered";
    if (status === "Shipped") return "shipped";
    if (status === "Cancelled") return "cancelled";
    return "pending";
  };

  return (
    <div className={`cd-layout ${loaded ? "show" : ""}`}>

      {/* SIDEBAR */}
      <aside className="cd-sidebar">
        <div className="cd-logo">
          <span className="cd-logo-icon"></span>
          MAHAJANA MILL
          <span>Customer Dashboard</span>
        </div>

        <div className="cd-menu">
          {menuItem("dashboard", "", "Dashboard")}
          <div className="cd-item" onClick={onProducts}>
            <span className="cd-item-icon"></span> Products
          </div>
          {menuItem("orders", "", "My Orders")}
          {menuItem("profile", "", "My Profile")}
          {menuItem("contact", "", "Contact Us")}
        </div>

        <div className="cd-item cd-logout" onClick={onLogout}>
          <span className="cd-item-icon"></span> Logout
        </div>
      </aside>

      {/* MAIN */}
      <main className="cd-main">

        {error && <div className="cd-error">{error}</div>}

        {/* ================= DASHBOARD PAGE ================= */}
        {view === "dashboard" && (
          <>
            <div className="cd-welcome">
              <h1> Welcome Back, <span>{displayName}</span></h1>
              <p>Shop fresh products & track your orders easily</p>
            </div>

            {/* STATS */}
            <div className="cd-stats">
              <div className="cd-stat-card">
                <div className="cd-stat-icon gold"></div>
                <div>
                  <div className="cd-stat-value">{loading ? "…" : totalOrders}</div>
                  <div className="cd-stat-label">Total Orders</div>
                </div>
              </div>
              <div className="cd-stat-card">
                <div className="cd-stat-icon gold"></div>
                <div>
                  <div className="cd-stat-value">Rs. {loading ? "…" : totalSpent.toLocaleString()}</div>
                  <div className="cd-stat-label">Total Spent</div>
                </div>
              </div>
            </div>

            {/* DELIVERY TRACKING */}
            <h2 className="cd-title"> Delivery Tracking</h2>
            <div className="cd-panel">
              {!loading && !latestOrder && (
                <p className="cd-muted">No orders to track yet.</p>
              )}

              {latestOrder && (
                <>
                  <p className="cd-muted" style={{ marginBottom: 20 }}>
                    Order <b className="cd-gold-text">{latestOrder.id}</b> — placed {latestOrder.date}
                  </p>

                  <div className="cd-tracker">
                    {STATUS_STEPS.map((step, i) => (
                      <React.Fragment key={step}>
                        <div className="cd-tracker-step">
                          <div className={`cd-tracker-dot ${i <= latestStepIndex ? "done" : ""}`}>
                            {i < latestStepIndex ? "✓" : i + 1}
                          </div>
                          <span className={i <= latestStepIndex ? "cd-gold-text" : ""}>{step}</span>
                        </div>
                        {i < STATUS_STEPS.length - 1 && (
                          <div className={`cd-tracker-line ${i < latestStepIndex ? "done" : ""}`} />
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {latestOrder.status === "Cancelled" && (
                    <p className="cd-cancelled-note">This order was cancelled.</p>
                  )}
                </>
              )}
            </div>

            {/* RECENTLY VIEWED */}
            <h2 className="cd-title"> Recently Viewed</h2>
            <div className="cd-products">
              {recentlyViewed.length === 0 && (
                <p className="cd-muted">Nothing viewed yet — browse products and they'll show up here.</p>
              )}
              {recentlyViewed.map((p, i) => (
                <div key={i} className="cd-product-card" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="cd-icon"></div>
                  <h3>{p.name}</h3>
                  <p>Rs. {p.basePrice}</p>
                  <button onClick={onProducts}>View Again</button>
                </div>
              ))}
            </div>

            {/* RECOMMENDED PRODUCTS */}
            <h2 className="cd-title"> Recommended Products</h2>
            <div className="cd-products">
              {loading && <p className="cd-muted">Loading...</p>}
              {!loading && recommended.map((p, i) => (
                <div key={i} className="cd-product-card" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="cd-icon">🛍️</div>
                  <h3>{p.name}</h3>
                  <p>Rs. {p.basePrice}</p>
                  <button onClick={onProducts}>Buy Now</button>
                </div>
              ))}
            </div>

            {/* LATEST ORDERS (preview) */}
            <h2 className="cd-title"> Latest Orders</h2>
            <div className="cd-panel" style={{ padding: 0, overflowX: "auto" }}>
              {!loading && invoices.length === 0 && (
                <p className="cd-muted" style={{ padding: 24 }}>You haven't placed any orders yet.</p>
              )}

              {invoices.length > 0 && (
                <table className="cd-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.slice(0, 5).map((inv, i) => (
                      <tr key={i} className="cd-row" style={{ animationDelay: `${i * 0.06}s` }}>
                        <td className="cd-id">{inv.id}</td>
                        <td>{inv.date}</td>
                        <td>{inv.items.length} item{inv.items.length > 1 ? "s" : ""}</td>
                        <td className="cd-gold-text">Rs. {inv.total}</td>
                        <td>
                          <span className={`cd-badge ${statusBadgeClass(inv.status)}`}>{inv.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {invoices.length > 5 && (
                <div style={{ padding: 18, textAlign: "center" }}>
                  <button className="cd-link-btn" onClick={() => { setView("orders"); scrollTop(); }}>
                    View All Orders →
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* ================= MY ORDERS PAGE (invoice style) ================= */}
        {view === "orders" && (
          <>
            <div className="cd-welcome">
              <h1> My Orders</h1>
              <p>Your complete order history</p>
            </div>

            {!loading && invoices.length === 0 && (
              <div className="cd-panel">
                <p className="cd-muted">You haven't placed any orders yet.</p>
              </div>
            )}

            <div className="cd-invoice-list">
              {invoices.map((inv, i) => (
                <div className="cd-invoice" key={i} style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="cd-invoice-head">
                    <div>
                      <div className="cd-invoice-id">Invoice {inv.id}</div>
                      <div className="cd-muted small">{inv.date}</div>
                    </div>
                    <span className={`cd-badge ${statusBadgeClass(inv.status)}`}>{inv.status}</span>
                  </div>

                  <div className="cd-invoice-items">
                    {inv.items.map((it, j) => (
                      <div className="cd-invoice-item" key={j}>
                        <span>{it.product} × {it.qty}</span>
                        <span>Rs. {it.price}</span>
                      </div>
                    ))}
                  </div>

                  <div className="cd-invoice-footer">
                    <span>Total</span>
                    <b className="cd-gold-text">Rs. {inv.total}</b>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ================= MY PROFILE PAGE ================= */}
        {view === "profile" && (
          <>
            <div className="cd-welcome">
              <h1> My Profile</h1>
              <p>Your account details</p>
            </div>

            <div className="cd-panel cd-profile-grid">
              <div className="cd-profile-field">
                <div className="cd-profile-icon">👤</div>
                <div>
                  <div className="cd-profile-label">Full Name</div>
                  <div className="cd-profile-value">{user?.customer_name || "—"}</div>
                </div>
              </div>
              <div className="cd-profile-field">
                <div className="cd-profile-icon"></div>
                <div>
                  <div className="cd-profile-label">Email</div>
                  <div className="cd-profile-value">{user?.email || "—"}</div>
                </div>
              </div>
              <div className="cd-profile-field">
                <div className="cd-profile-icon"></div>
                <div>
                  <div className="cd-profile-label">Phone</div>
                  <div className="cd-profile-value">{user?.phone || "—"}</div>
                </div>
              </div>
              <div className="cd-profile-field">
                <div className="cd-profile-icon"></div>
                <div>
                  <div className="cd-profile-label">Address</div>
                  <div className="cd-profile-value">{user?.address || "—"}</div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ================= CONTACT US PAGE ================= */}
        {view === "contact" && (
          <>
            <div className="cd-welcome">
              <h1> Contact Us</h1>
              <p>We're here to help</p>
            </div>

            <div className="cd-panel cd-contact-grid">
              <div className="cd-profile-field">
                <div className="cd-profile-icon"></div>
                <div>
                  <div className="cd-profile-label">Location</div>
                  <div className="cd-profile-value">Sri Lanka</div>
                </div>
              </div>
              <div className="cd-profile-field">
                <div className="cd-profile-icon"></div>
                <div>
                  <div className="cd-profile-label">Phone</div>
                  <div className="cd-profile-value">+94 XX XXX XXXX</div>
                </div>
              </div>
              <div className="cd-profile-field">
                <div className="cd-profile-icon"></div>
                <div>
                  <div className="cd-profile-label">Email</div>
                  <div className="cd-profile-value">info@mahajana.com</div>
                </div>
              </div>
              <div className="cd-profile-field">
                <div className="cd-profile-icon"></div>
                <div>
                  <div className="cd-profile-label">Hours</div>
                  <div className="cd-profile-value">8AM – 6PM</div>
                </div>
              </div>
            </div>
          </>
        )}

      </main>
    </div>
  );
}

export default CustomerDashboard;