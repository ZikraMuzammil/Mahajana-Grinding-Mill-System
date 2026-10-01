const express = require("express");
const router = express.Router();
const db = require("../config/db");

/* ============================================================
   POST /api/admin/login
   Called from LoginPage.js (seller login)
============================================================ */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT id, username FROM admins WHERE username = ? AND password = ?",
      [username, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
