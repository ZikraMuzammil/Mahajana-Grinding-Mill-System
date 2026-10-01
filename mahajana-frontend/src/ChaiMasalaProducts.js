import React, { useState, useEffect } from "react";
import "./ChaiMasalaProducts.css";
import black from "./assets/chaimasala/black.jpg";
import blend from "./assets/chaimasala/blend.jpg";
import cardio from "./assets/chaimasala/cardio.jpg";
import chai from "./assets/chaimasala/chai.jpg";
import coffee from "./assets/chaimasala/coffee.jpg";
import gold from "./assets/chaimasala/gold.jpg";
import green from "./assets/chaimasala/green.jpg";
import healthy from "./assets/chaimasala/healthy.jpg";
import herbal from "./assets/chaimasala/herbal.jpg";
import himalaya from "./assets/chaimasala/himalaya.jpg";
import masala from "./assets/chaimasala/masala.jpg";
import morning from "./assets/chaimasala/morning.jpg";
import strong from "./assets/chaimasala/strong.jpg";
import teamasala from "./assets/chaimasala/teamasala.jpg";
import zentea from "./assets/chaimasala/zentea.jpg";
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
  { id:1,  name:"Black Tea Masala", basePrice:320, cat:"Chai Blends", icon:"🍵", image: black, desc:"Bold black tea blended with warming spices." },
  { id:2,  name:"Signature Chai Blend", basePrice:380, cat:"Chai Blends", icon:"🍵", image: blend, desc:"Our house-special chai blend.", badge:"Bestseller" },
  { id:3,  name:"Cardamom Chai Masala", basePrice:400, cat:"Chai Blends", icon:"🍵", image: cardio, desc:"Fragrant cardamom-forward chai masala.", badge:"Premium" },
  { id:4,  name:"Classic Chai Masala", basePrice:340, cat:"Chai Blends", icon:"🍵", image: chai, desc:"The everyday classic chai spice mix." },
  { id:5,  name:"Instant Coffee Mix", basePrice:360, cat:"Coffee", icon:"🍵", image: coffee, desc:"Rich instant coffee mix, ready in seconds." },
  { id:6,  name:"Golden Chai Masala", basePrice:420, cat:"Chai Blends", icon:"🍵", image: gold, desc:"Turmeric-infused golden chai blend.", badge:"Premium" },
  { id:7,  name:"Green Tea Masala", basePrice:350, cat:"Green Tea", icon:"🍵", image: green, desc:"Light green tea blended with mild spice." },
  { id:8,  name:"Healthy Herbal Chai", basePrice:390, cat:"Chai Blends", icon:"🍵", image: healthy, desc:"A caffeine-free herbal chai alternative.", badge:"Organic" },
  { id:9,  name:"Herbal Chai Mix", basePrice:370, cat:"Chai Blends", icon:"🍵", image: herbal, desc:"Soothing herbal chai for evenings." },
  { id:10,  name:"Himalayan Chai Masala", basePrice:430, cat:"Chai Blends", icon:"🍵", image: himalaya, desc:"Bold Himalayan-style masala chai." },
  { id:11,  name:"Masala Tea Mix", basePrice:330, cat:"Chai Blends", icon:"🍵", image: masala, desc:"All-purpose masala tea mix." },
  { id:12,  name:"Morning Energy Chai", basePrice:360, cat:"Chai Blends", icon:"🍵", image: morning, desc:"A brisk blend to start your day." },
  { id:13,  name:"Strong Ceylon Chai", basePrice:340, cat:"Chai Blends", icon:"🍵", image: strong, desc:"Full-bodied Ceylon black tea masala." },
  { id:14,  name:"Tea Masala Powder", basePrice:300, cat:"Chai Blends", icon:"🍵", image: teamasala, desc:"Classic ready-mix tea masala powder." },
  { id:15,  name:"Zen Green Tea", basePrice:380, cat:"Green Tea", icon:"🍵", image: zentea, desc:"Calming green tea blend for relaxation." },
];

const CATS = [
  { name: "All", icon: "" },
  { name: "Chai Blends", icon: "" },
  { name: "Coffee", icon: "" },
  { name: "Green Tea", icon: "" },
];

const NOTIFS = [
  { id:1, text:"Your order #1401 is ready for pickup!", time:"2 mins ago", unread:true },
  { id:2, text:"New offer: 10% off on Gold Chai Masala", time:"1 hour ago", unread:true },
  { id:3, text:"Order #1388 has been delivered.", time:"Yesterday", unread:false },
];

