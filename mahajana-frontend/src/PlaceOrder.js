import React, { useState } from "react";
import "./PlaceOrder.css";
import { api } from "./api";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Your Stripe publishable key (safe to expose in frontend code)
const stripePromise = loadStripe(
  "pk_test_51TrN6xKcQ1lW693lb7Na35lma23CePEhOtcZoCUpUlCdC0bOSLGJ4zwRERbjQdmfJKmqsPte6cQtr7IBhAXVsJnL00Kw7UUKNt"
);

// The login response may name these fields differently, so accept common names.
const getUserId = (u) => u?.id ?? u?.customer_id ?? u?.customerId ?? null;
const getUserEmail = (u) => u?.email ?? u?.customer_email ?? null;

// "user" is the logged-in customer. The parent must pass it: <PlaceOrder user={user} ... />
function PlaceOrderForm({
  onBack,
  onOrderPlaced,
  onViewOrders,
  cartItems = {},
  cartTotal = 0,
  user,
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [form, setForm] = useState({
    name: user?.customer_name || "",
    phone: user?.phone || "",
    email: getUserEmail(user) || "",
    address: user?.address || "",
    city: "",
    postal: "",
    notes: "",
    delivery: "home",
    payment: "cod",
    coupon: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // called when the customer clicks OK on the success message box
  const goToOrders = () => {
    try {
      localStorage.setItem(
        "mahajana_order_success",
        JSON.stringify({ orderId: placedOrderId, at: Date.now() })
      );
    } catch {}

    setShowSuccess(false);
    if (onOrderPlaced) onOrderPlaced(placedOrderId);

    // open the customer dashboard (it will show My Orders)
    if (onViewOrders) onViewOrders();
    else onBack();
  };

  const confirmOrder = async () => {
    setError("");

    if (!form.name || !form.phone || !form.address) {
      setError("Please fill in your name, phone and address.");
      return;
    }

    const orderEmail = form.email.trim();
    if (!orderEmail) {
      setError(
        "Please enter your email address (the one you log in with) so this order shows in My Orders."
      );
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
      let paymentIntentId = null;
      let paymentStatus = "pending";

      // ---- CARD PAYMENT FLOW ----
      if (form.payment === "card") {
        if (!stripe || !elements) {
          setError("Payment form is still loading, please wait a moment.");
          setSubmitting(false);
          return;
        }

        // 1. Ask backend to create a PaymentIntent for this order total
        const intentRes = await fetch(
          "http://localhost:5000/api/payments/create-intent",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: cartTotal, email: form.email }),
          }
        );
        const intentData = await intentRes.json();

        if (!intentRes.ok) {
          setError(intentData.error || "Could not start payment.");
          setSubmitting(false);
          return;
        }

        // 2. Confirm the card payment using the CardElement
        const cardElement = elements.getElement(CardElement);
        const result = await stripe.confirmCardPayment(intentData.clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: { name: form.name, email: form.email },
          },
        });

        if (result.error) {
          setError(result.error.message);
          setSubmitting(false);
          return;
        }

        if (result.paymentIntent.status !== "succeeded") {
          setError("Payment was not completed. Please try again.");
          setSubmitting(false);
          return;
        }

        paymentIntentId = result.paymentIntent.id;
        paymentStatus = "paid";
      }

      // ---- SAVE ORDER (runs for both COD and card, after payment succeeds) ----
      const saved = await api.placeOrder({
        customerId: getUserId(user), // links the order to the logged-in account
        name: form.name,
        phone: form.phone,
        email: orderEmail,
        address: form.address,
        city: form.city,
        postal: form.postal,
        notes: form.notes,
        delivery: form.delivery,
        payment: form.payment,
        coupon: form.coupon,
        total: cartTotal,
        items,
        stripePaymentIntentId: paymentIntentId,
        paymentStatus,
      });

      // show the message box; navigation happens when the customer clicks OK
      setPlacedOrderId(saved?.orderId ?? null);
      setShowSuccess(true);
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

        <input
          name="name"
          placeholder="Full Name *"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="phone"
          placeholder="Phone Number *"
          value={form.phone}
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email Address * (same as your login email)"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="address"
          placeholder="Address *"
          value={form.address}
          onChange={handleChange}
        />
        <input
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
        />
        <input
          name="postal"
          placeholder="Postal Code"
          value={form.postal}
          onChange={handleChange}
        />
        <textarea
          name="notes"
          placeholder="Special Notes"
          value={form.notes}
          onChange={handleChange}
        ></textarea>

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
          <input
            type="radio"
            name="payment"
            value="card"
            checked={form.payment === "card"}
            onChange={handleChange}
          />{" "}
          Card Payment
        </label>
        <label>
          <input
            type="radio"
            name="payment"
            value="bank"
            checked={form.payment === "bank"}
            onChange={handleChange}
          />{" "}
          Bank Transfer
        </label>

        {/* Show the card input box only when "Card Payment" is selected */}
        {form.payment === "card" && (
          <div
            className="po-card-box"
            style={{
              border: "1px solid #ccc",
              padding: "12px",
              borderRadius: "6px",
              marginTop: "10px",
            }}
          >
            <CardElement options={{ hidePostalCode: true }} />
          </div>
        )}

        <h3>Coupon</h3>
        <div className="po-coupon">
          <input
            name="coupon"
            placeholder="Coupon Code"
            value={form.coupon}
            onChange={handleChange}
          />
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
                  {item.weight} x {item.qty}
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

        <button
          className="po-confirm"
          onClick={confirmOrder}
          disabled={submitting}
        >
          {submitting ? "Placing Order..." : "CONFIRM ORDER"}
        </button>

        <button className="po-back" onClick={onBack} disabled={submitting}>
          Back to Cart
        </button>
      </div>

      {/* SUCCESS MESSAGE BOX */}
      {showSuccess && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#141414",
              border: "1px solid #d4a017",
              borderRadius: 16,
              padding: "36px 40px",
              maxWidth: 420,
              width: "90%",
              textAlign: "center",
              color: "#fff",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.6)",
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                margin: "0 auto 18px",
                borderRadius: "50%",
                background: "#2ea043",
                color: "#fff",
                fontSize: 34,
                lineHeight: "64px",
              }}
            >
              {"\u2713"}
            </div>

            <h2 style={{ margin: "0 0 10px", color: "#f5b301" }}>
              Order Placed Successfully
            </h2>

            <p style={{ margin: "0 0 24px", color: "#ccc" }}>
              {placedOrderId
                ? `Your order MG${String(placedOrderId).padStart(3, "0")} has been received.`
                : "Your order has been received."}{" "}
              Click OK to view it in My Orders.
            </p>

            <button
              onClick={goToOrders}
              style={{
                background: "linear-gradient(135deg, #f5b301, #c98a00)",
                color: "#111",
                border: "none",
                borderRadius: 10,
                padding: "12px 46px",
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Outer wrapper - provides Stripe context to the form above
function PlaceOrder(props) {
  return (
    <Elements stripe={stripePromise}>
      <PlaceOrderForm {...props} />
    </Elements>
  );
}

export default PlaceOrder;