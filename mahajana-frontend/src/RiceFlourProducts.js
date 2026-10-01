import React, { useState, useEffect } from "react";
import "./RiceFlourProducts.css";
import aasirwadha from "./assets/riceflour/aasirwadha.jpg";
import baking from "./assets/riceflour/baking.jpg";
import banana from "./assets/riceflour/banana.jpg";
import beans from "./assets/riceflour/beans.jpg";
import cacao from "./assets/riceflour/cacao.jpg";
import cassava from "./assets/riceflour/cassava.jpg";
import cassaya from "./assets/riceflour/cassaya.jpg";
import jower from "./assets/riceflour/jower.jpg";
import organic from "./assets/riceflour/organic.jpg";
import plantain from "./assets/riceflour/plantain.jpg";
import quinoa from "./assets/riceflour/quinoa.jpg";
import ragi from "./assets/riceflour/ragi.jpg";
import rice from "./assets/riceflour/rice.jpg";
import sweet from "./assets/riceflour/sweet.jpg";
import white from "./assets/riceflour/white.jpg";
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
  { id:1,  name:"Premium Wheat Flour", basePrice:280, cat:"Specialty", icon:"🍚", image: aasirwadha, desc:"Fine-milled all-purpose wheat flour." },
  { id:2,  name:"Baking Flour", basePrice:300, cat:"Specialty", icon:"🍚", image: baking, desc:"All-purpose baking flour for cakes and bread." },
  { id:3,  name:"Banana Flour", basePrice:380, cat:"Root Flours", icon:"🍚", image: banana, desc:"Green banana flour, gluten-free and mild." },
  { id:4,  name:"Bean Flour", basePrice:340, cat:"Specialty", icon:"🍚", image: beans, desc:"Protein-rich bean flour for savoury dishes." },
  { id:5,  name:"Cacao Powder", basePrice:520, cat:"Specialty", icon:"🍚", image: cacao, desc:"Pure unsweetened cacao powder.", badge:"Premium" },
  { id:6,  name:"Cassava Flour", basePrice:320, cat:"Root Flours", icon:"🍚", image: cassava, desc:"Gluten-free cassava root flour." },
  { id:7,  name:"Cassava Flour (Fine)", basePrice:330, cat:"Root Flours", icon:"🍚", image: cassaya, desc:"Extra-fine cassava flour for pastries." },
  { id:8,  name:"Jowar Flour (Sorghum)", basePrice:350, cat:"Specialty", icon:"🍚", image: jower, desc:"Nutritious sorghum flour, naturally gluten-free." },
  { id:9,  name:"Organic Rice Flour", basePrice:300, cat:"Rice Flours", icon:"🍚", image: organic, desc:"Certified organic rice flour.", badge:"Organic" },
  { id:10,  name:"Plantain Flour", basePrice:360, cat:"Root Flours", icon:"🍚", image: plantain, desc:"Green plantain flour, rich in resistant starch." },
  { id:11,  name:"Quinoa Flour", basePrice:480, cat:"Specialty", icon:"🍚", image: quinoa, desc:"Protein-packed quinoa flour.", badge:"Premium" },
  { id:12,  name:"Ragi Flour (Finger Millet)", basePrice:340, cat:"Specialty", icon:"🍚", image: ragi, desc:"Iron-rich ragi flour, a wholesome staple.", badge:"Bestseller" },
  { id:13,  name:"Rice Flour", basePrice:260, cat:"Rice Flours", icon:"🍚", image: rice, desc:"Everyday fine rice flour." },
  { id:14,  name:"Sweet Rice Flour", basePrice:290, cat:"Rice Flours", icon:"🍚", image: sweet, desc:"Glutinous rice flour for traditional sweets." },
  { id:15,  name:"White Rice Flour", basePrice:250, cat:"Rice Flours", icon:"🍚", image: white, desc:"Classic white rice flour for hoppers and string hoppers." },
];

const CATS = [
  { name: "All", icon: "🌾" },
  { name: "Rice Flours", icon: "" },
  { name: "Root Flours", icon: "" },
  { name: "Specialty", icon: "" },
];

const NOTIFS = [
  { id:1, text:"Your order #1501 is ready for pickup!", time:"2 mins ago", unread:true },
  { id:2, text:"New offer: 10% off on Ragi Flour", time:"1 hour ago", unread:true },
  { id:3, text:"Order #1487 has been delivered.", time:"Yesterday", unread:false },
];

