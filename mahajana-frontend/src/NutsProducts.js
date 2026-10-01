import React, { useState, useEffect } from "react";
import "./NutsProducts.css";
import almonds from "./assets/Nuts/almonds.jpg";
import cashew from "./assets/Nuts/cashew.jpg";
import chia from "./assets/Nuts/chia.jpg";
import coconut from "./assets/Nuts/coconut.jpg";
import flax from "./assets/Nuts/flax.jpg";
import mixed from "./assets/Nuts/mixed.jpg";
import peanuts from "./assets/Nuts/peanuts.jpg";
import pistachio from "./assets/Nuts/pistachio.jpg";
import pumpkin from "./assets/Nuts/pumpkin.jpg";
import raisins from "./assets/Nuts/raisins.jpg";
import roasted from "./assets/Nuts/roasted.jpg";
import roastedpeanuts from "./assets/Nuts/roastedpeanuts.jpg";
import sesame from "./assets/Nuts/sesame.jpg";
import sunflower from "./assets/Nuts/sunflower.jpg";
import walnuts from "./assets/Nuts/walnuts.jpg";
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
  { id:1,  name:"Almonds", basePrice:850, cat:"Nuts", icon:"🌰", image: almonds, desc:"Premium whole almonds, rich in healthy fats.", badge:"Premium" },
  { id:2,  name:"Cashew Nuts", basePrice:950, cat:"Nuts", icon:"🌰", image: cashew, desc:"Whole raw cashews, creamy and buttery.", badge:"Bestseller" },
  { id:3,  name:"Chia Seeds", basePrice:600, cat:"Seeds", icon:"🌰", image: chia, desc:"Omega-3 rich chia seeds, great for smoothies.", badge:"Organic" },
  { id:4,  name:"Dried Coconut Bits", basePrice:300, cat:"Dried Fruit", icon:"🌰", image: coconut, desc:"Sun-dried coconut pieces, naturally sweet." },
  { id:5,  name:"Flax Seeds", basePrice:380, cat:"Seeds", icon:"🌰", image: flax, desc:"Ground-ready flax seeds, high in fibre." },
  { id:6,  name:"Mixed Nuts", basePrice:780, cat:"Nuts", icon:"🌰", image: mixed, desc:"A hearty blend of cashew, almond and walnut." },
  { id:7,  name:"Raw Peanuts", basePrice:320, cat:"Nuts", icon:"🌰", image: peanuts, desc:"Farm-fresh raw peanuts." },
  { id:8,  name:"Pistachio", basePrice:1200, cat:"Nuts", icon:"🌰", image: pistachio, desc:"Premium roasted pistachio, lightly salted.", badge:"Premium" },
  { id:9,  name:"Pumpkin Seeds", basePrice:420, cat:"Seeds", icon:"🌰", image: pumpkin, desc:"Roasted pumpkin seeds, crunchy and nutty." },
  { id:10,  name:"Raisins", basePrice:340, cat:"Dried Fruit", icon:"🌰", image: raisins, desc:"Sweet seedless raisins, sun-dried." },
  { id:11,  name:"Roasted Mixed Nuts", basePrice:820, cat:"Nuts", icon:"🌰", image: roasted, desc:"Lightly salted roasted mixed nut blend." },
  { id:12,  name:"Roasted Peanuts", basePrice:300, cat:"Nuts", icon:"🌰", image: roastedpeanuts, desc:"Crunchy roasted peanuts, classic snack." },
  { id:13,  name:"Sesame Seeds", basePrice:260, cat:"Seeds", icon:"🌰", image: sesame, desc:"Toasted sesame seeds for baking and garnish." },
  { id:14,  name:"Sunflower Seeds", basePrice:360, cat:"Seeds", icon:"🌰", image: sunflower, desc:"Roasted sunflower seeds, light and crisp." },
  { id:15,  name:"Walnuts", basePrice:980, cat:"Nuts", icon:"🌰", image: walnuts, desc:"Whole shelled walnuts, rich in omega-3.", badge:"Premium" },
];

const CATS = [
  { name: "All", icon: "" },
  { name: "Nuts", icon: "" },
  { name: "Seeds", icon: "" },
  { name: "Dried Fruit", icon: "" },
];

const NOTIFS = [
  { id:1, text:"Your order #1201 is ready for pickup!", time:"2 mins ago", unread:true },
  { id:2, text:"New offer: 15% off on Cashew Nuts", time:"1 hour ago", unread:true },
  { id:3, text:"Order #1195 has been delivered.", time:"Yesterday", unread:false },
];

