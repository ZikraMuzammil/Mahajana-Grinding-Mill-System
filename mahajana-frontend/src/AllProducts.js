import React, { useState, useEffect } from "react";
import "./AllProducts.css";
import { saveRecentlyViewed } from "./recentlyViewed";

import img1 from "./images/spicepowders.jpg";
import img2 from "./images/flouritems.jpg";
import img3 from "./images/herbalitems.jpg";
import img4 from "./images/chaimasala.jpg";
import img5 from "./images/grains.jpg";
import img6 from "./images/nuts.jpg";
import img7 from "./images/facialproducts.jpg";
import img8 from "./images/product8.jpg";
import img9 from "./images/ready-mix.jpg";
import img10 from "./images/packaging.jpg";
import img11 from "./images/coconut.jpg";
import img12 from "./images/beverages.jpg";
import img13 from "./images/bakery.jpg";
import img14 from "./images/ayurvedic.jpg";
import img15 from "./images/natural-sweet.jpg";


import logoImg from "./images/logo.png";

function AllProducts({ onBack, onSpices,onFlour,onHerbal,onChaiMasala,onGrains,onNuts,onFacial,onRice,onReadyMix,onPackaging }) {
  console.log("onSpices value:", onSpices);
  const [search, setSearch]           = useState("");
  const [cartItems, setCartItems]     = useState([]);
  const [cartOpen, setCartOpen]       = useState(false);
  const [notifOpen, setNotifOpen]     = useState(false);
  const [wishlist, setWishlist]       = useState([]);
  const [activeTab, setActiveTab]     = useState("all");
  const [loaded, setLoaded]           = useState(false);
  const [toastMsg, setToastMsg]       = useState("");

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2500);
  };

  const notifications = [
    { icon: "", text: "New offer: 10% OFF on Spice Powders!", time: "Just now" },
    { icon: "", text: "Your order #1041 has been delivered",  time: "2 hrs ago" },
    { icon: "", text: "You earned 120 loyalty points!",       time: "Yesterday" },
  ];

  const products = [
  { id:1,  img: img1,  title: "Spice Powders",   price: 250, tag: "", category: "spices",    badge: "Best Seller" },
  { id:2,  img: img2,  title: "Flour Items",      price: 350, tag: "", category: "flour",     badge: "Popular"     },
  { id:3,  img: img3,  title: "Herbal Items",     price: 450, tag: "", category: "herbal",    badge: "Organic"     },
 { id: 4, img: img4, title: "Chai Masala", price: 400, tag: "", category: "chai", badge: "Hot Pick" },
  { id:5,  img: img5,  title: "Grains & Pulses",  price: 400, tag: "", category: "grains",    badge: ""            },
  { id:6,  img: img6,  title: "Nuts & Seeds",     price: 700, tag: "", category: "nuts",      badge: "Premium"     },
  { id:7,  img: img7,  title: "Facial Products",  price: 550, tag: "", category: "beauty",    badge: "New"         },
  { id:8,  img: img8,  title: "Rice Flour",       price: 300, tag: "", category: "rice",     badge: ""            },
  { id:9,  img: img9,  title: "Ready Mix",        price: 320, tag: "", category: "readymix",  badge: "New"         },
  { id:10, img: img10, title: "Packaging",        price: 150, tag: "", category: "packaging", badge: ""            },
  { id:11, img: img11, title: "Coconut Based",    price: 480, tag: "", category: "coconut",   badge: "Popular"     },
  { id:12, img: img12, title: "Beverages",        price: 360, tag: "", category: "beverages", badge: ""            },
  { id:13, img: img13, title: "Bakery Items",     price: 290, tag: "", category: "bakery",    badge: "Fresh"       },
  { id:14, img: img14, title: "Ayurvedic",        price: 620, tag: "", category: "ayurvedic", badge: "Organic"     },
  { id:15, img: img15, title: "Natural Sweet",    price: 410, tag: "", category: "sweet",     badge: "Pure"        },
];

 

 const tabs = ["all", "spices", "flour", "herbal", "beverages", "grains", "nuts", "beauty","rice","chai", "readymix", "coconut", "bakery", "ayurvedic", "sweet", "packaging"];

  const filtered = products.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchTab    = activeTab === "all" || p.category === activeTab;
    return matchSearch && matchTab;
  });

 const addToCart = (product) => {
  setCartItems((prev) => {

    const existing = prev.find((item) => item.id === product.id);

    if (existing) {
      return prev.map((item) =>
        item.id === product.id
          ? { ...item, qty: item.qty + 1 }
          : item
      );
    }

    return [...prev, { ...product, qty: 1 }];
  });

  showToast(`${product.title} added to cart`);
};
const increaseQty = (id) => {
  setCartItems((prev) =>
    prev.map((item) =>
      item.id === id
        ? { ...item, qty: item.qty + 1 }
        : item
    )
  );
};

