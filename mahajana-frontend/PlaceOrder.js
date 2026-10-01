import React, { useState } from "react";
import "./PlaceOrder.css";
import { api } from "./api";

function PlaceOrder({ onBack, onOrderPlaced, cartItems = {}, cartTotal = 0 }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    postal: "",
    notes: "",
    delivery: "home",
    payment: "cod",
    coupon: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const confirmOrder = async () => {
    setError("");

    if (!form.name || !form.phone || !form.address) {
      setError("Please fill in your name, phone and address.");
      return;
    }

    if (Object.keys(cartItems).length === 0) {
      setError("Your cart is empty.");
      return;
    }

    const items = Object.values(cartItems).map((item) => ({
      name: item.name,
      category: item.category || "General",
      weight: item.weight,
      qty: item.qty,
      unitPrice: item.totalPrice,
      lineTotal: item.totalPrice * item.qty,
    }));

    setSubmitting(true);
    try {
      await api.placeOrder({
        name: form.name,
        phone: form.phone,
        email: form.email,
        address: form.address,
        city: form.city,
        postal: form.postal,
        notes: form.notes,
        delivery: form.delivery,
        payment: form.payment,
        coupon: form.coupon,
        total: cartTotal,
        items,
      });

      alert("Order Placed Successfully ✔");
      if (onOrderPlaced) onOrderPlaced(); // e.g. clearCart() from CartContext
      onBack();
    } catch (err) {
      setError(err.message || "Could not place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="po-page">
      {/* LEFT SIDE */}
      <div className="po-left">
        <h2>Customer Information</h2>

        <input name="name" placeholder="Full Name *" onChange={handleChange} />
        <input name="phone" placeholder="Phone Number *" onChange={handleChange} />
        <input name="email" placeholder="Email Address" onChange={handleChange} />
        <input name="address" placeholder="Address *" onChange={handleChange} />
        <input name="city" placeholder="City" onChange={handleChange} />
        <input name="postal" placeholder="Postal Code" onChange={handleChange} />
        <textarea name="notes" placeholder="Special Notes" onChange={handleChange}></textarea>

        {/* DELIVERY */}
        <h3>Delivery Method</h3>
        <label>
          <input
            type="radio"
            name="delivery"
            value="home"
            checked={form.delivery === "home"}
            onChange={handleChange}
          />{" "}
          Home Delivery
        </label>

        <label>
          <input
            type="radio"
            name="delivery"
            value="pickup"
            checked={form.delivery === "pickup"}
            onChange={handleChange}
          />{" "}
          Store Pickup
        </label>

        {/* PAYMENT */}
        <h3>Payment Method</h3>

        <label>
          <input
            type="radio"
            name="payment"
            value="cod"
            checked={form.payment === "cod"}
            onChange={handleChange}
          />{" "}
          Cash on Delivery
        </label>

        <label>
          <input type="radio" name="payment" value="card" onChange={handleChange} /> Card
          Payment
        </label>

        <label>
          <input type="radio" name="payment" value="bank" onChange={handleChange} /> Bank
          Transfer
        </label>

        {/* COUPON */}
        <h3>Coupon</h3>
        <div className="po-coupon">
          <input name="coupon" placeholder="Coupon Code" onChange={handleChange} />
          <button type="button">Apply</button>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="po-right">
        <h2>Order Summary</h2>

        {Object.keys(cartItems).length === 0 ? (
          <div className="po-summary-box">
            <p>No items in cart</p>
          </div>
        ) : (
          Object.values(cartItems).map((item) => (
            <div className="po-summary-item" key={item.key}>
              <div>
                <b>{item.name}</b>
                <p>
                  {item.weight} × {item.qty}
                </p>
              </div>

              <div>Rs. {item.totalPrice * item.qty}</div>
            </div>
          ))
        )}

        <div className="po-line" />

        <div className="po-total">
          <span>Total</span>
          <b>Rs. {cartTotal}</b>
        </div>

        {error && <p className="po-error">{error}</p>}

        <button className="po-confirm" onClick={confirmOrder} disabled={submitting}>
          {submitting ? "Placing Order..." : "CONFIRM ORDER"}
        </button>

        <button className="po-back" onClick={onBack} disabled={submitting}>
          Back to Cart
        </button>
      </div>
    </div>
  );
}

export default PlaceOrder;