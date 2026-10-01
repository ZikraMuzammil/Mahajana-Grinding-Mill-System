import React, { useState, useEffect } from "react";
import "./PackagingProducts.css";
import ahana from "./assets/packaging/ahana.jpg";
import boost from "./assets/packaging/boost.jpg";
import clove from "./assets/packaging/clove.jpg";
import dry from "./assets/packaging/dry.jpg";
import drypc from "./assets/packaging/drypc.jpg";
import freash from "./assets/packaging/freash.jpg";
import grains from "./assets/packaging/grains.jpg";
import mix from "./assets/packaging/mix.jpg";
import mixde from "./assets/packaging/mixde.jpg";
import mixnuts from "./assets/packaging/mixnuts.jpg";
import mupa from "./assets/packaging/mupa.jpg";
import nutipure from "./assets/packaging/nutipure.jpg";
import nuts from "./assets/packaging/nuts.jpg";
import spices from "./assets/packaging/spices.jpg";
import sweets from "./assets/packaging/sweets.jpg";
import PlaceOrder from "./PlaceOrder";
import { api } from "./api";
import { useCart } from "./context/CartContext";

const WEIGHTS = [
  { label: "100g", multiplier: 0.1 },
  { label: "200g", multiplier: 0.2 },
  { label: "500g", multiplier: 0.5 },
  { label: "750g", multiplier: 0.75 },
  { label: "1kg", multiplier: 1 },
];

const PRODUCTS = [
  { id:1,  name:"Ahana Spice Pouch", basePrice:180, cat:"Pouches", icon:"🛍️", image: ahana, desc:"Resealable spice pouch, food-grade." },
  { id:2,  name:"Boost Gift Pack", basePrice:220, cat:"Pouches", icon:"🛍️", image: boost, desc:"Premium gift-ready pouch pack." },
  { id:3,  name:"Clove Storage Tin", basePrice:250, cat:"Containers", icon:"🛍️", image: clove, desc:"Airtight tin for whole spices." },
  { id:4,  name:"Dry Goods Pouch", basePrice:160, cat:"Pouches", icon:"🛍️", image: dry, desc:"Standard dry goods storage pouch." },
  { id:5,  name:"Dry Product Container", basePrice:280, cat:"Containers", icon:"🛍️", image: drypc, desc:"Stackable container for dry products." },
  { id:6,  name:"Fresh-Seal Container", basePrice:300, cat:"Containers", icon:"🛍️", image: freash, desc:"Vacuum-seal container for freshness.", badge:"Premium" },
  { id:7,  name:"Grains Storage Sack", basePrice:240, cat:"Containers", icon:"🛍️", image: grains, desc:"Breathable sack for bulk grain storage." },
  { id:8,  name:"Mixed Spice Pouch", basePrice:190, cat:"Pouches", icon:"🛍️", image: mix, desc:"Multi-compartment spice pouch." },
  { id:9,  name:"Mixed Dry Goods Pack", basePrice:200, cat:"Pouches", icon:"🛍️", image: mixde, desc:"General-purpose dry goods pack." },
  { id:10,  name:"Mixed Nuts Jar", basePrice:260, cat:"Containers", icon:"🛍️", image: mixnuts, desc:"Glass jar for nuts and dried fruit." },
  { id:11,  name:"Multi-Purpose Pack", basePrice:170, cat:"Pouches", icon:"🛍️", image: mupa, desc:"Versatile all-purpose packaging." },
  { id:12,  name:"Nutipure Container", basePrice:290, cat:"Containers", icon:"🛍️", image: nutipure, desc:"Premium container for powders." },
  { id:13,  name:"Nuts Pouch", basePrice:210, cat:"Pouches", icon:"🛍️", image: nuts, desc:"Resealable pouch for nuts and seeds." },
  { id:14,  name:"Spices Gift Box", basePrice:320, cat:"Pouches", icon:"🛍️", image: spices, desc:"Decorative gift box for spice sets.", badge:"Bestseller" },
  { id:15,  name:"Sweets Container", basePrice:230, cat:"Containers", icon:"🛍️", image: sweets, desc:"Airtight container for jaggery and sweets." },
];

const CATS = [
  { name: "All", icon: "" },
  { name: "Pouches", icon: "" },
  { name: "Containers", icon: "" },
];

