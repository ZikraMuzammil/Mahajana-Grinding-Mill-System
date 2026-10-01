import React, { useState, useEffect } from "react";
import "./GrainsProducts.css";
import blackgram from "./assets/Grains/blackgram.jpg";
import cheakpeas from "./assets/Grains/cheakpeas.jpg";
import cowpea from "./assets/Grains/cowpea.jpg";
import finger from "./assets/Grains/finger.jpg";
import foxtail from "./assets/Grains/foxtail.jpg";
import keeri from "./assets/Grains/keeri.jpg";
import kuruwa from "./assets/Grains/kuruwa.jpg";
import maize from "./assets/Grains/maize.jpg";
import mungbeans from "./assets/Grains/mungbeans.jpg";
import oryza from "./assets/Grains/oryza.jpg";
import poha from "./assets/Grains/poha.jpg";
import redrice from "./assets/Grains/redrice.jpg";
import samba from "./assets/Grains/samba.jpg";
import sesame from "./assets/Grains/sesame.jpg";
import whiterice from "./assets/Grains/whiterice.jpg";
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
  { id:1,  name:"Black Gram (Undu)", basePrice:280, cat:"Pulses", icon:"🍚", image: blackgram, desc:"Whole black gram, rich in protein and fibre." },
  { id:2,  name:"Chickpeas (Kadala)", basePrice:260, cat:"Pulses", icon:"🍚", image: cheakpeas, desc:"Premium whole chickpeas, perfect for curries." },
  { id:3,  name:"Cowpea (Me Karal)", basePrice:240, cat:"Pulses", icon:"🍚", image: cowpea, desc:"Traditional Sri Lankan cowpea, slow-cooked classic." },
  { id:4,  name:"Finger Millet (Kurakkan)", basePrice:320, cat:"Millets", icon:"🍚", image: finger, desc:"Nutrient-dense kurakkan flour grain, stone-ground.", badge:"Organic" },
  { id:5,  name:"Foxtail Millet", basePrice:350, cat:"Millets", icon:"🍚", image: foxtail, desc:"Ancient grain millet, light and easy to digest." },
  { id:6,  name:"Keeri Samba Rice", basePrice:300, cat:"Rice", icon:"🍚", image: keeri, desc:"Fragrant short-grain rice, a Sri Lankan favourite.", badge:"Premium" },
  { id:7,  name:"Kuruluthuda Rice", basePrice:310, cat:"Rice", icon:"🍚", image: kuruwa, desc:"Traditional heirloom rice variety, naturally aromatic." },
  { id:8,  name:"Maize (Corn)", basePrice:220, cat:"Millets", icon:"🍚", image: maize, desc:"Sun-dried whole maize kernels, milled fresh." },
  { id:9,  name:"Green Gram (Mung Beans)", basePrice:270, cat:"Pulses", icon:"🍚", image: mungbeans, desc:"Whole green gram, ideal for kanji and curries." },
  { id:10,  name:"Basmati Rice", basePrice:420, cat:"Rice", icon:"🍚", image: oryza, desc:"Long-grain aromatic basmati, imported quality.", badge:"Premium" },
  { id:11,  name:"Rice Flakes (Poha)", basePrice:230, cat:"Rice", icon:"🍚", image: poha, desc:"Flattened rice flakes, ready in minutes." },
  { id:12,  name:"Red Rice", basePrice:280, cat:"Rice", icon:"🍚", image: redrice, desc:"Whole unpolished red rice, high in fibre.", badge:"Bestseller" },
  { id:13,  name:"Samba Rice", basePrice:290, cat:"Rice", icon:"🍚", image: samba, desc:"Everyday samba rice, soft and filling." },
  { id:14,  name:"Sesame Seeds", basePrice:260, cat:"Millets", icon:"🍚", image: sesame, desc:"Toasted sesame seeds for garnish and oil." },
  { id:15,  name:"White Rice", basePrice:240, cat:"Rice", icon:"🍚", image: whiterice, desc:"Everyday polished white rice." },
];

const CATS = [
  { name: "All", icon: "" },
  { name: "Rice", icon: "" },
  { name: "Millets", icon: "" },
  { name: "Pulses", icon: "" },
];

const NOTIFS = [
  { id:1, text:"Your order #1101 is ready for pickup!", time:"2 mins ago", unread:true },
  { id:2, text:"New offer: 10% off on Red Rice", time:"1 hour ago", unread:true },
  { id:3, text:"Order #1098 has been delivered.", time:"Yesterday", unread:false },
];

