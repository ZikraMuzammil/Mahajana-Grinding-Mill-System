import React, { useState, useEffect } from "react";
import "./FlourProducts.css";
import attaflour from "./assets/flour/atta-flour.jpg";
import blackgramflour from "./assets/flour/black-gram-flour.jpg";
import coconutflour from "./assets/flour/coconut-flour.jpg";
import cornflour from "./assets/flour/corn-flour.jpg";
import gramflour from "./assets/flour/gram-flour.jpg";
import greengramflour from "./assets/flour/green-gram-flour.jpg";
import hopperflour from "./assets/flour/hopper-flour.jpg";
import milletflour from "./assets/flour/millet-flour.jpg";
import mixedgrainflour from "./assets/flour/mixed-grain-flour.jpg";
import pittuflour from "./assets/flour/pittu-flour.jpg";
import riceflour from "./assets/flour/rice-flour.jpg";
import roastedriceflour from "./assets/flour/roasted-rice-flour.jpg";
import soyaflour from "./assets/flour/soya-flour.jpg";
import stringhopperflour from "./assets/flour/string-hopper-flour.jpg";
import wheatflour from "./assets/flour/wheat-flour.jpg";
import whitericeflour from "./assets/flour/white-rice-flour.jpg";
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
  { id:1,  name:"Atta (Wheat) Flour", basePrice:300, cat:"Grain Flours", icon:"🍚", image: attaflour, desc:"Fine whole wheat atta flour for rotis and bread." },
  { id:2,  name:"Black Gram Flour", basePrice:320, cat:"Grain Flours", icon:"🍚", image: blackgramflour, desc:"Protein-rich black gram flour for savoury dishes." },
  { id:3,  name:"Coconut Flour", basePrice:380, cat:"Grain Flours", icon:"🍚", image: coconutflour, desc:"Gluten-free coconut flour, naturally sweet.", badge:"Organic" },
  { id:4,  name:"Corn Flour", basePrice:260, cat:"Grain Flours", icon:"🍚", image: cornflour, desc:"Fine corn flour for thickening and baking." },
  { id:5,  name:"Gram Flour (Besan)", basePrice:290, cat:"Grain Flours", icon:"🍚", image: gramflour, desc:"Chickpea gram flour, a kitchen essential.", badge:"Bestseller" },
  { id:6,  name:"Green Gram Flour", basePrice:300, cat:"Grain Flours", icon:"🍚", image: greengramflour, desc:"Mild green gram flour for pancakes and batters." },
  { id:7,  name:"Hopper Flour", basePrice:280, cat:"Ready Mix Flours", icon:"🍚", image: hopperflour, desc:"Fermented rice flour for soft, bubbly hoppers." },
  { id:8,  name:"Millet Flour", basePrice:340, cat:"Grain Flours", icon:"🍚", image: milletflour, desc:"Wholesome millet flour, naturally gluten-free." },
  { id:9,  name:"Mixed Grain Flour", basePrice:360, cat:"Grain Flours", icon:"🍚", image: mixedgrainflour, desc:"A hearty blend of five grains.", badge:"Premium" },
  { id:10,  name:"Pittu Flour", basePrice:270, cat:"Ready Mix Flours", icon:"🍚", image: pittuflour, desc:"Steamed rice flour, coconut-ready pittu mix." },
  { id:11,  name:"Rice Flour", basePrice:250, cat:"Rice Flours", icon:"🍚", image: riceflour, desc:"Everyday fine rice flour." },
  { id:12,  name:"Roasted Rice Flour", basePrice:270, cat:"Rice Flours", icon:"🍚", image: roastedriceflour, desc:"Toasted rice flour for extra aroma." },
  { id:13,  name:"Soya Flour", basePrice:310, cat:"Grain Flours", icon:"🍚", image: soyaflour, desc:"High-protein soya flour." },
  { id:14,  name:"String Hopper Flour", basePrice:280, cat:"Ready Mix Flours", icon:"🍚", image: stringhopperflour, desc:"Classic flour for soft string hoppers.", badge:"Bestseller" },
  { id:15,  name:"Wheat Flour", basePrice:290, cat:"Grain Flours", icon:"🍚", image: wheatflour, desc:"All-purpose wheat flour for baking." },
  { id:16,  name:"White Rice Flour", basePrice:260, cat:"Rice Flours", icon:"🍚", image: whitericeflour, desc:"Classic white rice flour." },
];

