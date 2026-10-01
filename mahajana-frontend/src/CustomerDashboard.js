import React, { useEffect, useState } from "react";
import "./CustomerDashboard.css";
import { api } from "./api";
import { getProductImage, onImgError } from "./productImage";

const STATUS_STEPS = ["Pending", "Shipped", "Delivered"];
const REFRESH_MS = 15000; // reload data every 15 seconds

// Which page opens after the customer clicks OK on the "order placed" box:
// "dashboard" = main dashboard, "orders" = My Orders page
const OPEN_VIEW_AFTER_ORDER = "dashboard";

// Shows one line at the top with the login email/id and how many orders loaded.
// Set to false when everything works.
const SHOW_DEBUG = true;

const formatDate = (d) => {
  if (!d) return "-";
  const date = new Date(d);
  return isNaN(date) ? String(d) : date.toLocaleDateString();
};

// "pending", " PENDING " -> "Pending"
const normStatus = (s) => {
  const t = String(s || "Pending").trim().toLowerCase();
  return t.charAt(0).toUpperCase() + t.slice(1);
};

// The login response may name these fields differently, so accept common names.
const getUserId = (u) => u?.id ?? u?.customer_id ?? u?.customerId ?? null;
const getUserEmail = (u) => u?.email ?? u?.customer_email ?? null;