function NutsProducts({ onBack }) {
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
  const CATEGORY = "Nuts";
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
    api.getProducts("Nuts").then((rows) => {
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
    <div className="nt-page">

      {/* ── NAVBAR ── */}
      <nav className="ap-navbar">
        <div className="ap-nav-left">
          <span className="ap-brand">
            MAHAJANA <span>GRINDING MILL</span>
          </span>
        </div>

        <div className="ap-nav-links">
          <span onClick={onBack}>Home</span>
          <span className="ap-nav-active">Nuts & Seeds</span>
          <span>Categories</span>
          <span>Contact</span>
        </div>

        <div className="ap-search-wrap">
          <span className="ap-search-icon"></span>
          <input
            className="ap-search"
            placeholder="Search nuts & seeds..."
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
      <div className="nt-page-header">
        <span className="nt-spice-float f1">🥜</span>
        <span className="nt-spice-float f2">🌰</span>
        <span className="nt-spice-float f3">🫘</span>
        <span className="nt-spice-float f4">🌻</span>
        <span className="nt-spice-float f5">🍇</span>
        <span className="nt-spice-float f6">✨</span>
        <div className="nt-page-header-left">
          <div className="nt-hero-badge">Fresh Roasted Weekly</div>
          <h1>Nuts & Seeds <span>Collection</span></h1>
          <p>Premium roasted and raw nuts, seeds — a healthy bite every time</p>
        </div>
        <div className="nt-page-header-stats">
          <div className="nt-pgstat"><b>15</b><span>Varieties</span></div>
          <div className="nt-pgstat"><b>0%</b><span>Added Oil</span></div>
          <div className="nt-pgstat"><b>5</b><span>Sizes</span></div>
        </div>
      </div>

      {/* ── CATEGORY CHIPS ── */}
      <div className="nt-filter-bar">
        {CATS.map(c => (
          <button
            key={c.name}
            className={`nt-filter-btn${cat === c.name ? " active" : ""}`}
            onClick={() => setCat(c.name)}
          >
            <span>{c.icon}</span> {c.name}
          </button>
        ))}
        <span className="nt-count">{filtered.length} products</span>
      </div>

      {/* ── GRID ── */}
      <div className="nt-grid-section">
        {filtered.length === 0 ? (
          <div className="nt-empty">
            <div className="nt-empty-icon">🔍</div>
            <p>No products found for "{search}"</p>
          </div>
        ) : (
          <div className="nt-grid">
            {filtered.map((p, idx) => {
              const wtIdx = getCardWt(p.id);
              const price = getPrice(p.basePrice, wtIdx);
              return (
                <div className="nt-card" key={p.id} style={{ animationDelay: `${(idx % 10) * 0.04}s` }}>
                  <div className="nt-packet" onClick={() => openProduct(p)}>
                    <img src={p.image} alt={p.name} className="nt-product-photo" />
                    <div className="nt-photo-overlay"></div>
                  </div>

                  <button
                    className={`nt-wish-btn${wishlist.has(p.id) ? " wished" : ""}`}
                    onClick={() => toggleWish(p)}
                  >{wishlist.has(p.id) ? "❤️" : "🤍"}</button>

                  {p.badge && (
                    <div className="nt-card-badge">
                      <span className={`nt-badge-tag ${badgeClass(p.badge)}`}>{p.badge}</span>
                    </div>
                  )}

                  <div className="nt-card-body">
                    <div className="nt-card-name">{p.name}</div>
                    <div className="nt-card-cat">{p.cat}</div>

                    <div className="nt-weight-row">
                      {WEIGHTS.map((w, i) => (
                        <button
                          key={w.label}
                          className={`nt-weight-btn${wtIdx === i ? " active" : ""}`}
                          onClick={() => setCardWt(p.id, i)}
                        >{w.label}</button>
                      ))}
                    </div>

                    {getStock(p, wtIdx) !== null && (
                      <div style={{ fontSize: 11, margin: "2px 0", color: getStock(p, wtIdx) === 0 ? "#e05c4f" : getStock(p, wtIdx) < 10 ? "#f4b400" : "#8fbf8f" }}>
                        {getStock(p, wtIdx) === 0 ? "Out of stock" : `Stock: ${getStock(p, wtIdx)}`}
                      </div>
                    )}

                    <div className="nt-card-bottom">
                      <div className="nt-card-price">
                        Rs. {price} <span>/ {WEIGHTS[wtIdx].label}</span>
                      </div>
                      <button className="nt-add-btn" onClick={() => addToCart(p, wtIdx)}>
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
        <div className="nt-popup-overlay" onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className="nt-popup">
            <div className="nt-popup-photo-area">
              <img src={selected.image} alt={selected.name} className="nt-popup-photo" />
              <div className="nt-popup-photo-overlay">
                <span className="nt-popup-photo-brand">Mahajana Grinding Mill</span>
                <div className="nt-popup-photo-name">{selected.name}</div>
              </div>
            </div>

            <div className="nt-popup-body">
              <div className="nt-popup-cat">{selected.cat}</div>
              <div className="nt-popup-desc">{selected.desc}</div>

              <div className="nt-popup-section-title">Select Weight</div>
              <div className="nt-popup-weights">
                {WEIGHTS.map((w, i) => (
                  <button
                    key={w.label}
                    className={`nt-popup-wt-btn${popupWt === i ? " active" : ""}`}
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

              <div className="nt-qty-row">
                <span className="nt-qty-label">Quantity:</span>
                <div className="nt-qty-ctrl">
                  <button className="nt-qty-btn" onClick={() => setPopupQty(q => Math.max(1, q - 1))}>−</button>
                  <span className="nt-qty-num">{popupQty}</span>
                  <button
                    className="nt-qty-btn"
                    onClick={() => setPopupQty(q => {
                      const stock = getStock(selected, popupWt);
                      return stock !== null && q >= stock ? q : q + 1;
                    })}
                  >+</button>
                </div>
              </div>

              <div className="nt-popup-total">
                <span className="lbl">Total Amount</span>
                <span className="amt">Rs. {getPrice(selected.basePrice, popupWt) * popupQty}</span>
              </div>

              <div className="nt-popup-btns">
                <button className="nt-popup-cart-btn" onClick={() => addToCart(selected, popupWt, popupQty)}>
                  🛒 Add to Cart
                </button>
                <button className="nt-popup-close" onClick={() => setSelected(null)}>✕ Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── NOTIFICATIONS ── */}
      {showNotif && (
        <>
          <div style={{ position:"fixed", inset:0, zIndex:899 }} onClick={() => setShowNotif(false)} />
          <div className="nt-notif-drawer">
            <div className="nt-notif-head">
              <h4>🔔 Notifications</h4>
              <span onClick={markAllRead}>Mark all read</span>
            </div>
            {notifs.map(n => (
              <div key={n.id} className={`nt-notif-item${n.unread ? " unread" : ""}`}>
                {n.unread && <span className="nt-notif-dot"></span>}
                <div className="nt-notif-text">{n.text}</div>
                <div className="nt-notif-time">{n.time}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── WISHLIST DRAWER ── */}
      {showWish && (
        <>
          <div className="nt-cart-overlay" onClick={() => setShowWish(false)} />
          <div className="nt-wish-drawer">
            <div className="nt-wish-head">
              <h3>❤️ Wishlist ({wishCount})</h3>
              <button className="nt-wish-head-close" onClick={() => setShowWish(false)}>✕</button>
            </div>
            <div className="nt-wish-items">
              {wishProducts.length === 0 ? (
                <div className="nt-cart-empty"><div className="icon">❤️</div><p>Your wishlist is empty</p></div>
              ) : wishProducts.map(p => (
                <div className="nt-wish-item" key={p.id}>
                  <div className="nt-wish-item-photo"><img src={p.image} alt={p.name} /></div>
                  <div className="nt-wish-item-info">
                    <div className="nt-wish-item-name">{p.name}</div>
                    <div className="nt-wish-item-price">from Rs. {getPrice(p.basePrice, 0)}</div>
                  </div>
                  <button className="nt-wish-move-btn" onClick={() => wishToCart(p)}>+ Cart</button>
                  <button className="nt-wish-remove" onClick={() => toggleWish(p)}>🗑</button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── CART DRAWER ── */}
      {showCart && (
        <>
          <div className="nt-cart-overlay" onClick={() => setShowCart(false)} />
          <div className="nt-cart-drawer">
            <div className="nt-cart-head">
              <h3>🛒 Cart ({cartCount} items)</h3>
              <button className="nt-cart-head-close" onClick={() => setShowCart(false)}>✕</button>
            </div>
            <div className="nt-cart-items">
              {Object.values(cart).length === 0 ? (
                <div className="nt-cart-empty"><div className="icon">🛒</div><p>Your cart is empty</p></div>
              ) : Object.values(cart).map(item => (
                <div className="nt-cart-item" key={item.key}>
                  <div className="nt-cart-item-photo"><img src={item.image} alt={item.name} /></div>
                  <div className="nt-cart-item-info">
                    <div className="nt-cart-item-name">{item.name}</div>

                    <div className="nt-cart-weight-row">
                      {WEIGHTS.map((w, i) => (
                        <button
                          key={w.label}
                          className={`nt-cart-wt-btn${item.wtIdx === i ? " active" : ""}`}
                          onClick={() => changeCartWeight(item.key, i)}
                        >{w.label}</button>
                      ))}
                    </div>

                    <div className="nt-cart-item-price">Rs. {item.totalPrice} / pack ({item.weight})</div>

                    <div className="nt-cart-item-qty">
                      <button onClick={() => changeCartQty(item.key, -1)}>−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => incrementCartItem(item.key)}>+</button>
                    </div>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6 }}>
                    <div className="nt-cart-item-sub">Rs. {item.totalPrice * item.qty}</div>
                    <button className="nt-cart-item-remove" onClick={() => changeCartQty(item.key, -item.qty)}>✕</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="nt-cart-footer">
              <div className="nt-summary-row"><span>Subtotal</span><span>Rs. {cartTotal}</span></div>
              <div className="nt-summary-row"><span>Delivery</span><span>Rs. {cartTotal > 0 ? 150 : 0}</span></div>
              <div className="nt-summary-row total"><span>Total</span><span>Rs. {cartTotal + (cartTotal > 0 ? 150 : 0)}</span></div>
              <button
                className="nt-checkout-btn"
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
        <div className="nt-toast">
          <div className="nt-toast-dot"></div>
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}

export default NutsProducts;
