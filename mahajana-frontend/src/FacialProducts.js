import React, { useState, useEffect } from "react";
import "./FacialProducts.css";
import aloevera from "./assets/facial/aloevera.jpg";
import charcol from "./assets/facial/charcol.jpg";
import curry from "./assets/facial/curry.jpg";
import fenugureek from "./assets/facial/fenugureek.jpg";
import herbal from "./assets/facial/herbal.jpg";
import multani from "./assets/facial/multani.jpg";
import neem from "./assets/facial/neem.jpg";
import orangepeel from "./assets/facial/orangepeel.jpg";
import rice from "./assets/facial/rice.jpg";
import rosepack from "./assets/facial/rosepack.jpg";
import sandalwood from "./assets/facial/sandalwood.jpg";
import turmeric from "./assets/facial/turmeric.jpg";
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
  { id:1,  name:"Aloe Vera Face Pack", basePrice:380, cat:"Face Packs", icon:"🌸", image: aloevera, desc:"Soothing aloe vera powder for calm, hydrated skin.", badge:"Organic" },
  { id:2,  name:"Charcoal Face Pack", basePrice:420, cat:"Exfoliants", icon:"🌸", image: charcol, desc:"Activated charcoal for deep pore cleansing." },
  { id:3,  name:"Curry Leaf Face Pack", basePrice:350, cat:"Face Packs", icon:"🌸", image: curry, desc:"Nutrient-rich curry leaf powder for glowing skin." },
  { id:4,  name:"Fenugreek Face Pack", basePrice:340, cat:"Face Packs", icon:"🌸", image: fenugureek, desc:"Fenugreek powder to soothe and nourish skin." },
  { id:5,  name:"Herbal Face Pack", basePrice:360, cat:"Face Packs", icon:"🌸", image: herbal, desc:"A traditional blend of healing herbs." },
  { id:6,  name:"Multani Mitti (Fuller's Earth)", basePrice:300, cat:"Exfoliants", icon:"🌸", image: multani, desc:"Classic clay pack for oil control.", badge:"Bestseller" },
  { id:7,  name:"Neem Face Pack", basePrice:330, cat:"Face Packs", icon:"🌸", image: neem, desc:"Purifying neem powder for clear skin." },
  { id:8,  name:"Orange Peel Powder", basePrice:320, cat:"Exfoliants", icon:"🌸", image: orangepeel, desc:"Brightening citrus peel powder." },
  { id:9,  name:"Rice Face Pack", basePrice:290, cat:"Exfoliants", icon:"🌸", image: rice, desc:"Gentle rice powder for soft, smooth skin." },
  { id:10,  name:"Rose Petal Face Pack", basePrice:400, cat:"Face Packs", icon:"🌸", image: rosepack, desc:"Fragrant rose petal powder for radiant skin.", badge:"Premium" },
  { id:11,  name:"Sandalwood Face Pack", basePrice:480, cat:"Face Packs", icon:"🌸", image: sandalwood, desc:"Cooling sandalwood powder, a timeless favourite.", badge:"Premium" },
  { id:12,  name:"Turmeric Face Pack", basePrice:310, cat:"Face Packs", icon:"🌸", image: turmeric, desc:"Golden turmeric powder for a natural glow.", badge:"Organic" },
];

const CATS = [
  { name: "All", icon: "" },
  { name: "Face Packs", icon: "" },
  { name: "Exfoliants", icon: "" },
];

const NOTIFS = [
  { id:1, text:"Your order #1301 is ready for pickup!", time:"2 mins ago", unread:true },
  { id:2, text:"New offer: 10% off on Sandalwood Pack", time:"1 hour ago", unread:true },
  { id:3, text:"Order #1290 has been delivered.", time:"Yesterday", unread:false },
];

