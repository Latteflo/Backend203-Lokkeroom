const express = require("express");
const router = express.Router();
const connection = require("../../db");

// Import the authMiddleware
// const authMiddleware = require('../middleware/authMiddleware');

router.get("/dashboard-view", (req, res) => {
    res.render("dashboard");
});


router.get("/dashboard", (req, res) => {
    const userId = req.userId;
  
    connection.query("SELECT * FROM  Lobbies WHERE admin_id = ?", [userId], (error, adminLobbies) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Database error" });
      }
  
      connection.query("SELECT * FROM lobby_users WHERE user_id = ?", [userId], (error, memberLobbies) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: "Database error" });
        }
  
        res.json({
          adminLobbies: adminLobbies,
          memberLobbies: memberLobbies,
        });
      });
    });
  });
  

module.exports = router;