function ChaiMasalaProducts({ onBack }) {
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
  const CATEGORY = "ChaiMasala";
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
    api.getProducts("ChaiMasala").then((rows) => {
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
    <div className="cm-page">

      {/* ── NAVBAR ── */}
      <nav className="ap-navbar">
        <div className="ap-nav-left">
          <span className="ap-brand">
            MAHAJANA <span>GRINDING MILL</span>
          </span>
        </div>

        <div className="ap-nav-links">
          <span onClick={onBack}>Home</span>
          <span className="ap-nav-active">Chai & Masala</span>
          <span>Categories</span>
          <span>Contact</span>
        </div>

        <div className="ap-search-wrap">
          <span className="ap-search-icon"></span>
          <input
            className="ap-search"
            placeholder="Search chai & masala..."
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
      <div className="cm-page-header">
        <span className="cm-spice-float f1">☕</span>
        <span className="cm-spice-float f2">🍵</span>
        <span className="cm-spice-float f3">🫖</span>
        <span className="cm-spice-float f4">✨</span>
        <span className="cm-spice-float f5">🌿</span>
        <span className="cm-spice-float f6">🔥</span>
        <div className="cm-page-header-left">
          <div className="cm-hero-badge">Freshly Blended</div>
          <h1>Chai & Masala <span>Collection</span></h1>
          <p>Aromatic tea blends and masala mixes, hand-blended in small batches</p>
        </div>
        <div className="cm-page-header-stats">
          <div className="cm-pgstat"><b>15</b><span>Blends</span></div>
          <div className="cm-pgstat"><b>100%</b><span>Natural</span></div>
          <div className="cm-pgstat"><b>5</b><span>Sizes</span></div>
        </div>
      </div>

      {/* ── CATEGORY CHIPS ── */}
      <div className="cm-filter-bar">
        {CATS.map(c => (
          <button
            key={c.name}
            className={`cm-filter-btn${cat === c.name ? " active" : ""}`}
            onClick={() => setCat(c.name)}
          >
            <span>{c.icon}</span> {c.name}
          </button>
        ))}
        <span className="cm-count">{filtered.length} products</span>
      </div>

      {/* ── GRID ── */}
      <div className="cm-grid-section">
        {filtered.length === 0 ? (
          <div className="cm-empty">
            <div className="cm-empty-icon">🔍</div>
            <p>No products found for "{search}"</p>
          </div>
        ) : (
          <div className="cm-grid">
            {filtered.map((p, idx) => {
              const wtIdx = getCardWt(p.id);
              const price = getPrice(p.basePrice, wtIdx);
              return (
                <div className="cm-card" key={p.id} style={{ animationDelay: `${(idx % 10) * 0.04}s` }}>
                  <div className="cm-packet" onClick={() => openProduct(p)}>
                    <img src={p.image} alt={p.name} className="cm-product-photo" />
                    <div className="cm-photo-overlay"></div>
                  </div>

                  <button
                    className={`cm-wish-btn${wishlist.has(p.id) ? " wished" : ""}`}
                    onClick={() => toggleWish(p)}
                  >{wishlist.has(p.id) ? "❤️" : "🤍"}</button>

                  {p.badge && (
                    <div className="cm-card-badge">
                      <span className={`cm-badge-tag ${badgeClass(p.badge)}`}>{p.badge}</span>
                    </div>
                  )}

                  <div className="cm-card-body">
                    <div className="cm-card-name">{p.name}</div>
                    <div className="cm-card-cat">{p.cat}</div>

                    <div className="cm-weight-row">
                      {WEIGHTS.map((w, i) => (
                        <button
                          key={w.label}
                          className={`cm-weight-btn${wtIdx === i ? " active" : ""}`}
                          onClick={() => setCardWt(p.id, i)}
                        >{w.label}</button>
                      ))}
                    </div>

                    {getStock(p, wtIdx) !== null && (
                      <div style={{ fontSize: 11, margin: "2px 0", color: getStock(p, wtIdx) === 0 ? "#e05c4f" : getStock(p, wtIdx) < 10 ? "#f4b400" : "#8fbf8f" }}>
                        {getStock(p, wtIdx) === 0 ? "Out of stock" : `Stock: ${getStock(p, wtIdx)}`}
                      </div>
                    )}

                    <div className="cm-card-bottom">
                      <div className="cm-card-price">
                        Rs. {price} <span>/ {WEIGHTS[wtIdx].label}</span>
                      </div>
                      <button className="cm-add-btn" onClick={() => addToCart(p, wtIdx)}>
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
        <div className="cm-popup-overlay" onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className="cm-popup">
            <div className="cm-popup-photo-area">
              <img src={selected.image} alt={selected.name} className="cm-popup-photo" />
              <div className="cm-popup-photo-overlay">
                <span className="cm-popup-photo-brand">Mahajana Grinding Mill</span>
                <div className="cm-popup-photo-name">{selected.name}</div>
              </div>
            </div>

            <div className="cm-popup-body">
              <div className="cm-popup-cat">{selected.cat}</div>
              <div className="cm-popup-desc">{selected.desc}</div>

              <div className="cm-popup-section-title">Select Weight</div>
              <div className="cm-popup-weights">
                {WEIGHTS.map((w, i) => (
                  <button
                    key={w.label}
                    className={`cm-popup-wt-btn${popupWt === i ? " active" : ""}`}
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

              <div className="cm-qty-row">
                <span className="cm-qty-label">Quantity:</span>
                <div className="cm-qty-ctrl">
                  <button className="cm-qty-btn" onClick={() => setPopupQty(q => Math.max(1, q - 1))}>−</button>
                  <span className="cm-qty-num">{popupQty}</span>
                  <button
                    className="cm-qty-btn"
                    onClick={() => setPopupQty(q => {
                      const stock = getStock(selected, popupWt);
                      return stock !== null && q >= stock ? q : q + 1;
                    })}
                  >+</button>
                </div>
              </div>

              <div className="cm-popup-total">
                <span className="lbl">Total Amount</span>
                <span className="amt">Rs. {getPrice(selected.basePrice, popupWt) * popupQty}</span>
              </div>

              <div className="cm-popup-btns">
                <button className="cm-popup-cart-btn" onClick={() => addToCart(selected, popupWt, popupQty)}>
                  🛒 Add to Cart
                </button>
                <button className="cm-popup-close" onClick={() => setSelected(null)}>✕ Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── NOTIFICATIONS ── */}
      {showNotif && (
        <>
          <div style={{ position:"fixed", inset:0, zIndex:899 }} onClick={() => setShowNotif(false)} />
          <div className="cm-notif-drawer">
            <div className="cm-notif-head">
              <h4>🔔 Notifications</h4>
              <span onClick={markAllRead}>Mark all read</span>
            </div>
            {notifs.map(n => (
              <div key={n.id} className={`cm-notif-item${n.unread ? " unread" : ""}`}>
                {n.unread && <span className="cm-notif-dot"></span>}
                <div className="cm-notif-text">{n.text}</div>
                <div className="cm-notif-time">{n.time}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── WISHLIST DRAWER ── */}
      {showWish && (
        <>
          <div className="cm-cart-overlay" onClick={() => setShowWish(false)} />
          <div className="cm-wish-drawer">
            <div className="cm-wish-head">
              <h3>❤️ Wishlist ({wishCount})</h3>
              <button className="cm-wish-head-close" onClick={() => setShowWish(false)}>✕</button>
            </div>
            <div className="cm-wish-items">
              {wishProducts.length === 0 ? (
                <div className="cm-cart-empty"><div className="icon">❤️</div><p>Your wishlist is empty</p></div>
              ) : wishProducts.map(p => (
                <div className="cm-wish-item" key={p.id}>
                  <div className="cm-wish-item-photo"><img src={p.image} alt={p.name} /></div>
                  <div className="cm-wish-item-info">
                    <div className="cm-wish-item-name">{p.name}</div>
                    <div className="cm-wish-item-price">from Rs. {getPrice(p.basePrice, 0)}</div>
                  </div>
                  <button className="cm-wish-move-btn" onClick={() => wishToCart(p)}>+ Cart</button>
                  <button className="cm-wish-remove" onClick={() => toggleWish(p)}>🗑</button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── CART DRAWER ── */}
      {showCart && (
        <>
          <div className="cm-cart-overlay" onClick={() => setShowCart(false)} />
          <div className="cm-cart-drawer">
            <div className="cm-cart-head">
              <h3>🛒 Cart ({cartCount} items)</h3>
              <button className="cm-cart-head-close" onClick={() => setShowCart(false)}>✕</button>
            </div>
            <div className="cm-cart-items">
              {Object.values(cart).length === 0 ? (
                <div className="cm-cart-empty"><div className="icon">🛒</div><p>Your cart is empty</p></div>
              ) : Object.values(cart).map(item => (
                <div className="cm-cart-item" key={item.key}>
                  <div className="cm-cart-item-photo"><img src={item.image} alt={item.name} /></div>
                  <div className="cm-cart-item-info">
                    <div className="cm-cart-item-name">{item.name}</div>

                    <div className="cm-cart-weight-row">
                      {WEIGHTS.map((w, i) => (
                        <button
                          key={w.label}
                          className={`cm-cart-wt-btn${item.wtIdx === i ? " active" : ""}`}
                          onClick={() => changeCartWeight(item.key, i)}
                        >{w.label}</button>
                      ))}
                    </div>

                    <div className="cm-cart-item-price">Rs. {item.totalPrice} / pack ({item.weight})</div>

                    <div className="cm-cart-item-qty">
                      <button onClick={() => changeCartQty(item.key, -1)}>−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => incrementCartItem(item.key)}>+</button>
                    </div>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6 }}>
                    <div className="cm-cart-item-sub">Rs. {item.totalPrice * item.qty}</div>
                    <button className="cm-cart-item-remove" onClick={() => changeCartQty(item.key, -item.qty)}>✕</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cm-cart-footer">
              <div className="cm-summary-row"><span>Subtotal</span><span>Rs. {cartTotal}</span></div>
              <div className="cm-summary-row"><span>Delivery</span><span>Rs. {cartTotal > 0 ? 150 : 0}</span></div>
              <div className="cm-summary-row total"><span>Total</span><span>Rs. {cartTotal + (cartTotal > 0 ? 150 : 0)}</span></div>
              <button
                className="cm-checkout-btn"
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
        <div className="cm-toast">
          <div className="cm-toast-dot"></div>
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}

export default ChaiMasalaProducts;
