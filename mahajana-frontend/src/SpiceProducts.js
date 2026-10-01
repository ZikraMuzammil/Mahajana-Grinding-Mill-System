import React, { useState, useEffect } from "react";
import "./SpiceProducts.css";
import chili from "./assets/spices/chilli.jpg";
import roastedChili from "./assets/spices/roasted-chili.jpg";
import curry from "./assets/spices/curry.jpg";
import roastedCurry from "./assets/spices/roasted-curry.jpg";
import jaffnaCurry from "./assets/spices/jaffna-curry.jpg";
import fishCurry from "./assets/spices/fish-curry.jpg";
import meatCurry from "./assets/spices/meat-curry.jpg";
import turmeric from "./assets/spices/turmeric.jpg";
import blackPepper from "./assets/spices/black-pepper.jpg";
import whitePepper from "./assets/spices/white-pepper.jpg";
import coriander from "./assets/spices/coriander.jpg";
import cumin from "./assets/spices/cumin.jpg";
import fennel from "./assets/spices/fennel.jpg";
import fenugreek from "./assets/spices/fenugreek.jpg";
import mustard from "./assets/spices/mustard.jpg";
import cardamom from "./assets/spices/cardamom.jpg";
import clove from "./assets/spices/clove.jpg";
import cinnamon from "./assets/spices/cinnamon.jpg";
import nutmeg from "./assets/spices/nutmeg.jpg";
import ginger from "./assets/spices/ginger.jpg";
import garlic from "./assets/spices/garlic.jpg";
import tamarind from "./assets/spices/tamarind.jpg";
import goraka from "./assets/spices/moringa.jpg";
import mixed from "./assets/spices/mixed.jpg";
import biryani from "./assets/spices/biriyani.jpg";
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
  { id:1,  name:"Chili Powder", basePrice:250, cat:"Spice Powders", icon:"🌶", image: chili, desc:"Pure hot chili powder, freshly ground with traditional method. Perfect for curries and marinades.", badge:"Hot" },
  { id:2,  name:"Roasted Chili Powder", basePrice:280, cat:"Spice Powders", icon:"🌶", image: roastedChili, desc:"Smoky slow-roasted chili for deep bold flavor. A staple in authentic Sri Lankan cooking.", badge:"Popular" },
  { id:3,  name:"Curry Powder", basePrice:300, cat:"Curry Blends", icon:"🍛", image: curry, desc:"Traditional Sri Lankan curry powder blend with 12 hand-selected spices.", badge:"Best Seller" },
  { id:4,  name:"Roasted Curry Powder", basePrice:320, cat:"Curry Blends", icon:"🍛", image: roastedCurry, desc:"Deep-roasted blend for authentic Sri Lankan taste. Rich, dark and aromatic." },
  { id:5,  name:"Jaffna Curry Powder", basePrice:350, cat:"Curry Blends", icon:"🌿", image: jaffnaCurry, desc:"Authentic Jaffna-style curry powder, bold and fiery. A northern Sri Lanka classic.", badge:"Special" },
  { id:6,  name:"Fish Curry Powder", basePrice:280, cat:"Curry Blends", icon:"🐟", image: fishCurry, desc:"Special spice blend crafted specifically for Sri Lankan fish curries." },
  { id:7,  name:"Meat Curry Powder", basePrice:300, cat:"Curry Blends", icon:"🥩", image: meatCurry, desc:"Rich and spicy meat curry blend with layers of warmth and depth." },
  { id:8,  name:"Turmeric Powder", basePrice:200, cat:"Spice Powders", icon:"💛", image: turmeric, desc:"Pure golden turmeric freshly milled. Anti-inflammatory and rich in vibrant color.", badge:"Organic" },
  { id:9,  name:"Black Pepper Powder", basePrice:400, cat:"Spice Powders", icon:"⚫", image: blackPepper, desc:"Strong freshly-ground black pepper for bold flavor in any dish." },
  { id:10, name:"White Pepper Powder", basePrice:420, cat:"Spice Powders", icon:"⚪", image: whitePepper, desc:"Mild and refined white pepper, perfect for light-colored dishes and soups." },
  { id:11, name:"Coriander Powder", basePrice:220, cat:"Spice Powders", icon:"🌿", image: coriander, desc:"Fresh coriander ground to perfection. Adds earthy warmth to any dish." },
  { id:12, name:"Cumin Powder", basePrice:250, cat:"Spice Powders", icon:"🌾", image: cumin, desc:"Earthy and warm cumin powder. A must-have for rice and curry dishes." },
  { id:13, name:"Fennel Powder", basePrice:230, cat:"Spice Powders", icon:"🌱", image: fennel, desc:"Sweet and aromatic fennel powder, great for curries and digestive teas." },
  { id:14, name:"Fenugreek Powder", basePrice:240, cat:"Spice Powders", icon:"🟤", image: fenugreek, desc:"Bittersweet fenugreek powder — a key ingredient in Sri Lankan cooking." },
  { id:15, name:"Mustard Powder", basePrice:260, cat:"Spice Powders", icon:"🟡", image: mustard, desc:"Sharp and pungent mustard powder for pickles, curries and marinades." },
  { id:16, name:"Cardamom Powder", basePrice:500, cat:"Spice Powders", icon:"💚", image: cardamom, desc:"Aromatic cardamom freshly ground. Perfect for desserts, teas and biryanis.", badge:"Premium" },
  { id:17, name:"Clove Powder", basePrice:450, cat:"Spice Powders", icon:"🔴", image: clove, desc:"Intensely aromatic clove powder for rich curries and festive dishes." },
  { id:18, name:"Cinnamon Powder", basePrice:380, cat:"Spice Powders", icon:"🟠", image: cinnamon, desc:"Sweet Sri Lankan cinnamon — the finest in the world, freshly ground.", badge:"Ceylon" },
  { id:19, name:"Nutmeg Powder", basePrice:600, cat:"Spice Powders", icon:"🟤", image: nutmeg, desc:"Warm and sweet nutmeg powder. Adds depth to curries, sweets and beverages.", badge:"Premium" },
  { id:20, name:"Ginger Powder", basePrice:300, cat:"Spice Powders", icon:"🫚", image: ginger, desc:"Fresh dried ginger powder with intense heat and aroma." },
  { id:21, name:"Garlic Powder", basePrice:280, cat:"Spice Powders", icon:"🧄", image: garlic, desc:"Strong and pungent garlic powder for bold flavor in sauces and marinades." },
  { id:22, name:"Tamarind Powder", basePrice:260, cat:"Others", icon:"🟣", image: tamarind, desc:"Tangy souring agent made from pure dried tamarind." },
  { id:23, name:"Goraka Powder", basePrice:270, cat:"Others", icon:"🔵", image: goraka, desc:"Traditional Sri Lankan souring agent. Used in fish and chicken curries." },
  { id:24, name:"Mixed Spice Powder", basePrice:350, cat:"Blends", icon:"✨", image: mixed, desc:"Our special all-purpose spice mix — perfect for everyday Sri Lankan cooking.", badge:"Popular" },
  { id:25, name:"Biryani Spice Mix", basePrice:450, cat:"Blends", icon:"🍚", image: biryani, desc:"A fragrant blend of 15+ spices for the perfect Sri Lankan biryani.", badge:"Special" },
];