const decreaseQty = (id) => {
  setCartItems((prev) =>
    prev
      .map((item) =>
        item.id === id
          ? { ...item, qty: item.qty - 1 }
          : item
      )
      .filter((item) => item.qty > 0)
  );
};


  const removeFromCart = (id) => setCartItems(prev => prev.filter(i => i.id !== id));

  const toggleWishlist = (product) => {
    setWishlist(prev =>
      prev.find(i => i.id === product.id)
        ? prev.filter(i => i.id !== product.id)
        : [...prev, product]
    );
    showToast(wishlist.find(i => i.id === product.id) ? "💔 Removed from wishlist" : `❤️ Added to wishlist!`);
  };

  const isWishlisted = (id) => wishlist.some(i => i.id === id);
  const cartTotal    = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount    = cartItems.reduce((s, i) => s + i.qty, 0);

  return (
    <div className={`ap-page ${loaded ? "ap-loaded" : ""}`}>

      {/* ══════════ NAVBAR ══════════ */}
      <nav className="ap-navbar">
        <div className="ap-nav-left">
          <img src={logoImg} alt="Logo" className="ap-logo-img" />
          <span className="ap-brand">MAHAJANA <span>GRINDING MILL</span></span>
        </div>

        <div className="ap-nav-links">
          <span onClick={onBack}> Home</span>
          <span className="ap-nav-active"> Categories </span>
          <span> products</span>
          <span> Contact</span>
        </div>

        {/* SEARCH */}
        <div className="ap-search-wrap">
          <span className="ap-search-icon"></span>
          <input
            className="ap-search"
            placeholder="Search spices, flour, nuts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <span className="ap-search-clear" onClick={() => setSearch("")}>✕</span>
          )}
        </div>

        <div className="ap-nav-icons">
          {/* NOTIFICATION */}
          <div className="ap-icon-btn" onClick={() => { setNotifOpen(!notifOpen); setCartOpen(false); }}>
            🔔
            <span className="ap-icon-badge">{notifications.length}</span>
          </div>

          {/* WISHLIST */}
          <div className="ap-icon-btn" onClick={() => showToast(`❤️ ${wishlist.length} items in wishlist`)}>
            ❤️
            {wishlist.length > 0 && <span className="ap-icon-badge">{wishlist.length}</span>}
          </div>

          {/* CART */}
          <div className="ap-icon-btn" onClick={() => { setCartOpen(!cartOpen); setNotifOpen(false); }}>
            🛒
            {cartCount > 0 && <span className="ap-icon-badge">{cartCount}</span>}
          </div>

          {onBack && (
            <button className="ap-back-btn" onClick={onBack}>⬅ Back</button>
          )}
        </div>
      </nav>

      {/* ══════════ NOTIFICATION DROPDOWN ══════════ */}
      {notifOpen && (
        <div className="ap-dropdown ap-notif-dropdown">
          <h4>🔔 Notifications</h4>
          {notifications.map((n, i) => (
            <div key={i} className="ap-notif-item">
              <span className="ap-notif-icon">{n.icon}</span>
              <div>
                <div className="ap-notif-text">{n.text}</div>
                <div className="ap-notif-time">{n.time}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══════════ CART DROPDOWN ══════════ */}
      {cartOpen && (
        <div className="ap-dropdown ap-cart-dropdown">
          <h4>🛒 Your Cart</h4>
          {cartItems.length === 0 ? (
            <p className="ap-cart-empty">Cart is empty</p>
          ) : (
            <>
              {cartItems.map((item) => (

<div key={item.id} className="ap-cart-item">

    <img
      src={item.img}
      alt={item.title}
      className="ap-cart-thumb"
    />

    <div className="ap-cart-info">

        <div className="ap-cart-name">
            {item.title}
        </div>

        <div className="ap-cart-price">
            Rs. {item.price}
        </div>

        <div className="qty-box">

            <button
                className="qty-btn"
                onClick={() => decreaseQty(item.id)}
            >
                −
            </button>

            <span>{item.qty}</span>

            <button
                className="qty-btn"
                onClick={() => increaseQty(item.id)}
            >
                +
            </button>

        </div>

    </div>

    <button
        className="remove-btn"
        onClick={() => removeFromCart(item.id)}
    >
        ✕
    </button>

</div>

))}
              <div className="ap-cart-total">Total: Rs. {cartTotal.toLocaleString()}</div>
              <button className="ap-checkout-btn" onClick={() => { alert(" Order placed!"); setCartItems([]); setCartOpen(false); }}>
                ✅ Checkout
              </button>
            </>
          )}
        </div>
      )}

      {/* ══════════ HERO Banner ══════════ */}
      <div className="ap-hero">
        <div className="ap-hero-text">
          <h1> Explore Our Products</h1>
          <p>Fresh, natural & premium quality from Mahajana Grinding Mill</p>
        </div>
        <div className="ap-hero-badges">
          <span> 100% Natural</span>
          <span> Fast Delivery</span>
          <span> Loyalty Points</span>
        </div>
      </div>

      

      <div className="ap-content">

        {/* ══════════ CATEGORY TABS ══════════ */}
        <div className="ap-tabs">
          {tabs.map(tab => (
            <button
              key={tab}
              className={`ap-tab ${activeTab === tab ? "ap-tab-active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* ══════════ PRODUCTS ══════════ */}
        <div className="ap-section-header">
          <h2>OUR PRODUCTS CATEGORY</h2>
          <span className="ap-count">{filtered.length} items</span>
        </div>

        {filtered.length === 0 ? (
          <div className="ap-empty">
            <div style={{ fontSize: "60px" }}></div>
            <p>No products found for "<strong>{search}</strong>"</p>
            <button onClick={() => setSearch("")}>Clear Search</button>
          </div>
        ) : (
          <div className="ap-grid">
            {filtered.map((p, i) => (
              <div
                key={p.id}
                className="ap-card"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                {p.badge && <div className="ap-badge">{p.badge}</div>}

                <div className="ap-card-img-wrap">
                  <img src={p.img} alt={p.title} className="ap-card-img" />
                  <button
                    className={`ap-wish-btn ${isWishlisted(p.id) ? "ap-wishlisted" : ""}`}
                    onClick={() => toggleWishlist(p)}
                  >
                    {isWishlisted(p.id) ? "❤️" : "🤍"}
                  </button>
                </div>

                <div className="ap-card-body">
                  <div className="ap-card-tag">{p.tag} {p.category.toUpperCase()}</div>
                  <h3 className="ap-card-title">{p.title}</h3>
                  <div className="ap-card-price">Rs. {p.price}</div>
                  <div className="ap-card-actions">

  <button
    className="ap-add-btn"
    onClick={() => addToCart(p)}
  >
    🛒 Add
  </button>

  <button
  className="category-btn"
  onClick={() => {
    saveRecentlyViewed({
      id: p.id,
      name: p.title,
      image: p.img,
      basePrice: p.price,
    });

    switch (p.category) {
        case "spices":
          onSpices && onSpices();
          break;

         case "flour":
      onFlour && onFlour();   
      break;


        case "herbal":
         onHerbal && onHerbal();
          break;

        case "chai":
          onChaiMasala && onChaiMasala();
          break;

       case "grains":
      onGrains && onGrains();
      break;

       case "nuts":
      onNuts && onNuts();
       break;

        case "beauty":
  onFacial && onFacial();
  break;

   case "rice":
  onRice && onRice();
  break;

       case "readymix":
  onReadyMix && onReadyMix();
  break;

        case "coconut":
          alert("Open Coconut Products");
          break;

        case "bakery":
          alert("Open Bakery Items");
          break;

case "beverages":
          alert("Open beverages Page");
          break;
          
        case "ayurvedic":
          alert("Open Ayurvedic Products");
          break;

        case "sweet":
          alert("Open Natural Sweet");
          break;

         case "packaging":
      onPackaging && onPackaging();
      break;

        default:
          break;
      }
    }}
  >
    👁 View
  </button>

</div>
                  </div>
                  
                </div>
             
            ))}
          </div>
        )}

       </div>

      {/* ══════════ TOAST ══════════ */}
      {toastMsg && (
        <div className="ap-toast">{toastMsg}</div>
      )}

    </div>
  );
}

export default AllProducts;