function RiceFlourProducts({ onBack }) {
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
  const CATEGORY = "RiceFlour";
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
    api.getProducts("RiceFlour").then((rows) => {
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
    <div className="rf-page">

      {/* ── NAVBAR ── */}
      <nav className="ap-navbar">
        <div className="ap-nav-left">
          <span className="ap-brand">
            MAHAJANA <span>GRINDING MILL</span>
          </span>
        </div>

        <div className="ap-nav-links">
          <span onClick={onBack}>Home</span>
          <span className="ap-nav-active">Flour & Baking</span>
          <span>Categories</span>
          <span>Contact</span>
        </div>

        <div className="ap-search-wrap">
          <span className="ap-search-icon">🔍</span>
          <input
            className="ap-search"
            placeholder="Search flour & baking..."
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
      <div className="rf-page-header">
        <span className="rf-spice-float f1">🌾</span>
        <span className="rf-spice-float f2">🍞</span>
        <span className="rf-spice-float f3">🥣</span>
        <span className="rf-spice-float f4">✨</span>
        <span className="rf-spice-float f5">🌿</span>
        <span className="rf-spice-float f6">🥐</span>
        <div className="rf-page-header-left">
          <div className="rf-hero-badge">Milled Fresh Daily</div>
          <h1>Flour & Baking <span>Collection</span></h1>
          <p>Rice, root & grain flours — milled fresh for your kitchen and bakery</p>
        </div>
        <div className="rf-page-header-stats">
          <div className="rf-pgstat"><b>15</b><span>Varieties</span></div>
          <div className="rf-pgstat"><b>100%</b><span>Pure</span></div>
          <div className="rf-pgstat"><b>5</b><span>Sizes</span></div>
        </div>
      </div>

      {/* ── CATEGORY CHIPS ── */}
      <div className="rf-filter-bar">
        {CATS.map(c => (
          <button
            key={c.name}
            className={`rf-filter-btn${cat === c.name ? " active" : ""}`}
            onClick={() => setCat(c.name)}
          >
            <span>{c.icon}</span> {c.name}
          </button>
        ))}
        <span className="rf-count">{filtered.length} products</span>
      </div>

      {/* ── GRID ── */}
      <div className="rf-grid-section">
        {filtered.length === 0 ? (
          <div className="rf-empty">
            <div className="rf-empty-icon">🔍</div>
            <p>No products found for "{search}"</p>
          </div>
        ) : (
          <div className="rf-grid">
            {filtered.map((p, idx) => {
              const wtIdx = getCardWt(p.id);
              const price = getPrice(p.basePrice, wtIdx);
              return (
                <div className="rf-card" key={p.id} style={{ animationDelay: `${(idx % 10) * 0.04}s` }}>
                  <div className="rf-packet" onClick={() => openProduct(p)}>
                    <img src={p.image} alt={p.name} className="rf-product-photo" />
                    <div className="rf-photo-overlay"></div>
                  </div>

                  <button
                    className={`rf-wish-btn${wishlist.has(p.id) ? " wished" : ""}`}
                    onClick={() => toggleWish(p)}
                  >{wishlist.has(p.id) ? "❤️" : "🤍"}</button>

                  {p.badge && (
                    <div className="rf-card-badge">
                      <span className={`rf-badge-tag ${badgeClass(p.badge)}`}>{p.badge}</span>
                    </div>
                  )}

                  <div className="rf-card-body">
                    <div className="rf-card-name">{p.name}</div>
                    <div className="rf-card-cat">{p.cat}</div>

                    <div className="rf-weight-row">
                      {WEIGHTS.map((w, i) => (
                        <button
                          key={w.label}
                          className={`rf-weight-btn${wtIdx === i ? " active" : ""}`}
                          onClick={() => setCardWt(p.id, i)}
                        >{w.label}</button>
                      ))}
                    </div>

                    {getStock(p, wtIdx) !== null && (
                      <div style={{ fontSize: 11, margin: "2px 0", color: getStock(p, wtIdx) === 0 ? "#e05c4f" : getStock(p, wtIdx) < 10 ? "#f4b400" : "#8fbf8f" }}>
                        {getStock(p, wtIdx) === 0 ? "Out of stock" : `Stock: ${getStock(p, wtIdx)}`}
                      </div>
                    )}

                    <div className="rf-card-bottom">
                      <div className="rf-card-price">
                        Rs. {price} <span>/ {WEIGHTS[wtIdx].label}</span>
                      </div>
                      <button className="rf-add-btn" onClick={() => addToCart(p, wtIdx)}>
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
        <div className="rf-popup-overlay" onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className="rf-popup">
            <div className="rf-popup-photo-area">
              <img src={selected.image} alt={selected.name} className="rf-popup-photo" />
              <div className="rf-popup-photo-overlay">
                <span className="rf-popup-photo-brand">Mahajana Grinding Mill</span>
                <div className="rf-popup-photo-name">{selected.name}</div>
              </div>
            </div>

            <div className="rf-popup-body">
              <div className="rf-popup-cat">{selected.cat}</div>
              <div className="rf-popup-desc">{selected.desc}</div>

              <div className="rf-popup-section-title">Select Weight</div>
              <div className="rf-popup-weights">
                {WEIGHTS.map((w, i) => (
                  <button
                    key={w.label}
                    className={`rf-popup-wt-btn${popupWt === i ? " active" : ""}`}
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

              <div className="rf-qty-row">
                <span className="rf-qty-label">Quantity:</span>
                <div className="rf-qty-ctrl">
                  <button className="rf-qty-btn" onClick={() => setPopupQty(q => Math.max(1, q - 1))}>−</button>
                  <span className="rf-qty-num">{popupQty}</span>
                  <button
                    className="rf-qty-btn"
                    onClick={() => setPopupQty(q => {
                      const stock = getStock(selected, popupWt);
                      return stock !== null && q >= stock ? q : q + 1;
                    })}
                  >+</button>
                </div>
              </div>

              <div className="rf-popup-total">
                <span className="lbl">Total Amount</span>
                <span className="amt">Rs. {getPrice(selected.basePrice, popupWt) * popupQty}</span>
              </div>

              <div className="rf-popup-btns">
                <button className="rf-popup-cart-btn" onClick={() => addToCart(selected, popupWt, popupQty)}>
                  🛒 Add to Cart
                </button>
                <button className="rf-popup-close" onClick={() => setSelected(null)}>✕ Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── NOTIFICATIONS ── */}
      {showNotif && (
        <>
          <div style={{ position:"fixed", inset:0, zIndex:899 }} onClick={() => setShowNotif(false)} />
          <div className="rf-notif-drawer">
            <div className="rf-notif-head">
              <h4>🔔 Notifications</h4>
              <span onClick={markAllRead}>Mark all read</span>
            </div>
            {notifs.map(n => (
              <div key={n.id} className={`rf-notif-item${n.unread ? " unread" : ""}`}>
                {n.unread && <span className="rf-notif-dot"></span>}
                <div className="rf-notif-text">{n.text}</div>
                <div className="rf-notif-time">{n.time}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── WISHLIST DRAWER ── */}
      {showWish && (
        <>
          <div className="rf-cart-overlay" onClick={() => setShowWish(false)} />
          <div className="rf-wish-drawer">
            <div className="rf-wish-head">
              <h3>❤️ Wishlist ({wishCount})</h3>
              <button className="rf-wish-head-close" onClick={() => setShowWish(false)}>✕</button>
            </div>
            <div className="rf-wish-items">
              {wishProducts.length === 0 ? (
                <div className="rf-cart-empty"><div className="icon">❤️</div><p>Your wishlist is empty</p></div>
              ) : wishProducts.map(p => (
                <div className="rf-wish-item" key={p.id}>
                  <div className="rf-wish-item-photo"><img src={p.image} alt={p.name} /></div>
                  <div className="rf-wish-item-info">
                    <div className="rf-wish-item-name">{p.name}</div>
                    <div className="rf-wish-item-price">from Rs. {getPrice(p.basePrice, 0)}</div>
                  </div>
                  <button className="rf-wish-move-btn" onClick={() => wishToCart(p)}>+ Cart</button>
                  <button className="rf-wish-remove" onClick={() => toggleWish(p)}>🗑</button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── CART DRAWER ── */}
      {showCart && (
        <>
          <div className="rf-cart-overlay" onClick={() => setShowCart(false)} />
          <div className="rf-cart-drawer">
            <div className="rf-cart-head">
              <h3>🛒 Cart ({cartCount} items)</h3>
              <button className="rf-cart-head-close" onClick={() => setShowCart(false)}>✕</button>
            </div>
            <div className="rf-cart-items">
              {Object.values(cart).length === 0 ? (
                <div className="rf-cart-empty"><div className="icon">🛒</div><p>Your cart is empty</p></div>
              ) : Object.values(cart).map(item => (
                <div className="rf-cart-item" key={item.key}>
                  <div className="rf-cart-item-photo"><img src={item.image} alt={item.name} /></div>
                  <div className="rf-cart-item-info">
                    <div className="rf-cart-item-name">{item.name}</div>

                    <div className="rf-cart-weight-row">
                      {WEIGHTS.map((w, i) => (
                        <button
                          key={w.label}
                          className={`rf-cart-wt-btn${item.wtIdx === i ? " active" : ""}`}
                          onClick={() => changeCartWeight(item.key, i)}
                        >{w.label}</button>
                      ))}
                    </div>

                    <div className="rf-cart-item-price">Rs. {item.totalPrice} / pack ({item.weight})</div>

                    <div className="rf-cart-item-qty">
                      <button onClick={() => changeCartQty(item.key, -1)}>−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => incrementCartItem(item.key)}>+</button>
                    </div>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6 }}>
                    <div className="rf-cart-item-sub">Rs. {item.totalPrice * item.qty}</div>
                    <button className="rf-cart-item-remove" onClick={() => changeCartQty(item.key, -item.qty)}>✕</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="rf-cart-footer">
              <div className="rf-summary-row"><span>Subtotal</span><span>Rs. {cartTotal}</span></div>
              <div className="rf-summary-row"><span>Delivery</span><span>Rs. {cartTotal > 0 ? 150 : 0}</span></div>
              <div className="rf-summary-row total"><span>Total</span><span>Rs. {cartTotal + (cartTotal > 0 ? 150 : 0)}</span></div>
              <button
                className="rf-checkout-btn"
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
        <div className="rf-toast">
          <div className="rf-toast-dot"></div>
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}

export default RiceFlourProducts;
