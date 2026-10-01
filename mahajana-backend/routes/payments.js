const express = require("express");
const router = express.Router();
const db = require("../config/db");

// npm install stripe   (run this in mahajana-backend/)
// Replace with YOUR real test secret key from https://dashboard.stripe.com/test/apikeys
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
/* ============================================================
   POST /api/payments/create-intent
   Called from PlaceOrder.js right before showing the card form,
   whenever payment method = "card". Creates a Stripe PaymentIntent
   for the order total (Stripe works in cents, so amounts are * 100).
   Returns the client_secret the frontend needs to confirm payment.
============================================================ */
router.post("/create-intent", async (req, res) => {
  const { amount, email } = req.body; // amount in Rs.

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Invalid amount" });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe uses the smallest currency unit
      currency: "lkr", // Sri Lankan Rupee — change if Stripe doesn't support lkr in your account, use "lkr" for testing
      receipt_email: email || undefined,
      automatic_payment_methods: { enabled: true },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
});

/* ============================================================
   POST /api/payments/refund
   Called from the admin Orders page "Refund" button.
   Body: { orderId }
============================================================ */
router.post("/refund", async (req, res) => {
  const { orderId } = req.body;

  try {
    const [[order]] = await db.query(
      "SELECT stripe_payment_intent_id, payment_status, total FROM orders WHERE id = ?",
      [orderId]
    );

    if (!order) return res.status(404).json({ error: "Order not found" });

    if (!order.stripe_payment_intent_id) {
      return res.status(400).json({ error: "This order has no card payment to refund (likely Cash on Delivery)" });
    }

    if (order.payment_status === "refunded") {
      return res.status(400).json({ error: "This order has already been refunded" });
    }

    await stripe.refunds.create({
      payment_intent: order.stripe_payment_intent_id,
    });

    await db.query(
      "UPDATE orders SET payment_status = 'refunded', status = 'Cancelled' WHERE id = ?",
      [orderId]
    );

    res.json({ message: "Refund issued successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Refund failed" });
  }
});

module.exports = router;