function GrainsProducts({ onBack }) {
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
  const CATEGORY = "Grains";
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
    api.getProducts("Grains").then((rows) => {
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
    <div className="gr-page">

      {/* ── NAVBAR ── */}
      <nav className="ap-navbar">
        <div className="ap-nav-left">
          <span className="ap-brand">
            MAHAJANA <span>GRINDING MILL</span>
          </span>
        </div>

        <div className="ap-nav-links">
          <span onClick={onBack}>Home</span>
          <span className="ap-nav-active">Grains</span>
          <span>Categories</span>
          <span>Contact</span>
        </div>

        <div className="ap-search-wrap">
          <span className="ap-search-icon"></span>
          <input
            className="ap-search"
            placeholder="Search grains..."
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
      <div className="gr-page-header">
        <span className="gr-spice-float f1">🌾</span>
        <span className="gr-spice-float f2">🍚</span>
        <span className="gr-spice-float f3">🌱</span>
        <span className="gr-spice-float f4">🫘</span>
        <span className="gr-spice-float f5">🥣</span>
        <span className="gr-spice-float f6">🌿</span>
        <div className="gr-page-header-left">
          <div className="gr-hero-badge">Stone-Ground Daily</div>
          <h1>Grains <span>Collection</span></h1>
          <p>Wholesome rice, lentils & millets — stone-ground fresh from our mill</p>
        </div>
        <div className="gr-page-header-stats">
          <div className="gr-pgstat"><b>15</b><span>Varieties</span></div>
          <div className="gr-pgstat"><b>100%</b><span>Natural</span></div>
          <div className="gr-pgstat"><b>5</b><span>Sizes</span></div>
        </div>
      </div>

      {/* ── CATEGORY CHIPS ── */}
      <div className="gr-filter-bar">
        {CATS.map(c => (
          <button
            key={c.name}
            className={`gr-filter-btn${cat === c.name ? " active" : ""}`}
            onClick={() => setCat(c.name)}
          >
            <span>{c.icon}</span> {c.name}
          </button>
        ))}
        <span className="gr-count">{filtered.length} products</span>
      </div>

      {/* ── GRID ── */}
      <div className="gr-grid-section">
        {filtered.length === 0 ? (
          <div className="gr-empty">
            <div className="gr-empty-icon"></div>
            <p>No products found for "{search}"</p>
          </div>
        ) : (
          <div className="gr-grid">
            {filtered.map((p, idx) => {
              const wtIdx = getCardWt(p.id);
              const price = getPrice(p.basePrice, wtIdx);
              return (
                <div className="gr-card" key={p.id} style={{ animationDelay: `${(idx % 10) * 0.04}s` }}>
                  <div className="gr-packet" onClick={() => openProduct(p)}>
                    <img src={p.image} alt={p.name} className="gr-product-photo" />
                    <div className="gr-photo-overlay"></div>
                  </div>

                  <button
                    className={`gr-wish-btn${wishlist.has(p.id) ? " wished" : ""}`}
                    onClick={() => toggleWish(p)}
                  >{wishlist.has(p.id) ? "❤️" : "🤍"}</button>

                  {p.badge && (
                    <div className="gr-card-badge">
                      <span className={`gr-badge-tag ${badgeClass(p.badge)}`}>{p.badge}</span>
                    </div>
                  )}

                  <div className="gr-card-body">
                    <div className="gr-card-name">{p.name}</div>
                    <div className="gr-card-cat">{p.cat}</div>

                    <div className="gr-weight-row">
                      {WEIGHTS.map((w, i) => (
                        <button
                          key={w.label}
                          className={`gr-weight-btn${wtIdx === i ? " active" : ""}`}
                          onClick={() => setCardWt(p.id, i)}
                        >{w.label}</button>
                      ))}
                    </div>

                    {getStock(p, wtIdx) !== null && (
                      <div style={{ fontSize: 11, margin: "2px 0", color: getStock(p, wtIdx) === 0 ? "#e05c4f" : getStock(p, wtIdx) < 10 ? "#f4b400" : "#8fbf8f" }}>
                        {getStock(p, wtIdx) === 0 ? "Out of stock" : `Stock: ${getStock(p, wtIdx)}`}
                      </div>
                    )}

                    <div className="gr-card-bottom">
                      <div className="gr-card-price">
                        Rs. {price} <span>/ {WEIGHTS[wtIdx].label}</span>
                      </div>
                      <button className="gr-add-btn" onClick={() => addToCart(p, wtIdx)}>
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
        <div className="gr-popup-overlay" onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className="gr-popup">
            <div className="gr-popup-photo-area">
              <img src={selected.image} alt={selected.name} className="gr-popup-photo" />
              <div className="gr-popup-photo-overlay">
                <span className="gr-popup-photo-brand">Mahajana Grinding Mill</span>
                <div className="gr-popup-photo-name">{selected.name}</div>
              </div>
            </div>

            <div className="gr-popup-body">
              <div className="gr-popup-cat">{selected.cat}</div>
              <div className="gr-popup-desc">{selected.desc}</div>

              <div className="gr-popup-section-title">Select Weight</div>
              <div className="gr-popup-weights">
                {WEIGHTS.map((w, i) => (
                  <button
                    key={w.label}
                    className={`gr-popup-wt-btn${popupWt === i ? " active" : ""}`}
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

              <div className="gr-qty-row">
                <span className="gr-qty-label">Quantity:</span>
                <div className="gr-qty-ctrl">
                  <button className="gr-qty-btn" onClick={() => setPopupQty(q => Math.max(1, q - 1))}>−</button>
                  <span className="gr-qty-num">{popupQty}</span>
                  <button
                    className="gr-qty-btn"
                    onClick={() => setPopupQty(q => {
                      const stock = getStock(selected, popupWt);
                      return stock !== null && q >= stock ? q : q + 1;
                    })}
                  >+</button>
                </div>
              </div>

              <div className="gr-popup-total">
                <span className="lbl">Total Amount</span>
                <span className="amt">Rs. {getPrice(selected.basePrice, popupWt) * popupQty}</span>
              </div>

              <div className="gr-popup-btns">
                <button className="gr-popup-cart-btn" onClick={() => addToCart(selected, popupWt, popupQty)}>
                  🛒 Add to Cart
                </button>
                <button className="gr-popup-close" onClick={() => setSelected(null)}>✕ Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── NOTIFICATIONS ── */}
      {showNotif && (
        <>
          <div style={{ position:"fixed", inset:0, zIndex:899 }} onClick={() => setShowNotif(false)} />
          <div className="gr-notif-drawer">
            <div className="gr-notif-head">
              <h4>🔔 Notifications</h4>
              <span onClick={markAllRead}>Mark all read</span>
            </div>
            {notifs.map(n => (
              <div key={n.id} className={`gr-notif-item${n.unread ? " unread" : ""}`}>
                {n.unread && <span className="gr-notif-dot"></span>}
                <div className="gr-notif-text">{n.text}</div>
                <div className="gr-notif-time">{n.time}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── WISHLIST DRAWER ── */}
      {showWish && (
        <>
          <div className="gr-cart-overlay" onClick={() => setShowWish(false)} />
          <div className="gr-wish-drawer">
            <div className="gr-wish-head">
              <h3>❤️ Wishlist ({wishCount})</h3>
              <button className="gr-wish-head-close" onClick={() => setShowWish(false)}>✕</button>
            </div>
            <div className="gr-wish-items">
              {wishProducts.length === 0 ? (
                <div className="gr-cart-empty"><div className="icon">❤️</div><p>Your wishlist is empty</p></div>
              ) : wishProducts.map(p => (
                <div className="gr-wish-item" key={p.id}>
                  <div className="gr-wish-item-photo"><img src={p.image} alt={p.name} /></div>
                  <div className="gr-wish-item-info">
                    <div className="gr-wish-item-name">{p.name}</div>
                    <div className="gr-wish-item-price">from Rs. {getPrice(p.basePrice, 0)}</div>
                  </div>
                  <button className="gr-wish-move-btn" onClick={() => wishToCart(p)}>+ Cart</button>
                  <button className="gr-wish-remove" onClick={() => toggleWish(p)}>🗑</button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── CART DRAWER ── */}
      {showCart && (
        <>
          <div className="gr-cart-overlay" onClick={() => setShowCart(false)} />
          <div className="gr-cart-drawer">
            <div className="gr-cart-head">
              <h3>🛒 Cart ({cartCount} items)</h3>
              <button className="gr-cart-head-close" onClick={() => setShowCart(false)}>✕</button>
            </div>
            <div className="gr-cart-items">
              {Object.values(cart).length === 0 ? (
                <div className="gr-cart-empty"><div className="icon">🛒</div><p>Your cart is empty</p></div>
              ) : Object.values(cart).map(item => (
                <div className="gr-cart-item" key={item.key}>
                  <div className="gr-cart-item-photo"><img src={item.image} alt={item.name} /></div>
                  <div className="gr-cart-item-info">
                    <div className="gr-cart-item-name">{item.name}</div>

                    <div className="gr-cart-weight-row">
                      {WEIGHTS.map((w, i) => (
                        <button
                          key={w.label}
                          className={`gr-cart-wt-btn${item.wtIdx === i ? " active" : ""}`}
                          onClick={() => changeCartWeight(item.key, i)}
                        >{w.label}</button>
                      ))}
                    </div>

                    <div className="gr-cart-item-price">Rs. {item.totalPrice} / pack ({item.weight})</div>

                    <div className="gr-cart-item-qty">
                      <button onClick={() => changeCartQty(item.key, -1)}>−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => incrementCartItem(item.key)}>+</button>
                    </div>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6 }}>
                    <div className="gr-cart-item-sub">Rs. {item.totalPrice * item.qty}</div>
                    <button className="gr-cart-item-remove" onClick={() => changeCartQty(item.key, -item.qty)}>✕</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="gr-cart-footer">
              <div className="gr-summary-row"><span>Subtotal</span><span>Rs. {cartTotal}</span></div>
              <div className="gr-summary-row"><span>Delivery</span><span>Rs. {cartTotal > 0 ? 150 : 0}</span></div>
              <div className="gr-summary-row total"><span>Total</span><span>Rs. {cartTotal + (cartTotal > 0 ? 150 : 0)}</span></div>
              <button
                className="gr-checkout-btn"
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
        <div className="gr-toast">
          <div className="gr-toast-dot"></div>
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}

export default GrainsProducts;