function CustomerDashboard({ user, onProducts, onLogout }) {
  const userId = getUserId(user);
  const userEmail = getUserEmail(user);

  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState("dashboard"); // dashboard | orders | profile | contact

  const [profile, setProfile] = useState(user || {});
  const [orderLines, setOrderLines] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const [contactForm, setContactForm] = useState({
    name: user?.customer_name || "",
    email: userEmail || "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  // first load + automatic refresh + refresh when the tab is focused again
  useEffect(() => {
    setTimeout(() => setLoaded(true), 200);
    loadData(false);
    loadRecentlyViewed();
    checkOrderNotice();

    const timer = setInterval(() => {
      loadData(true);
      loadRecentlyViewed();
      checkOrderNotice();
    }, REFRESH_MS);

    const onFocus = () => {
      loadData(true);
      loadRecentlyViewed();
      checkOrderNotice();
    };
    window.addEventListener("focus", onFocus);

    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", onFocus);
    };
    // eslint-disable-next-line
  }, []);

  // silent = true means do not show the loading state (background refresh)
  const loadData = async (silent) => {
    if (!silent) setLoading(true);
    setError("");

    // temporary check: open F12 > Console to see what the login gave us
    console.log("Dashboard user:", user);

    const [ordersRes, profRes] = await Promise.allSettled([
      userEmail || userId
        ? api.getOrders(userEmail, userId)
        : Promise.resolve([]),
      userEmail ? api.getProfile(userEmail) : Promise.resolve(null),
    ]);

    // ORDERS
    if (ordersRes.status === "fulfilled") {
      setOrderLines(
        ordersRes.value.map((r) => ({
          orderId: Number(r.orderId),
          id: `MG${String(r.orderId).padStart(3, "0")}`,
          product: r.product,
          image: r.image,
          category: r.category,
          qty: r.qty,
          price: r.price,
          status: normStatus(r.status),
          date: formatDate(r.date),
          orderTotal: Number(r.orderTotal ?? r.price),
          paymentMethod: r.paymentMethod,
          address: r.address,
        }))
      );
    } else {
      console.error("Orders failed:", ordersRes.reason);
      setError(
        `Could not load your orders: ${ordersRes.reason?.message || "backend error"}`
      );
    }

    // RECOMMENDED: one product from each category
    try {
      const all = await api.getProducts();

      const byCat = {};
      all.forEach((p) => {
        const c = p.category || "other";
        if (!byCat[c]) byCat[c] = [];
        byCat[c].push(p);
      });

      const picks = Object.values(byCat).map((list) => list[0]);

      setRecommended(picks.length >= 4 ? picks.slice(0, 8) : all.slice(0, 8));
    } catch (err) {
      console.error("Recommended failed:", err);
    }

    // PROFILE
    if (profRes.status === "fulfilled" && profRes.value) {
      setProfile({ ...user, ...profRes.value });
    } else if (profRes.status === "rejected") {
      console.error("Profile failed:", profRes.reason);
    }

    setLastUpdated(new Date());
    setLoading(false);
  };

  // after an order was placed, open the My Orders page and reload the data
  const checkOrderNotice = () => {
    try {
      const raw = localStorage.getItem("mahajana_order_success");
      if (!raw) return;

      localStorage.removeItem("mahajana_order_success");
      setView(OPEN_VIEW_AFTER_ORDER);
      scrollTop();
      loadData(true);
    } catch {
      localStorage.removeItem("mahajana_order_success");
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

  const handleContactSubmit = async (e) => {
    e.preventDefault();

    if (
      !contactForm.name.trim() ||
      !contactForm.email.trim() ||
      !contactForm.message.trim()
    ) {
      alert("Please fill all fields");
      return;
    }

    setSending(true);
    try {
      await api.sendContact(contactForm);
      alert("Message sent successfully!");
      setContactForm({ ...contactForm, message: "" });
    } catch {
      alert("Could not send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const displayName = profile?.customer_name || "Customer";
  const noIdentity = !userEmail && !userId;

  // group flat order-line rows into invoices, one per order id
  const invoiceMap = {};
  orderLines.forEach((line) => {
    if (!invoiceMap[line.orderId]) {
      invoiceMap[line.orderId] = {
        orderId: line.orderId,
        id: line.id,
        date: line.date,
        status: line.status,
        total: line.orderTotal,
        paymentMethod: line.paymentMethod,
        address: line.address,
        items: [],
      };
    }
    invoiceMap[line.orderId].items.push(line);
  });

  // newest order first (highest order id = newest)
  const invoices = Object.values(invoiceMap).sort(
    (a, b) => b.orderId - a.orderId
  );

  const totalOrders = invoices.length;
  const totalSpent = invoices.reduce((sum, o) => sum + o.total, 0);
  const latestOrder = invoices[0];
  const latestStepIndex = latestOrder
    ? STATUS_STEPS.indexOf(latestOrder.status)
    : -1;

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const menuItem = (key, label) => (
    <div
      className={`cd-item ${view === key ? "active" : ""}`}
      onClick={() => {
        setView(key);
        scrollTop();
        loadData(true);
      }}
    >
      <span className="cd-item-icon"></span> {label}
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
          {menuItem("dashboard", "Dashboard")}
          <div className="cd-item" onClick={onProducts}>
            <span className="cd-item-icon"></span> Products
          </div>
          {menuItem("orders", "My Orders")}
          {menuItem("profile", "My Profile")}
          {menuItem("contact", "Contact Us")}
        </div>

        <div className="cd-item cd-logout" onClick={onLogout}>
          <span className="cd-item-icon"></span> Logout
        </div>
      </aside>

      {/* MAIN */}
      <main className="cd-main">
        {SHOW_DEBUG && (
          <div
            style={{
              background: "#1b1b1b",
              border: "1px dashed #888",
              color: "#bbb",
              borderRadius: 8,
              padding: "8px 12px",
              marginBottom: 16,
              fontSize: 13,
            }}
          >
            DEBUG - login email: {String(userEmail)} | account id:{" "}
            {String(userId)} | order rows loaded: {orderLines.length} | orders:{" "}
            {invoices.length}
          </div>
        )}

        {noIdentity && (
          <div className="cd-error">
            Your login session has no email or account id, so your orders cannot
            be loaded. Please log out and log in again.
          </div>
        )}

        {error && <div className="cd-error">{error}</div>}

        {/* ================= DASHBOARD PAGE ================= */}
        {view === "dashboard" && (
          <>
            <div className="cd-welcome">
              <h1>
                Welcome Back, <span>{displayName}</span>
              </h1>
              <p>Shop fresh products & track your orders easily</p>
              <button
                className="cd-link-btn"
                onClick={() => {
                  loadData(false);
                  loadRecentlyViewed();
                }}
              >
                Refresh data
              </button>
              {lastUpdated && (
                <span className="cd-muted small" style={{ marginLeft: 12 }}>
                  Updated {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </div>

            {/* STATS */}
            <div className="cd-stats">
              <div className="cd-stat-card">
                <div>
                  <div className="cd-stat-value">
                    {loading ? "..." : totalOrders}
                  </div>
                  <div className="cd-stat-label">Total Orders</div>
                </div>
              </div>
              <div className="cd-stat-card">
                <div>
                  <div className="cd-stat-value">
                    Rs. {loading ? "..." : totalSpent.toLocaleString()}
                  </div>
                  <div className="cd-stat-label">Total Spent</div>
                </div>
              </div>
            </div>

            {/* DELIVERY TRACKING (latest order) */}
            <h2 className="cd-title">Delivery Tracking</h2>
            <div className="cd-panel">
              {!loading && !latestOrder && (
                <p className="cd-muted">No orders to track yet.</p>
              )}

              {latestOrder && (
                <>
                  <p className="cd-muted" style={{ marginBottom: 20 }}>
                    Order <b className="cd-gold-text">{latestOrder.id}</b> -
                    placed {latestOrder.date} - Status:{" "}
                    <b className="cd-gold-text">{latestOrder.status}</b>
                  </p>

                  <div className="cd-tracker">
                    {STATUS_STEPS.map((step, i) => (
                      <React.Fragment key={step}>
                        <div className="cd-tracker-step">
                          <div
                            className={`cd-tracker-dot ${
                              i <= latestStepIndex ? "done" : ""
                            }`}
                          >
                            {i < latestStepIndex ? "\u2713" : i + 1}
                          </div>
                          <span
                            className={i <= latestStepIndex ? "cd-gold-text" : ""}
                          >
                            {step}
                          </span>
                        </div>
                        {i < STATUS_STEPS.length - 1 && (
                          <div
                            className={`cd-tracker-line ${
                              i < latestStepIndex ? "done" : ""
                            }`}
                          />
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
            <h2 className="cd-title">Recently Viewed</h2>
            <div className="cd-products">
              {recentlyViewed.length === 0 && (
                <p className="cd-muted">
                  Nothing viewed yet. Browse products and they will show up here.
                </p>
              )}

              {recentlyViewed.map((p, i) => (
                <div
                  key={p.id ?? i}
                  className="cd-product-card"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="cd-product-image">
                    <img
                      src={getProductImage(p)}
                      alt={p.name}
                      onError={onImgError}
                    />
                  </div>
                  <h3>{p.name}</h3>
                  <p>Rs. {p.basePrice}</p>
                  <button onClick={onProducts}>View Again</button>
                </div>
              ))}
            </div>

            {/* RECOMMENDED PRODUCTS */}
            <h2 className="cd-title">Recommended Products</h2>
            <div className="cd-products">
              {loading && <p className="cd-muted">Loading...</p>}
              {!loading && recommended.length === 0 && (
                <p className="cd-muted">No products available yet.</p>
              )}
              {!loading &&
                recommended.map((p, i) => (
                  <div
                    key={p.id ?? i}
                    className="cd-product-card"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className="cd-product-image">
                      <img
                        src={getProductImage(p)}
                        alt={p.name}
                        onError={onImgError}
                      />
                    </div>
                    <h3>{p.name}</h3>
                    <p>Rs. {p.basePrice}</p>
                    <button onClick={onProducts}>Buy Now</button>
                  </div>
                ))}
            </div>

            {/* LATEST ORDERS (preview) */}
            <h2 className="cd-title">Latest Orders</h2>
            <div className="cd-panel" style={{ padding: 0, overflowX: "auto" }}>
              {!loading && invoices.length === 0 && (
                <p className="cd-muted" style={{ padding: 24 }}>
                  You have not placed any orders yet.
                </p>
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
                      <tr
                        key={inv.orderId}
                        className="cd-row"
                        style={{ animationDelay: `${i * 0.06}s` }}
                      >
                        <td className="cd-id">{inv.id}</td>
                        <td>{inv.date}</td>
                        <td>
                          {inv.items.length} item{inv.items.length > 1 ? "s" : ""}
                        </td>
                        <td className="cd-gold-text">
                          Rs. {inv.total.toLocaleString()}
                        </td>
                        <td>
                          <span className={`cd-badge ${statusBadgeClass(inv.status)}`}>
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {invoices.length > 5 && (
                <div style={{ padding: 18, textAlign: "center" }}>
                  <button
                    className="cd-link-btn"
                    onClick={() => {
                      setView("orders");
                      scrollTop();
                    }}
                  >
                    View All Orders
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* ================= MY ORDERS PAGE ================= */}
        {view === "orders" && (
          <>
            <div className="cd-welcome">
              <h1>My Orders</h1>
              <p>Your complete order history</p>
            </div>

            {!loading && invoices.length === 0 && (
              <div className="cd-panel">
                <p className="cd-muted">You have not placed any orders yet.</p>
              </div>
            )}

            <div className="cd-invoice-list">
              {invoices.map((inv, i) => (
                <div
                  className="cd-invoice"
                  key={inv.orderId}
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  {/* HEADER */}
                  <div className="cd-invoice-head">
                    <div>
                      <div className="cd-invoice-id">Order #{inv.id}</div>
                      <div className="cd-muted small">Placed on {inv.date}</div>
                    </div>
                    <span className={`cd-badge ${statusBadgeClass(inv.status)}`}>
                      {inv.status}
                    </span>
                  </div>

                  {/* PRODUCTS */}
                  <div className="cd-invoice-items">
                    {inv.items.map((it, j) => (
                      <div className="cd-order-product" key={j}>
                        <div className="cd-order-img">
                          <img
                            src={getProductImage({
                              image: it.image,
                              name: it.product,
                              category: it.category,
                            })}
                            alt={it.product}
                            onError={onImgError}
                          />
                        </div>
                        <div className="cd-order-info">
                          <h3>{it.product}</h3>
                          <p>
                            Quantity : <b>{it.qty}</b>
                          </p>
                          <p>
                            Price : <b>Rs. {it.price}</b>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* ORDER INFORMATION */}
                  <div className="cd-order-details">
                    <div>
                      <strong>Delivery Address</strong>
                      <p>{inv.address || profile?.address || "-"}</p>
                    </div>
                    <div>
                      <strong>Payment Method</strong>
                      <p>{inv.paymentMethod || "-"}</p>
                    </div>
                    <div>
                      <strong>Status</strong>
                      <p>{inv.status}</p>
                    </div>
                  </div>

                  {/* TOTAL */}
                  <div className="cd-invoice-footer">
                    <div className="cd-total-box">
                      <span>Total Amount</span>
                      <h2 className="cd-gold-text">
                        Rs. {inv.total.toLocaleString()}
                      </h2>
                    </div>

                    <div className="cd-order-buttons">
                      <button
                        className="cd-track-btn"
                        onClick={() => {
                          setView("dashboard");
                          scrollTop();
                        }}
                      >
                        Track Order
                      </button>

                      <button
                        className="cd-details-btn"
                        onClick={() => alert(`Order ${inv.id} Details`)}
                      >
                        View Details
                      </button>

                      <button
                        className="cd-invoice-btn"
                        onClick={() => window.print()}
                      >
                        Download Invoice
                      </button>
                    </div>
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
              <h1>My Account</h1>
              <p>Manage your personal information and shopping preferences</p>
            </div>

            <div className="profile-header">
              <div className="profile-avatar">
                {profile?.customer_name?.charAt(0).toUpperCase() || "U"}
              </div>

              <div className="profile-main">
                <h2>{profile?.customer_name || "Customer"}</h2>
                <p>Mahajana Premium Customer</p>
                <small>
                  Member since{" "}
                  {profile?.created_at
                    ? new Date(profile.created_at).getFullYear()
                    : "-"}
                </small>
              </div>

              <button
                className="edit-profile-btn"
                onClick={() => alert("Edit profile feature coming soon")}
              >
                Edit Profile
              </button>
            </div>

            <div className="profile-section">
              <h2>Account Information</h2>

              <div className="profile-grid">
                <div className="profile-box">
                  <span>FULL NAME</span>
                  <b>{profile?.customer_name || "-"}</b>
                </div>

                <div className="profile-box">
                  <span>EMAIL ADDRESS</span>
                  <b>{profile?.email || "-"}</b>
                </div>

                <div className="profile-box">
                  <span>PHONE NUMBER</span>
                  <b>{profile?.phone || "-"}</b>
                </div>

                <div className="profile-box">
                  <span>CUSTOMER ID</span>
                  <b>MG-{String(profile?.id ?? "").padStart(3, "0")}</b>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h2>Delivery Address</h2>

              <div className="address-card">
                <h3>Default Address</h3>
                <p>{profile?.address || "No delivery address added"}</p>
                <button onClick={() => alert("Address update page")}>
                  Manage Address
                </button>
              </div>
            </div>

            <div className="profile-section">
              <h2>Account Settings</h2>

              <div className="account-actions">
                <button onClick={() => alert("Change password")}>
                  Change Password
                </button>

                <button
                  onClick={() => {
                    setView("orders");
                    scrollTop();
                  }}
                >
                  My Orders
                </button>

                <button onClick={() => onProducts()}>Continue Shopping</button>
              </div>
            </div>
          </>
        )}

        {/* ================= CONTACT US PAGE ================= */}
        {view === "contact" && (
          <>
            <div className="cd-welcome">
              <h1>Contact Us</h1>
              <p>We are always ready to assist you</p>
            </div>

            <div className="cd-panel cd-contact-grid">
              <div className="cd-contact-card">
                <div className="cd-contact-icon">
                  <i className="fa-solid fa-location-dot"></i>
                </div>
                <div>
                  <h4>Location</h4>
                  <p>Sri Lanka</p>
                </div>
              </div>

              <div className="cd-contact-card">
                <div className="cd-contact-icon">
                  <i className="fa-solid fa-phone"></i>
                </div>
                <div>
                  <h4>Phone</h4>
                  <p>+94 XX XXX XXXX</p>
                </div>
              </div>

              <div className="cd-contact-card">
                <div className="cd-contact-icon">
                  <i className="fa-solid fa-envelope"></i>
                </div>
                <div>
                  <h4>Email</h4>
                  <p>info@mahajana.com</p>
                </div>
              </div>

              <div className="cd-contact-card">
                <div className="cd-contact-icon">
                  <i className="fa-solid fa-clock"></i>
                </div>
                <div>
                  <h4>Working Hours</h4>
                  <p>8:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>

            <div className="cd-panel cd-message-box">
              <h2>Send Us a Message</h2>

              <form className="cd-contact-form" onSubmit={handleContactSubmit}>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={contactForm.name}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, name: e.target.value })
                  }
                />

                <input
                  type="email"
                  placeholder="Your Email"
                  value={contactForm.email}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, email: e.target.value })
                  }
                />

                <textarea
                  placeholder="Write your message..."
                  value={contactForm.message}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, message: e.target.value })
                  }
                ></textarea>

                <button type="submit" className="cd-send-btn" disabled={sending}>
                  {sending ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default CustomerDashboard;