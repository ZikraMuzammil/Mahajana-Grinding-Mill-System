import React from "react";
import "./WelcomePage.css";
import welcomeBg from "./images/welcome.jpg";
import logo from "./images/logo.png";
import aboutImg from "./images/about.jpg";

function WelcomePage({ onShopNow, onLogin }) {

  return (

    <div
      id="home"
      className="welcome-container"
      style={{ backgroundImage: `url(${welcomeBg})` }}
    >
      {/* TOP NAVBAR */}
      <div className="navbar">
        <div className="logo-section">
          <img src={logo} alt="logo" className="logo-img" />
          MAHAJANA GRINDING MILL
        </div>

        <ul className="nav-links">
    <li onClick={() => document.getElementById("home").scrollIntoView({ behavior: "smooth" })}>Home</li>
    <li onClick={() => document.getElementById("about").scrollIntoView({ behavior: "smooth" })}>About</li>
    <li onClick={() => document.getElementById("products").scrollIntoView({ behavior: "smooth" })}>Products</li>
    <li onClick={() => document.getElementById("services").scrollIntoView({ behavior: "smooth" })}>Services</li>
    <li onClick={() => document.getElementById("contact").scrollIntoView({ behavior: "smooth" })}>Contact</li>
  </ul>

        <button className="logout-btn" onClick={onLogin}>login</button>
      </div>

      {/* WELCOME CONTENT */}


      <div className="welcome-overlay">
        <h1 className="welcome-title">
          𝒲𝑒𝓁𝒸𝑜𝓂𝑒 to <br />

          <span className="yellow-text">𝐌𝐀𝐇𝐀𝐉𝐀𝐍𝐀</span>
          <br />

          <span className="grinding-text">𝗚𝗿𝗶𝗻𝗱𝗶𝗻𝗴 𝗠𝗶𝗹𝗹</span>
        </h1>

        <div className="glow-line"></div>

        <p className="welcome-text">
          𝙂𝙧𝙞𝙣𝙙 𝙁𝙧𝙚𝙨𝙝. 𝙇𝙞𝙫𝙚 𝘽𝙚𝙩𝙩𝙚𝙧. 𝙏𝙧𝙪𝙨𝙩 𝙈𝘼𝙃𝘼𝙅𝘼𝙉𝘼.
        </p>

      <button className="view-all-btn" onClick={onShopNow}>
 Shop now
</button>
</div>

      {/* ABOUT US SECTION */}
      <section id="about" className="about">

              <div className="about-image">
                <img src={aboutImg} alt="about" />
              </div>

              <div className="about-text">
                <h2>About Us</h2>
                <p>
                 Mahajana Grinding Mill is dedicated to delivering premium quality spices, flour, rice products, and essential food items to our customers. With a strong commitment to freshness, hygiene, and customer satisfaction, we carefully process every product to ensure the highest standards of quality. Our mission is to provide trusted products that bring great taste, nutrition, and value to every home. At Mahajana, quality is not just a promise—it's our tradition.
                </p>

              </div>

            </section>


<section id="products" className="products-section">
  <h2 className="section-title">Our Products</h2>

  <div className="product-cards">

    <div className="product-card">
  <img src={require("./images/spicepowders.jpg")} alt="Spice Powders" />
  <h3>Spice Powders</h3>
  <p className="category">Category: Spices</p>
  <p className="price">Starting from Rs. 250</p>
</div>

<div className="product-card">
  <img src={require("./images/flouritems.jpg")} alt="Flour Items" />
  <h3>Flour Items</h3>
  <p className="category">Category: Flour Products</p>
  <p className="price">Starting from Rs. 180</p>
</div>

<div className="product-card">
  <img src={require("./images/herbalitems.jpg")} alt="Herbal Items" />
  <h3>Herbal Items</h3>
  <p className="category">Category: Herbal Products</p>
  <p className="price">Starting from Rs. 350</p>
</div>

<div className="product-card">
  <img src={require("./images/chaimasala.jpg")} alt="Chai Masala" />
  <h3>Chai Masala Items</h3>
  <p className="category">Category: Tea Spices</p>
  <p className="price">Starting from Rs. 300</p>
</div>

<div className="product-card">
  <img src={require("./images/grains.jpg")} alt="Grains & Pulses" />
  <h3>Grains & Pulses</h3>
  <p className="category">Category: Grains</p>
  <p className="price">Starting from Rs. 200</p>
</div>

<div className="product-card">
  <img src={require("./images/facialproducts.jpg")} alt="Facial Products" />
  <h3>Facial Products</h3>
  <p className="category">Category: Beauty Care</p>
  <p className="price">Starting from Rs. 450</p>
</div>

<div className="product-card">
  <img src={require("./images/nuts.jpg")} alt="Nuts & Seeds" />
  <h3>Nuts & Seeds</h3>
  <p className="category">Category: Healthy Foods</p>
  <p className="price">Starting from Rs. 550</p>
</div>

<div className="product-card">
  <img src={require("./images/beverages.jpg")} alt="Beverages" />
  <h3>Beverages</h3>
  <p className="category">Category: Drinks</p>
  <p className="price">Starting from Rs. 300</p>
</div>

  </div>

  <div className="view-all-container">
    <button className="view-all-btn" onClick={onShopNow}>
      View All Products
    </button>
  </div>
</section>
<section id="services" className="two-sections">

  {/* WHY CHOOSE US */}
  <div className="why-us">
    <h2 className="section-title">Why Choose Us?</h2>

    <div className="features">
      <div> Premium Quality</div>
      <div> Fast Service</div>
      <div> Hygienic Grinding</div>
       <div> Trusted Local Service</div>
    </div>
  </div>

  {/* SERVICES */}
  <div className="services-section">
    <h2 className="section-title">Our Services</h2>

    <div className="services-container">
      <div className="service-card">
        <h3> Grain Grinding</h3>
        <p>Fresh grinding for rice, wheat, and grains.</p>
      </div>

      <div className="service-card">
        <h3> Spice Grinding</h3>
        <p>Pure spice grinding with natural aroma.</p>
      </div>

      <div className="service-card">
        <h3>Packaging</h3>
        <p>Safe and hygienic packaging service.</p>
      </div>

      <div className="service-card">
        <h3>Traditional Grinding</h3>
        <p>Preserving authentic taste and texture through trusted grinding methods.</p>
      </div>
    </div>
  </div>

</section>
<section className="reviews-section">
  <h2 className="section-title">Customer Reviews</h2>

  <div className="reviews-container">

    <div className="review-card">
      <h3>⭐⭐⭐⭐⭐</h3>
      <p>
       <i>"Excellent grinding quality and fresh products. Highly recommended!</i>
      </p>
      <span>- Yoosuf</span>
    </div>

    <div className="review-card">
      <h3>⭐⭐⭐⭐⭐</h3>
      <p>
        <i>"Very clean service and friendly staff. Best grinding mill around."</i>
      </p>
      <span>- Habeebullah</span>
    </div>

    <div className="review-card">
      <h3>⭐⭐⭐⭐⭐</h3>
      <p>
       <i>"Fast delivery and top-quality products every time."</i>
      </p>
      <span>- Aathika</span>
    </div>

  </div>
</section>

    <footer id="contact" className="footer">

  <div className="footer-top">

    <div className="footer-col">
      <h3>🔗 Quick Links</h3>
      <p onClick={() => document.getElementById("home").scrollIntoView({ behavior: "smooth" })}>🏠 Home</p>
      <p onClick={() => document.getElementById("products").scrollIntoView({ behavior: "smooth" })}>🛍 Products</p>
      <p onClick={() => document.getElementById("services").scrollIntoView({ behavior: "smooth" })}>⚙ Services</p>
      <p onClick={() => document.getElementById("about").scrollIntoView({ behavior: "smooth" })}>ℹ About Us</p>
      <p onClick={() => document.getElementById("contact").scrollIntoView({ behavior: "smooth" })}>📞Contact</p>
    </div>

    <div className="footer-col">
      <h3> Services</h3>
      <p>Grain Grinding</p>
      <p>Spice Grinding</p>
      <p> Custom Orders</p>
      <p> Custom Mixing</p>
    <p> Cleaning & Sorting</p>
    </div>

    <div className="footer-col">
      <h3>📞 Contact</h3>
      <p>📍 Sri Lanka</p>
      <p>📱 +94 77 974 5588</p>
      <p>📧 info@mahajana.com</p>
      <p>📘 Facebook</p>
      <p>🕒 8AM - 6PM</p>


    </div>

  </div>

  <div className="footer-bottom">
    © 2026 MAHAJANA GRINDING MILL. All Rights Reserved.
  </div>

</footer>

    </div>
  );
}

export default WelcomePage;