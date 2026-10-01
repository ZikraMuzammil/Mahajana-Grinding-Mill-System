import React, { useState } from "react";
import { FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";
import "./Header.css";

function Header() {

  // Cart count (for now default 0)
  const [cartCount] = useState(0);

  return (
    <header className="header">

      {/* LOGO */}
      <div className="logo">
        🌾 Mahajana Grinding Mill
      </div>

      {/* NAV LINKS */}
      <div className="nav-links">
        <span>Home</span>
        <span>Products</span>
        <span>Categories</span>
      </div>

      {/* SEARCH BOX */}
      <div className="search-box">
        <FaSearch className="search-icon" />
        <input type="text" placeholder="Search rice, flour, spices..." />
      </div>

      {/* RIGHT ICONS */}
      <div className="nav-icons">

        {/* CART */}
        <div className="icon-btn">
          <FaShoppingCart />

          {/* Show badge only if items exist */}
          {cartCount > 0 && (
            <span className="badge">{cartCount}</span>
          )}

        </div>

        {/* LOGIN */}
        <button className="login-btn">
          <FaUser />
          <span>Login</span>
        </button>

      </div>

    </header>
  );
}

export default Header;