function FacialProducts({ onBack }) {
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
  const CATEGORY = "Facial";
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
    api.getProducts("Facial").then((rows) => {
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
    <div className="fc-page">

      {/* ── NAVBAR ── */}
      <nav className="ap-navbar">
        <div className="ap-nav-left">
          <span className="ap-brand">
            MAHAJANA <span>GRINDING MILL</span>
          </span>
        </div>

        <div className="ap-nav-links">
          <span onClick={onBack}>Home</span>
          <span className="ap-nav-active">Facial Care</span>
          <span>Categories</span>
          <span>Contact</span>
        </div>

        <div className="ap-search-wrap">
          <span className="ap-search-icon"></span>
          <input
            className="ap-search"
            placeholder="Search facial care..."
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
      <div className="fc-page-header">
        <span className="fc-spice-float f1">🌿</span>
        <span className="fc-spice-float f2">🌸</span>
        <span className="fc-spice-float f3">✨</span>
        <span className="fc-spice-float f4">🍃</span>
        <span className="fc-spice-float f5">💧</span>
        <span className="fc-spice-float f6">🪷</span>
        <div className="fc-page-header-left">
          <div className="fc-hero-badge">100% Herbal</div>
          <h1>Facial Care <span>Collection</span></h1>
          <p>Natural face packs ground fresh — for glowing, healthy skin</p>
        </div>
        <div className="fc-page-header-stats">
          <div className="fc-pgstat"><b>12</b><span>Varieties</span></div>
          <div className="fc-pgstat"><b>100%</b><span>Herbal</span></div>
          <div className="fc-pgstat"><b>5</b><span>Sizes</span></div>
        </div>
      </div>

      {/* ── CATEGORY CHIPS ── */}
      <div className="fc-filter-bar">
        {CATS.map(c => (
          <button
            key={c.name}
            className={`fc-filter-btn${cat === c.name ? " active" : ""}`}
            onClick={() => setCat(c.name)}
          >
            <span>{c.icon}</span> {c.name}
          </button>
        ))}
        <span className="fc-count">{filtered.length} products</span>
      </div>

      {/* ── GRID ── */}
      <div className="fc-grid-section">
        {filtered.length === 0 ? (
          <div className="fc-empty">
            <div className="fc-empty-icon">🔍</div>
            <p>No products found for "{search}"</p>
          </div>
        ) : (
          <div className="fc-grid">
            {filtered.map((p, idx) => {
              const wtIdx = getCardWt(p.id);
              const price = getPrice(p.basePrice, wtIdx);
              return (
                <div className="fc-card" key={p.id} style={{ animationDelay: `${(idx % 10) * 0.04}s` }}>
                  <div className="fc-packet" onClick={() => openProduct(p)}>
                    <img src={p.image} alt={p.name} className="fc-product-photo" />
                    <div className="fc-photo-overlay"></div>
                  </div>

                  <button
                    className={`fc-wish-btn${wishlist.has(p.id) ? " wished" : ""}`}
                    onClick={() => toggleWish(p)}
                  >{wishlist.has(p.id) ? "❤️" : "🤍"}</button>

                  {p.badge && (
                    <div className="fc-card-badge">
                      <span className={`fc-badge-tag ${badgeClass(p.badge)}`}>{p.badge}</span>
                    </div>
                  )}

                  <div className="fc-card-body">
                    <div className="fc-card-name">{p.name}</div>
                    <div className="fc-card-cat">{p.cat}</div>

                    <div className="fc-weight-row">
                      {WEIGHTS.map((w, i) => (
                        <button
                          key={w.label}
                          className={`fc-weight-btn${wtIdx === i ? " active" : ""}`}
                          onClick={() => setCardWt(p.id, i)}
                        >{w.label}</button>
                      ))}
                    </div>

                    {getStock(p, wtIdx) !== null && (
                      <div style={{ fontSize: 11, margin: "2px 0", color: getStock(p, wtIdx) === 0 ? "#e05c4f" : getStock(p, wtIdx) < 10 ? "#f4b400" : "#8fbf8f" }}>
                        {getStock(p, wtIdx) === 0 ? "Out of stock" : `Stock: ${getStock(p, wtIdx)}`}
                      </div>
                    )}

                    <div className="fc-card-bottom">
                      <div className="fc-card-price">
                        Rs. {price} <span>/ {WEIGHTS[wtIdx].label}</span>
                      </div>
                      <button className="fc-add-btn" onClick={() => addToCart(p, wtIdx)}>
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
        <div className="fc-popup-overlay" onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className="fc-popup">
            <div className="fc-popup-photo-area">
              <img src={selected.image} alt={selected.name} className="fc-popup-photo" />
              <div className="fc-popup-photo-overlay">
                <span className="fc-popup-photo-brand">Mahajana Grinding Mill</span>
                <div className="fc-popup-photo-name">{selected.name}</div>
              </div>
            </div>

            <div className="fc-popup-body">
              <div className="fc-popup-cat">{selected.cat}</div>
              <div className="fc-popup-desc">{selected.desc}</div>

              <div className="fc-popup-section-title">Select Weight</div>
              <div className="fc-popup-weights">
                {WEIGHTS.map((w, i) => (
                  <button
                    key={w.label}
                    className={`fc-popup-wt-btn${popupWt === i ? " active" : ""}`}
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

              <div className="fc-qty-row">
                <span className="fc-qty-label">Quantity:</span>
                <div className="fc-qty-ctrl">
                  <button className="fc-qty-btn" onClick={() => setPopupQty(q => Math.max(1, q - 1))}>−</button>
                  <span className="fc-qty-num">{popupQty}</span>
                  <button
                    className="fc-qty-btn"
                    onClick={() => setPopupQty(q => {
                      const stock = getStock(selected, popupWt);
                      return stock !== null && q >= stock ? q : q + 1;
                    })}
                  >+</button>
                </div>
              </div>

              <div className="fc-popup-total">
                <span className="lbl">Total Amount</span>
                <span className="amt">Rs. {getPrice(selected.basePrice, popupWt) * popupQty}</span>
              </div>

              <div className="fc-popup-btns">
                <button className="fc-popup-cart-btn" onClick={() => addToCart(selected, popupWt, popupQty)}>
                  🛒 Add to Cart
                </button>
                <button className="fc-popup-close" onClick={() => setSelected(null)}>✕ Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── NOTIFICATIONS ── */}
      {showNotif && (
        <>
          <div style={{ position:"fixed", inset:0, zIndex:899 }} onClick={() => setShowNotif(false)} />
          <div className="fc-notif-drawer">
            <div className="fc-notif-head">
              <h4>🔔 Notifications</h4>
              <span onClick={markAllRead}>Mark all read</span>
            </div>
            {notifs.map(n => (
              <div key={n.id} className={`fc-notif-item${n.unread ? " unread" : ""}`}>
                {n.unread && <span className="fc-notif-dot"></span>}
                <div className="fc-notif-text">{n.text}</div>
                <div className="fc-notif-time">{n.time}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── WISHLIST DRAWER ── */}
      {showWish && (
        <>
          <div className="fc-cart-overlay" onClick={() => setShowWish(false)} />
          <div className="fc-wish-drawer">
            <div className="fc-wish-head">
              <h3>❤️ Wishlist ({wishCount})</h3>
              <button className="fc-wish-head-close" onClick={() => setShowWish(false)}>✕</button>
            </div>
            <div className="fc-wish-items">
              {wishProducts.length === 0 ? (
                <div className="fc-cart-empty"><div className="icon">❤️</div><p>Your wishlist is empty</p></div>
              ) : wishProducts.map(p => (
                <div className="fc-wish-item" key={p.id}>
                  <div className="fc-wish-item-photo"><img src={p.image} alt={p.name} /></div>
                  <div className="fc-wish-item-info">
                    <div className="fc-wish-item-name">{p.name}</div>
                    <div className="fc-wish-item-price">from Rs. {getPrice(p.basePrice, 0)}</div>
                  </div>
                  <button className="fc-wish-move-btn" onClick={() => wishToCart(p)}>+ Cart</button>
                  <button className="fc-wish-remove" onClick={() => toggleWish(p)}>🗑</button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── CART DRAWER ── */}
      {showCart && (
        <>
          <div className="fc-cart-overlay" onClick={() => setShowCart(false)} />
          <div className="fc-cart-drawer">
            <div className="fc-cart-head">
              <h3>🛒 Cart ({cartCount} items)</h3>
              <button className="fc-cart-head-close" onClick={() => setShowCart(false)}>✕</button>
            </div>
            <div className="fc-cart-items">
              {Object.values(cart).length === 0 ? (
                <div className="fc-cart-empty"><div className="icon">🛒</div><p>Your cart is empty</p></div>
              ) : Object.values(cart).map(item => (
                <div className="fc-cart-item" key={item.key}>
                  <div className="fc-cart-item-photo"><img src={item.image} alt={item.name} /></div>
                  <div className="fc-cart-item-info">
                    <div className="fc-cart-item-name">{item.name}</div>

                    <div className="fc-cart-weight-row">
                      {WEIGHTS.map((w, i) => (
                        <button
                          key={w.label}
                          className={`fc-cart-wt-btn${item.wtIdx === i ? " active" : ""}`}
                          onClick={() => changeCartWeight(item.key, i)}
                        >{w.label}</button>
                      ))}
                    </div>

                    <div className="fc-cart-item-price">Rs. {item.totalPrice} / pack ({item.weight})</div>

                    <div className="fc-cart-item-qty">
                      <button onClick={() => changeCartQty(item.key, -1)}>−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => incrementCartItem(item.key)}>+</button>
                    </div>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6 }}>
                    <div className="fc-cart-item-sub">Rs. {item.totalPrice * item.qty}</div>
                    <button className="fc-cart-item-remove" onClick={() => changeCartQty(item.key, -item.qty)}>✕</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="fc-cart-footer">
              <div className="fc-summary-row"><span>Subtotal</span><span>Rs. {cartTotal}</span></div>
              <div className="fc-summary-row"><span>Delivery</span><span>Rs. {cartTotal > 0 ? 150 : 0}</span></div>
              <div className="fc-summary-row total"><span>Total</span><span>Rs. {cartTotal + (cartTotal > 0 ? 150 : 0)}</span></div>
              <button
                className="fc-checkout-btn"
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
        <div className="fc-toast">
          <div className="fc-toast-dot"></div>
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}

export default FacialProducts;