const NOTIFS = [
  { id:1, text:"Your order #1701 is ready for pickup!", time:"2 mins ago", unread:true },
  { id:2, text:"New offer: 10% off on Gift Pouches", time:"1 hour ago", unread:true },
  { id:3, text:"Order #1690 has been delivered.", time:"Yesterday", unread:false },
];

function PackagingProducts({ onBack }) {
  const [search, setSearch]           = useState("");
  const [cat, setCat]                 = useState("All");
  const [selected, setSelected]       = useState(null);
  const [popupQty, setPopupQty]       = useState(1);
  const [popupWt, setPopupWt]         = useState(2);
  const {
    cart,
    cartCount,
    cartTotal,
    addToCart: ctxAddToCart,
    changeCartQty,
    changeCartWeight,
    clearCart,
    incrementCartItem,
  } = useCart();
  const CATEGORY = "Packaging";
  const [wishlist, setWishlist]       = useState(new Set());
  const [showOrder, setShowOrder]     = useState(false);
  const [cardWeights, setCardWeights] = useState({});
  const [showCart, setShowCart]       = useState(false);
  const [showWish, setShowWish]       = useState(false);
  const [showNotif, setShowNotif]     = useState(false);
  const [toast, setToast]             = useState("");
  const [notifs, setNotifs]           = useState(NOTIFS);
  const [liveStock, setLiveStock]     = useState({});

  const loadStock = () => {
    api.getProducts("Packaging").then((rows) => {
      const map = {};
      rows.forEach((r) => { map[r.name] = r.stock; });
      setLiveStock(map);
    }).catch(() => {});
  };

  useEffect(() => { loadStock(); }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const getPrice = (basePrice, wtIdx) => Math.round(basePrice * WEIGHTS[wtIdx].multiplier);
  // real stock for a product+weight, from MySQL. null = not tracked yet.
  const getStock = (product, wtIdx) => {
    const stockMap = liveStock[product.name];
    return stockMap ? (stockMap[WEIGHTS[wtIdx].label] ?? null) : null;
  };

  const wishCount   = wishlist.size;
  const unreadCount = notifs.filter(n => n.unread).length;

  const addToCart = (product, wtIdx, qty = 1) => {
    const price = getPrice(product.basePrice, wtIdx);
    const stock = getStock(product, wtIdx);

    const result = ctxAddToCart(product, CATEGORY, wtIdx, WEIGHTS[wtIdx].label, price, qty, stock);

    if (result.status === "out") {
      showToast(`❌ ${result.message}`);
    } else if (result.status === "ok") {
      showToast(`${product.name} (${WEIGHTS[wtIdx].label}) added to cart! 🛒`);
    }
    // "confirm" status: the shared Yes/No dialog is already showing, nothing more to do here

    setSelected(null);
  };

  const toggleWish = (product) => {
    setWishlist(prev => {
      const next = new Set(prev);
      if (next.has(product.id)) { next.delete(product.id); showToast("Removed from wishlist"); }
      else { next.add(product.id); showToast("❤️ Added to wishlist!"); }
      return next;
    });
  };

  const wishToCart = (product) => {
    addToCart(product, 2);
    setWishlist(prev => { const next = new Set(prev); next.delete(product.id); return next; });
  };

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, unread: false })));

  const openProduct = (p) => {
    setSelected(p);
    setPopupQty(1);
    setPopupWt(2);

    // track for Recently Viewed on the customer dashboard
    const recent = JSON.parse(localStorage.getItem("mahajana_recently_viewed") || "[]");
    const updated = [p, ...recent.filter((x) => x.name !== p.name)].slice(0, 10);
    localStorage.setItem("mahajana_recently_viewed", JSON.stringify(updated));
  };

  const getCardWt = (id) => cardWeights[id] !== undefined ? cardWeights[id] : 2;
  const setCardWt = (id, idx) => setCardWeights(prev => ({ ...prev, [id]: idx }));

  const filtered = PRODUCTS.filter(p =>
    (cat === "All" || p.cat === cat) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const wishProducts = PRODUCTS.filter(p => wishlist.has(p.id));

  const badgeClass = (badge) => {
    if (!badge) return "";
    if (badge === "Hot" || badge === "Bestseller") return "hot";
    if (badge === "Organic" || badge === "Premium" || badge === "Pure") return "new";
    return "";
  };

  return (
    <div className="pk-page">

      {/* ── NAVBAR ── */}
      <nav className="ap-navbar">
        <div className="ap-nav-left">
          <span className="ap-brand">
            MAHAJANA <span>GRINDING MILL</span>
          </span>
        </div>

        <div className="ap-nav-links">
          <span onClick={onBack}>Home</span>
          <span className="ap-nav-active">Packaging</span>
          <span>Categories</span>
          <span>Contact</span>
        </div>

        <div className="ap-search-wrap">
          <span className="ap-search-icon"></span>
          <input
            className="ap-search"
            placeholder="Search packaging..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && <span className="ap-search-clear" onClick={() => setSearch("")}>✕</span>}
        </div>

        <div className="ap-nav-icons">
          <div className="ap-icon-btn" onClick={() => { setShowNotif(!showNotif); setShowCart(false); setShowWish(false); }}>
            🔔 {unreadCount > 0 && <span className="ap-icon-badge">{unreadCount}</span>}
          </div>
          <div className="ap-icon-btn" onClick={() => { setShowWish(!showWish); setShowCart(false); setShowNotif(false); }}>
            ❤️ {wishCount > 0 && <span className="ap-icon-badge">{wishCount}</span>}
          </div>
          <div className="ap-icon-btn" onClick={() => { setShowCart(!showCart); setShowWish(false); setShowNotif(false); }}>
            🛒 {cartCount > 0 && <span className="ap-icon-badge">{cartCount}</span>}
          </div>
          <button className="ap-back-btn" onClick={onBack}>← Back</button>
        </div>
      </nav>

      {/* ── PAGE HEADER ── */}
      <div className="pk-page-header">
        <span className="pk-spice-float f1">📦</span>
        <span className="pk-spice-float f2">🛍️</span>
        <span className="pk-spice-float f3">✨</span>
        <span className="pk-spice-float f4">🧺</span>
        <span className="pk-spice-float f5">🔒</span>
        <span className="pk-spice-float f6">🌿</span>
        <div className="pk-page-header-left">
          <div className="pk-hero-badge">Food-Safe Packaging</div>
          <h1>Packaging <span>Collection</span></h1>
          <p>Bags, pouches & containers for storing and gifting mill products</p>
        </div>
        <div className="pk-page-header-stats">
          <div className="pk-pgstat"><b>15</b><span>Varieties</span></div>
          <div className="pk-pgstat"><b>100%</b><span>Food-Safe</span></div>
          <div className="pk-pgstat"><b>5</b><span>Sizes</span></div>
        </div>
      </div>

      {/* ── CATEGORY CHIPS ── */}
      <div className="pk-filter-bar">
        {CATS.map(c => (
          <button
            key={c.name}
            className={`pk-filter-btn${cat === c.name ? " active" : ""}`}
            onClick={() => setCat(c.name)}
          >
            <span>{c.icon}</span> {c.name}
          </button>
        ))}
        <span className="pk-count">{filtered.length} products</span>
      </div>

      {/* ── GRID ── */}
      <div className="pk-grid-section">
        {filtered.length === 0 ? (
          <div className="pk-empty">
            <div className="pk-empty-icon">🔍</div>
            <p>No products found for "{search}"</p>
          </div>
        ) : (
          <div className="pk-grid">
            {filtered.map((p, idx) => {
              const wtIdx = getCardWt(p.id);
              const price = getPrice(p.basePrice, wtIdx);
              return (
                <div className="pk-card" key={p.id} style={{ animationDelay: `${(idx % 10) * 0.04}s` }}>
                  <div className="pk-packet" onClick={() => openProduct(p)}>
                    <img src={p.image} alt={p.name} className="pk-product-photo" />
                    <div className="pk-photo-overlay"></div>
                  </div>

                  <button
                    className={`pk-wish-btn${wishlist.has(p.id) ? " wished" : ""}`}
                    onClick={() => toggleWish(p)}
                  >{wishlist.has(p.id) ? "❤️" : "🤍"}</button>

                  {p.badge && (
                    <div className="pk-card-badge">
                      <span className={`pk-badge-tag ${badgeClass(p.badge)}`}>{p.badge}</span>
                    </div>
                  )}

                  <div className="pk-card-body">
                    <div className="pk-card-name">{p.name}</div>
                    <div className="pk-card-cat">{p.cat}</div>

                    <div className="pk-weight-row">
                      {WEIGHTS.map((w, i) => (
                        <button
                          key={w.label}
                          className={`pk-weight-btn${wtIdx === i ? " active" : ""}`}
                          onClick={() => setCardWt(p.id, i)}
                        >{w.label}</button>
                      ))}
                    </div>

                    {getStock(p, wtIdx) !== null && (
                      <div style={{ fontSize: 11, margin: "2px 0", color: getStock(p, wtIdx) === 0 ? "#e05c4f" : getStock(p, wtIdx) < 10 ? "#f4b400" : "#8fbf8f" }}>
                        {getStock(p, wtIdx) === 0 ? "Out of stock" : `Stock: ${getStock(p, wtIdx)}`}
                      </div>
                    )}

                    <div className="pk-card-bottom">
                      <div className="pk-card-price">
                        Rs. {price} <span>/ {WEIGHTS[wtIdx].label}</span>
                      </div>
                      <button className="pk-add-btn" onClick={() => addToCart(p, wtIdx)}>
                        + Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── PRODUCT POPUP ── */}
      {selected && (
        <div className="pk-popup-overlay" onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className="pk-popup">
            <div className="pk-popup-photo-area">
              <img src={selected.image} alt={selected.name} className="pk-popup-photo" />
              <div className="pk-popup-photo-overlay">
                <span className="pk-popup-photo-brand">Mahajana Grinding Mill</span>
                <div className="pk-popup-photo-name">{selected.name}</div>
              </div>
            </div>

            <div className="pk-popup-body">
              <div className="pk-popup-cat">{selected.cat}</div>
              <div className="pk-popup-desc">{selected.desc}</div>

              <div className="pk-popup-section-title">Select Weight</div>
              <div className="pk-popup-weights">
                {WEIGHTS.map((w, i) => (
                  <button
                    key={w.label}
                    className={`pk-popup-wt-btn${popupWt === i ? " active" : ""}`}
                    onClick={() => setPopupWt(i)}
                  >
                    {w.label}
                    <span className="wt-price">Rs. {getPrice(selected.basePrice, i)}</span>
                  </button>
                ))}
              </div>

              {getStock(selected, popupWt) !== null && (
                <div style={{ fontSize: 12.5, color: getStock(selected, popupWt) === 0 ? "#e05c4f" : getStock(selected, popupWt) < 10 ? "#f4b400" : "#8fbf8f" }}>
                  {getStock(selected, popupWt) === 0 ? "Out of stock for this weight" : `${getStock(selected, popupWt)} in stock for ${WEIGHTS[popupWt].label}`}
                </div>
              )}

              <div className="pk-qty-row">
                <span className="pk-qty-label">Quantity:</span>
                <div className="pk-qty-ctrl">
                  <button className="pk-qty-btn" onClick={() => setPopupQty(q => Math.max(1, q - 1))}>−</button>
                  <span className="pk-qty-num">{popupQty}</span>
                  <button
                    className="pk-qty-btn"
                    onClick={() => setPopupQty(q => {
                      const stock = getStock(selected, popupWt);
                      return stock !== null && q >= stock ? q : q + 1;
                    })}
                  >+</button>
                </div>
              </div>

              <div className="pk-popup-total">
                <span className="lbl">Total Amount</span>
                <span className="amt">Rs. {getPrice(selected.basePrice, popupWt) * popupQty}</span>
              </div>

              <div className="pk-popup-btns">
                <button className="pk-popup-cart-btn" onClick={() => addToCart(selected, popupWt, popupQty)}>
                  🛒 Add to Cart
                </button>
                <button className="pk-popup-close" onClick={() => setSelected(null)}>✕ Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── NOTIFICATIONS ── */}
      {showNotif && (
        <>
          <div style={{ position:"fixed", inset:0, zIndex:899 }} onClick={() => setShowNotif(false)} />
          <div className="pk-notif-drawer">
            <div className="pk-notif-head">
              <h4>🔔 Notifications</h4>
              <span onClick={markAllRead}>Mark all read</span>
            </div>
            {notifs.map(n => (
              <div key={n.id} className={`pk-notif-item${n.unread ? " unread" : ""}`}>
                {n.unread && <span className="pk-notif-dot"></span>}
                <div className="pk-notif-text">{n.text}</div>
                <div className="pk-notif-time">{n.time}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── WISHLIST DRAWER ── */}
      {showWish && (
        <>
          <div className="pk-cart-overlay" onClick={() => setShowWish(false)} />
          <div className="pk-wish-drawer">
            <div className="pk-wish-head">
              <h3>❤️ Wishlist ({wishCount})</h3>
              <button className="pk-wish-head-close" onClick={() => setShowWish(false)}>✕</button>
            </div>
            <div className="pk-wish-items">
              {wishProducts.length === 0 ? (
                <div className="pk-cart-empty"><div className="icon">❤️</div><p>Your wishlist is empty</p></div>
              ) : wishProducts.map(p => (
                <div className="pk-wish-item" key={p.id}>
                  <div className="pk-wish-item-photo"><img src={p.image} alt={p.name} /></div>
                  <div className="pk-wish-item-info">
                    <div className="pk-wish-item-name">{p.name}</div>
                    <div className="pk-wish-item-price">from Rs. {getPrice(p.basePrice, 0)}</div>
                  </div>
                  <button className="pk-wish-move-btn" onClick={() => wishToCart(p)}>+ Cart</button>
                  <button className="pk-wish-remove" onClick={() => toggleWish(p)}>🗑</button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── CART DRAWER ── */}
      {showCart && (
        <>
          <div className="pk-cart-overlay" onClick={() => setShowCart(false)} />
          <div className="pk-cart-drawer">
            <div className="pk-cart-head">
              <h3>🛒 Cart ({cartCount} items)</h3>
              <button className="pk-cart-head-close" onClick={() => setShowCart(false)}>✕</button>
            </div>
            <div className="pk-cart-items">
              {Object.values(cart).length === 0 ? (
                <div className="pk-cart-empty"><div className="icon">🛒</div><p>Your cart is empty</p></div>
              ) : Object.values(cart).map(item => (
                <div className="pk-cart-item" key={item.key}>
                  <div className="pk-cart-item-photo"><img src={item.image} alt={item.name} /></div>
                  <div className="pk-cart-item-info">
                    <div className="pk-cart-item-name">{item.name}</div>

                    <div className="pk-cart-weight-row">
                      {WEIGHTS.map((w, i) => (
                        <button
                          key={w.label}
                          className={`pk-cart-wt-btn${item.wtIdx === i ? " active" : ""}`}
                          onClick={() => changeCartWeight(item.key, i)}
                        >{w.label}</button>
                      ))}
                    </div>

                    <div className="pk-cart-item-price">Rs. {item.totalPrice} / pack ({item.weight})</div>

                    <div className="pk-cart-item-qty">
                      <button onClick={() => changeCartQty(item.key, -1)}>−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => incrementCartItem(item.key)}>+</button>
                    </div>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6 }}>
                    <div className="pk-cart-item-sub">Rs. {item.totalPrice * item.qty}</div>
                    <button className="pk-cart-item-remove" onClick={() => changeCartQty(item.key, -item.qty)}>✕</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="pk-cart-footer">
              <div className="pk-summary-row"><span>Subtotal</span><span>Rs. {cartTotal}</span></div>
              <div className="pk-summary-row"><span>Delivery</span><span>Rs. {cartTotal > 0 ? 150 : 0}</span></div>
              <div className="pk-summary-row total"><span>Total</span><span>Rs. {cartTotal + (cartTotal > 0 ? 150 : 0)}</span></div>
              <button
                className="pk-checkout-btn"
                onClick={() => { setShowCart(false); setShowOrder(true); }}
              >
                Place Order →
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── PLACE ORDER MODAL ── */}
      {showOrder && (
        <div className="po-overlay">
          <div className="po-blur" onClick={() => setShowOrder(false)} />
          <div className="po-modal">
            <PlaceOrder
              onBack={() => setShowOrder(false)}
              cartItems={cart}
              cartTotal={cartTotal + (cartTotal > 0 ? 150 : 0)}
              onOrderPlaced={() => {
                clearCart();
                loadStock();
                setShowOrder(false);
              }}
            />
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast && (
        <div className="pk-toast">
          <div className="pk-toast-dot"></div>
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}

export default PackagingProducts;