const CATS = [
  { name: "All", icon: "" },
  { name: "Rice Flours", icon: "" },
  { name: "Grain Flours", icon: "" },
  { name: "Ready Mix Flours", icon: "" },
];

const NOTIFS = [
  { id:1, text:"Your order #1801 is ready for pickup!", time:"2 mins ago", unread:true },
  { id:2, text:"New offer: 10% off on Wheat Flour", time:"1 hour ago", unread:true },
  { id:3, text:"Order #1790 has been delivered.", time:"Yesterday", unread:false },
];

function FlourProducts({ onBack }) {
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
  const CATEGORY = "Flour";
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
    api.getProducts("Flour").then((rows) => {
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
    <div className="fl-page">

      {/* ── NAVBAR ── */}
      <nav className="ap-navbar">
        <div className="ap-nav-left">
          <span className="ap-brand">
            MAHAJANA <span>GRINDING MILL</span>
          </span>
        </div>

        <div className="ap-nav-links">
          <span onClick={onBack}>Home</span>
          <span className="ap-nav-active">Flour</span>
          <span>Categories</span>
          <span>Contact</span>
        </div>

        <div className="ap-search-wrap">
          <span className="ap-search-icon"></span>
          <input
            className="ap-search"
            placeholder="Search flour..."
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
      <div className="fl-page-header">
        <span className="fl-spice-float f1">🌾</span>
        <span className="fl-spice-float f2">🍞</span>
        <span className="fl-spice-float f3">🥣</span>
        <span className="fl-spice-float f4">✨</span>
        <span className="fl-spice-float f5">🌿</span>
        <span className="fl-spice-float f6">🥐</span>
        <div className="fl-page-header-left">
          <div className="fl-hero-badge">Milled Fresh Daily</div>
          <h1>Flour <span>Collection</span></h1>
          <p>Traditional rice, grain & root flours — stone-milled fresh from our mill</p>
        </div>
        <div className="fl-page-header-stats">
          <div className="fl-pgstat"><b>16</b><span>Varieties</span></div>
          <div className="fl-pgstat"><b>100%</b><span>Pure</span></div>
          <div className="fl-pgstat"><b>5</b><span>Sizes</span></div>
        </div>
      </div>

      {/* ── CATEGORY CHIPS ── */}
      <div className="fl-filter-bar">
        {CATS.map(c => (
          <button
            key={c.name}
            className={`fl-filter-btn${cat === c.name ? " active" : ""}`}
            onClick={() => setCat(c.name)}
          >
            <span>{c.icon}</span> {c.name}
          </button>
        ))}
        <span className="fl-count">{filtered.length} products</span>
      </div>

      {/* ── GRID ── */}
      <div className="fl-grid-section">
        {filtered.length === 0 ? (
          <div className="fl-empty">
            <div className="fl-empty-icon"></div>
            <p>No products found for "{search}"</p>
          </div>
        ) : (
          <div className="fl-grid">
            {filtered.map((p, idx) => {
              const wtIdx = getCardWt(p.id);
              const price = getPrice(p.basePrice, wtIdx);
              return (
                <div className="fl-card" key={p.id} style={{ animationDelay: `${(idx % 10) * 0.04}s` }}>
                  <div className="fl-packet" onClick={() => openProduct(p)}>
                    <img src={p.image} alt={p.name} className="fl-product-photo" />
                    <div className="fl-photo-overlay"></div>
                  </div>

                  <button
                    className={`fl-wish-btn${wishlist.has(p.id) ? " wished" : ""}`}
                    onClick={() => toggleWish(p)}
                  >{wishlist.has(p.id) ? "❤️" : "🤍"}</button>

                  {p.badge && (
                    <div className="fl-card-badge">
                      <span className={`fl-badge-tag ${badgeClass(p.badge)}`}>{p.badge}</span>
                    </div>
                  )}

                  <div className="fl-card-body">
                    <div className="fl-card-name">{p.name}</div>
                    <div className="fl-card-cat">{p.cat}</div>

                    <div className="fl-weight-row">
                      {WEIGHTS.map((w, i) => (
                        <button
                          key={w.label}
                          className={`fl-weight-btn${wtIdx === i ? " active" : ""}`}
                          onClick={() => setCardWt(p.id, i)}
                        >{w.label}</button>
                      ))}
                    </div>

                    {getStock(p, wtIdx) !== null && (
                      <div style={{ fontSize: 11, margin: "2px 0", color: getStock(p, wtIdx) === 0 ? "#e05c4f" : getStock(p, wtIdx) < 10 ? "#f4b400" : "#8fbf8f" }}>
                        {getStock(p, wtIdx) === 0 ? "Out of stock" : `Stock: ${getStock(p, wtIdx)}`}
                      </div>
                    )}

                    <div className="fl-card-bottom">
                      <div className="fl-card-price">
                        Rs. {price} <span>/ {WEIGHTS[wtIdx].label}</span>
                      </div>
                      <button className="fl-add-btn" onClick={() => addToCart(p, wtIdx)}>
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
        <div className="fl-popup-overlay" onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className="fl-popup">
            <div className="fl-popup-photo-area">
              <img src={selected.image} alt={selected.name} className="fl-popup-photo" />
              <div className="fl-popup-photo-overlay">
                <span className="fl-popup-photo-brand">Mahajana Grinding Mill</span>
                <div className="fl-popup-photo-name">{selected.name}</div>
              </div>
            </div>

            <div className="fl-popup-body">
              <div className="fl-popup-cat">{selected.cat}</div>
              <div className="fl-popup-desc">{selected.desc}</div>

              <div className="fl-popup-section-title">Select Weight</div>
              <div className="fl-popup-weights">
                {WEIGHTS.map((w, i) => (
                  <button
                    key={w.label}
                    className={`fl-popup-wt-btn${popupWt === i ? " active" : ""}`}
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

              <div className="fl-qty-row">
                <span className="fl-qty-label">Quantity:</span>
                <div className="fl-qty-ctrl">
                  <button className="fl-qty-btn" onClick={() => setPopupQty(q => Math.max(1, q - 1))}>−</button>
                  <span className="fl-qty-num">{popupQty}</span>
                  <button
                    className="fl-qty-btn"
                    onClick={() => setPopupQty(q => {
                      const stock = getStock(selected, popupWt);
                      return stock !== null && q >= stock ? q : q + 1;
                    })}
                  >+</button>
                </div>
              </div>

              <div className="fl-popup-total">
                <span className="lbl">Total Amount</span>
                <span className="amt">Rs. {getPrice(selected.basePrice, popupWt) * popupQty}</span>
              </div>

              <div className="fl-popup-btns">
                <button className="fl-popup-cart-btn" onClick={() => addToCart(selected, popupWt, popupQty)}>
                  🛒 Add to Cart
                </button>
                <button className="fl-popup-close" onClick={() => setSelected(null)}>✕ Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── NOTIFICATIONS ── */}
      {showNotif && (
        <>
          <div style={{ position:"fixed", inset:0, zIndex:899 }} onClick={() => setShowNotif(false)} />
          <div className="fl-notif-drawer">
            <div className="fl-notif-head">
              <h4>🔔 Notifications</h4>
              <span onClick={markAllRead}>Mark all read</span>
            </div>
            {notifs.map(n => (
              <div key={n.id} className={`fl-notif-item${n.unread ? " unread" : ""}`}>
                {n.unread && <span className="fl-notif-dot"></span>}
                <div className="fl-notif-text">{n.text}</div>
                <div className="fl-notif-time">{n.time}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── WISHLIST DRAWER ── */}
      {showWish && (
        <>
          <div className="fl-cart-overlay" onClick={() => setShowWish(false)} />
          <div className="fl-wish-drawer">
            <div className="fl-wish-head">
              <h3>❤️ Wishlist ({wishCount})</h3>
              <button className="fl-wish-head-close" onClick={() => setShowWish(false)}>✕</button>
            </div>
            <div className="fl-wish-items">
              {wishProducts.length === 0 ? (
                <div className="fl-cart-empty"><div className="icon">❤️</div><p>Your wishlist is empty</p></div>
              ) : wishProducts.map(p => (
                <div className="fl-wish-item" key={p.id}>
                  <div className="fl-wish-item-photo"><img src={p.image} alt={p.name} /></div>
                  <div className="fl-wish-item-info">
                    <div className="fl-wish-item-name">{p.name}</div>
                    <div className="fl-wish-item-price">from Rs. {getPrice(p.basePrice, 0)}</div>
                  </div>
                  <button className="fl-wish-move-btn" onClick={() => wishToCart(p)}>+ Cart</button>
                  <button className="fl-wish-remove" onClick={() => toggleWish(p)}>🗑</button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── CART DRAWER ── */}
      {showCart && (
        <>
          <div className="fl-cart-overlay" onClick={() => setShowCart(false)} />
          <div className="fl-cart-drawer">
            <div className="fl-cart-head">
              <h3>🛒 Cart ({cartCount} items)</h3>
              <button className="fl-cart-head-close" onClick={() => setShowCart(false)}>✕</button>
            </div>
            <div className="fl-cart-items">
              {Object.values(cart).length === 0 ? (
                <div className="fl-cart-empty"><div className="icon">🛒</div><p>Your cart is empty</p></div>
              ) : Object.values(cart).map(item => (
                <div className="fl-cart-item" key={item.key}>
                  <div className="fl-cart-item-photo"><img src={item.image} alt={item.name} /></div>
                  <div className="fl-cart-item-info">
                    <div className="fl-cart-item-name">{item.name}</div>

                    <div className="fl-cart-weight-row">
                      {WEIGHTS.map((w, i) => (
                        <button
                          key={w.label}
                          className={`fl-cart-wt-btn${item.wtIdx === i ? " active" : ""}`}
                          onClick={() => changeCartWeight(item.key, i)}
                        >{w.label}</button>
                      ))}
                    </div>

                    <div className="fl-cart-item-price">Rs. {item.totalPrice} / pack ({item.weight})</div>

                    <div className="fl-cart-item-qty">
                      <button onClick={() => changeCartQty(item.key, -1)}>−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => incrementCartItem(item.key)}>+</button>
                    </div>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6 }}>
                    <div className="fl-cart-item-sub">Rs. {item.totalPrice * item.qty}</div>
                    <button className="fl-cart-item-remove" onClick={() => changeCartQty(item.key, -item.qty)}>✕</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="fl-cart-footer">
              <div className="fl-summary-row"><span>Subtotal</span><span>Rs. {cartTotal}</span></div>
              <div className="fl-summary-row"><span>Delivery</span><span>Rs. {cartTotal > 0 ? 150 : 0}</span></div>
              <div className="fl-summary-row total"><span>Total</span><span>Rs. {cartTotal + (cartTotal > 0 ? 150 : 0)}</span></div>
              <button
                className="fl-checkout-btn"
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
        <div className="fl-toast">
          <div className="fl-toast-dot"></div>
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}

export default FlourProducts;