require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("./config/db"); // MySQL connection file
const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());

/* ================= DEBUG MIDDLEWARE ================= */
app.use((req, res, next) => {
  console.log(`➡ ${req.method} ${req.url}`);
  next();
});

/* ================= TEST ROUTE ================= */
app.get("/", (req, res) => {
  res.send("🚀 Mahajana Backend Running Successfully");
});

/* ================= API ROUTES ================= */
try {
  app.use("/api/customers", require("./routes/customers"));
  app.use("/api/orders", require("./routes/orders"));
  app.use("/api/admin", require("./routes/admin"));
  app.use("/api/dashboard", require("./routes/dashboard"));
  app.use("/api/products", require("./routes/products"));  
  app.use("/api/sales", require("./routes/sales"));
  app.use("/api/payments", require("./routes/payments"));
} catch (err) {
  console.error("❌ Route loading error:", err);
}

/* ================= HANDLE 404 ================= */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* ================= GLOBAL ERROR HANDLER ================= */
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

/* ================= START SERVER ================= */
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});