const CATS = [
  { name: "All", icon: "" },
  { name: "Spice Powders", icon: "" },
  { name: "Curry Blends", icon: "" },
  { name: "Blends", icon: "" },
  { name: "Others", icon: "" },
];

const NOTIFS = [
  { id:1, text:"Your order #1003 is ready for pickup!", time:"2 mins ago", unread:true },
  { id:2, text:"New offer: 10% off on Cinnamon Powder", time:"1 hour ago", unread:true },
  { id:3, text:"Order #1002 has been delivered.", time:"Yesterday", unread:false },
];

function SpiceProducts({ onBack }) {
  const [search, setSearch]           = useState("");
  const [cat, setCat]                 = useState("All");
  const [selected, setSelected]       = useState(null);
  const [popupQty, setPopupQty]       = useState(1);
  const [popupWt, setPopupWt]         = useState(2); // default 500g
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
  const CATEGORY = "Spice";
  const [wishlist, setWishlist]       = useState(new Set());
  const [showOrder, setShowOrder] = useState(false);
  const [cardWeights, setCardWeights] = useState({});
  const [showCart, setShowCart]       = useState(false);
  const [showWish, setShowWish]       = useState(false);
  const [showNotif, setShowNotif]     = useState(false);
  const [toast, setToast]             = useState("");
  const [notifs, setNotifs]           = useState(NOTIFS);
  const [liveStock, setLiveStock]     = useState({});

  const loadStock = () => {
    api.getProducts("Spice").then((rows) => {
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
    if (badge === "Hot") return "hot";
    if (badge === "Organic" || badge === "Ceylon") return "new";
    return "";
  };

  return (
    <div className="sp-page">

      {/* ── NAVBAR ── */}
      <nav className="ap-navbar">
        <div className="ap-nav-left">
          <span className="ap-brand">
            MAHAJANA <span>GRINDING MILL</span>
          </span>
        </div>

        <div className="ap-nav-links">
          <span onClick={onBack}>Home</span>
          <span className="ap-nav-active">Spices</span>
          <span>Categories</span>
          <span>Contact</span>
        </div>

        <div className="ap-search-wrap">
          <span className="ap-search-icon"></span>
          <input
            className="ap-search"
            placeholder="Search spices..."
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

      {/* ── PAGE HEADER (background image strip, no big hero) ── */}
      <div className="sp-page-header">
        <span className="sp-spice-float f1">🌶</span>
        <span className="sp-spice-float f2">🫚</span>
        <span className="sp-spice-float f3">🌿</span>
        <span className="sp-spice-float f4">🧄</span>
        <span className="sp-spice-float f5">🍃</span>
        <span className="sp-spice-float f6">⭐</span>
        <div className="sp-page-header-left">
          <div className="sp-hero-badge">Freshly Ground Daily</div>
          <h1>Spice <span>Collection</span></h1>
          <p>Freshly ground daily — straight from our mill to your kitchen</p>
        </div>
        <div className="sp-page-header-stats">
          <div className="sp-pgstat"><b>25</b><span>Varieties</span></div>
          <div className="sp-pgstat"><b>100%</b><span>Pure</span></div>
          <div className="sp-pgstat"><b>4</b><span>Sizes</span></div>
        </div>
      </div>

      {/* ── CATEGORY CHIPS ── */}
      <div className="sp-filter-bar">
        {CATS.map(c => (
          <button
            key={c.name}
            className={`sp-filter-btn${cat === c.name ? " active" : ""}`}
            onClick={() => setCat(c.name)}
          >
            <span>{c.icon}</span> {c.name}
          </button>
        ))}
        <span className="sp-count">{filtered.length} products</span>
      </div>

      {/* ── GRID ── */}
      <div className="sp-grid-section">
        {filtered.length === 0 ? (
          <div className="sp-empty">
            <div className="sp-empty-icon">🔍</div>
            <p>No products found for "{search}"</p>
          </div>
        ) : (
          <div className="sp-grid">
            {filtered.map((p, idx) => {
              const wtIdx = getCardWt(p.id);
              const price = getPrice(p.basePrice, wtIdx);
              const stockNow = getStock(p, wtIdx);
              return (
                <div className="sp-card" key={p.id} style={{ animationDelay: `${(idx % 10) * 0.04}s` }}>
                  {/* Full-box product image */}
                  <div className="sp-packet" onClick={() => openProduct(p)}>
                    <img src={p.image} alt={p.name} className="sp-product-photo" />
                    <div className="sp-photo-overlay">
                      
                    
                    </div>
                  </div>

                  <button
                    className={`sp-wish-btn${wishlist.has(p.id) ? " wished" : ""}`}
                    onClick={() => toggleWish(p)}
                  >{wishlist.has(p.id) ? "❤️" : "🤍"}</button>

                  {p.badge && (
                    <div className="sp-card-badge">
                      <span className={`sp-badge-tag ${badgeClass(p.badge)}`}>{p.badge}</span>
                    </div>
                  )}

                  <div className="sp-card-body">
                    <div className="sp-card-name">{p.name}</div>
                    <div className="sp-card-cat">{p.cat}</div>

                    <div className="sp-weight-row">
                      {WEIGHTS.map((w, i) => (
                        <button
                          key={w.label}
                          className={`sp-weight-btn${wtIdx === i ? " active" : ""}`}
                          onClick={() => setCardWt(p.id, i)}
                        >{w.label}</button>
                      ))}
                    </div>

                    {stockNow !== null && (
                      <div style={{ fontSize: 11, margin: "2px 0", color: stockNow === 0 ? "#e05c4f" : stockNow < 10 ? "#f4b400" : "#8fbf8f" }}>
                        {stockNow === 0 ? "Out of stock" : `Stock: ${stockNow}`}
                      </div>
                    )}

                    <div className="sp-card-bottom">
                      <div className="sp-card-price">
                        Rs. {price} <span>/ {WEIGHTS[wtIdx].label}</span>
                      </div>
                      <button className="sp-add-btn" onClick={() => addToCart(p, wtIdx)}>
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
        <div className="sp-popup-overlay" onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className="sp-popup">
            <div className="sp-popup-photo-area">
              <img src={selected.image} alt={selected.name} className="sp-popup-photo" />
              <div className="sp-popup-photo-overlay">
                <span className="sp-popup-photo-brand">Mahajana Grinding Mill</span>
                <div className="sp-popup-photo-name">{selected.name}</div>
              </div>
            </div>

            <div className="sp-popup-body">
              <div className="sp-popup-cat">{selected.cat}</div>
              <div className="sp-popup-desc">{selected.desc}</div>

              <div className="sp-popup-section-title">Select Weight</div>
              <div className="sp-popup-weights">
                {WEIGHTS.map((w, i) => (
                  <button
                    key={w.label}
                    className={`sp-popup-wt-btn${popupWt === i ? " active" : ""}`}
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

              <div className="sp-qty-row">
                <span className="sp-qty-label">Quantity:</span>
                <div className="sp-qty-ctrl">
                  <button className="sp-qty-btn" onClick={() => setPopupQty(q => Math.max(1, q - 1))}>−</button>
                  <span className="sp-qty-num">{popupQty}</span>
                  <button
                    className="sp-qty-btn"
                    onClick={() => setPopupQty(q => {
                      const stock = getStock(selected, popupWt);
                      return stock !== null && q >= stock ? q : q + 1;
                    })}
                  >+</button>
                </div>
              </div>

              <div className="sp-popup-total">
                <span className="lbl">Total Amount</span>
                <span className="amt">Rs. {getPrice(selected.basePrice, popupWt) * popupQty}</span>
              </div>

              <div className="sp-popup-btns">
                <button className="sp-popup-cart-btn" onClick={() => addToCart(selected, popupWt, popupQty)}>
                  🛒 Add to Cart
                </button>
                <button className="sp-popup-close" onClick={() => setSelected(null)}>✕ Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── NOTIFICATIONS ── */}
      {showNotif && (
        <>
          <div style={{ position:"fixed", inset:0, zIndex:899 }} onClick={() => setShowNotif(false)} />
          <div className="sp-notif-drawer">
            <div className="sp-notif-head">
              <h4>🔔 Notifications</h4>
              <span onClick={markAllRead}>Mark all read</span>
            </div>
            {notifs.map(n => (
              <div key={n.id} className={`sp-notif-item${n.unread ? " unread" : ""}`}>
                {n.unread && <span className="sp-notif-dot"></span>}
                <div className="sp-notif-text">{n.text}</div>
                <div className="sp-notif-time">{n.time}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── WISHLIST DRAWER ── */}
      {showWish && (
        <>
          <div className="sp-cart-overlay" onClick={() => setShowWish(false)} />
          <div className="sp-wish-drawer">
            <div className="sp-wish-head">
              <h3>❤️ Wishlist ({wishCount})</h3>
              <button className="sp-wish-head-close" onClick={() => setShowWish(false)}>✕</button>
            </div>
            <div className="sp-wish-items">
              {wishProducts.length === 0 ? (
                <div className="sp-cart-empty"><div className="icon">❤️</div><p>Your wishlist is empty</p></div>
              ) : wishProducts.map(p => (
                <div className="sp-wish-item" key={p.id}>
                  <div className="sp-wish-item-photo"><img src={p.image} alt={p.name} /></div>
                  <div className="sp-wish-item-info">
                    <div className="sp-wish-item-name">{p.name}</div>
                    <div className="sp-wish-item-price">from Rs. {getPrice(p.basePrice, 0)}</div>
                  </div>
                  <button className="sp-wish-move-btn" onClick={() => wishToCart(p)}>+ Cart</button>
                  <button className="sp-wish-remove" onClick={() => toggleWish(p)}>🗑</button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── CART DRAWER ── */}
      {showCart && (
        <>
          <div className="sp-cart-overlay" onClick={() => setShowCart(false)} />
          <div className="sp-cart-drawer">
            <div className="sp-cart-head">
              <h3>🛒 Cart ({cartCount} items)</h3>
              <button className="sp-cart-head-close" onClick={() => setShowCart(false)}>✕</button>
            </div>
            <div className="sp-cart-items">
              {Object.values(cart).length === 0 ? (
                <div className="sp-cart-empty"><div className="icon">🛒</div><p>Your cart is empty</p></div>
              ) : Object.values(cart).map(item => (
                <div className="sp-cart-item" key={item.key}>
                  <div className="sp-cart-item-photo"><img src={item.image} alt={item.name} /></div>
                  <div className="sp-cart-item-info">
                    <div className="sp-cart-item-name">{item.name}</div>

                    <div className="sp-cart-weight-row">
                      {WEIGHTS.map((w, i) => (
                        <button
                          key={w.label}
                          className={`sp-cart-wt-btn${item.wtIdx === i ? " active" : ""}`}
                          onClick={() => changeCartWeight(item.key, i)}
                        >{w.label}</button>
                      ))}
                    </div>

                    <div className="sp-cart-item-price">Rs. {item.totalPrice} / pack ({item.weight})</div>

                    <div className="sp-cart-item-qty">
                      <button onClick={() => changeCartQty(item.key, -1)}>−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => incrementCartItem(item.key)}>+</button>
                    </div>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6 }}>
                    <div className="sp-cart-item-sub">Rs. {item.totalPrice * item.qty}</div>
                    <button className="sp-cart-item-remove" onClick={() => changeCartQty(item.key, -item.qty)}>✕</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="sp-cart-footer">
              <div className="sp-summary-row"><span>Subtotal</span><span>Rs. {cartTotal}</span></div>
              <div className="sp-summary-row"><span>Delivery</span><span>Rs. {cartTotal > 0 ? 150 : 0}</span></div>
              <div className="sp-summary-row total"><span>Total</span><span>Rs. {cartTotal + (cartTotal > 0 ? 150 : 0)}</span></div>
              <button
  className="sp-checkout-btn"
  onClick={() => {
    setShowCart(false);
    setShowOrder(true);
  }}
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

    <div
      className="po-blur"
      onClick={() => setShowOrder(false)}
    />

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
        <div className="sp-toast">
          <div className="sp-toast-dot"></div>
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}

export default SpiceProducts;
