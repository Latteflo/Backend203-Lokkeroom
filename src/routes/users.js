const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const connection = require("../../db");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const JWT_SECRET = process.env.JWT_SECRET;
const sign = promisify(jwt.sign);

// Register endpoint
router.post("/register", async (req, res) => {
  const { email, password, confirmEmail, confirmPassword } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  if (email !== confirmEmail) {
    return res.status(400).json({ error: "Emails do not match" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  connection.query("INSERT INTO Users (email, password) VALUES (?, ?)", [email, hashedPassword], (error) => {
    if (error && error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Email already in use" });
    } else if (error) {
      console.error(error);
      return res.status(500).json({ error: "Database error", details: error });
    }
    res.json({ message: "User has been created" });
  });
});

// Login endpoint
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  connection.query("SELECT * FROM Users WHERE email = ?", [email], async (error, results) => {
    if (error || results.length === 0) {
      return res.status(401).json({ error: "Invalid login credentials" });
    }
    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      sign({ userId: user.user_id }, JWT_SECRET, { expiresIn: "1h" })
        .then((token) => res.json({ success: true, token, message: "Login successful" }))
        .catch(() => res.status(500).json({ error: "Token generation failed" }));
    } else {
      res.status(401).json({ error: "Invalid login credentials" });
    }
  });
});

module.exports = router;
