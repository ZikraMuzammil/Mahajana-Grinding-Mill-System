import React from "react";
import "./SelectionPage.css";

function SelectionPage({ onCustomer, onSeller, onBack }) {
  return (
    <div className="selection-page">
       
      <h1 className="portal-title">
        Welcome to MAHAJANA GRINDING MILL
      </h1>

      <p className="portal-subtitle">
        Choose Your Portal
      </p>

      <div className="portal-container">

        {/* SELLER */}
        <div
          className="portal-card"
          onClick={(e) => {
            e.stopPropagation();
            onSeller();
          }}
        >
          <div className="portal-icon"></div>
          <h2>Seller portal</h2>
          <br></br>
          <p> Manage Orders</p>
          <p>Add Products</p>
          <p>View Reports</p>
          <p> Sales Tracking</p>
          <p> Business Growth</p>

          <button onClick={onSeller}>   Seller Login</button>
        </div>

        {/* CUSTOMER */}
        <div
          className="portal-card"
          onClick={(e) => {
            e.stopPropagation();
            onCustomer();
          }}
        >
          <div className="portal-icon"></div>
           <h2>Customer Portal</h2>
<br></br>
          <p>Browse Products</p>
         <p> Easy Shopping</p>
         <p> Save Wishlist</p>
          <p> Track Orders</p>
           <p> Special Offers</p>
          <button onClick={onCustomer}>  Customer Login</button>
        </div>
      </div>

    </div>
  );
}

export default SelectionPage;