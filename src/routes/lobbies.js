const express = require("express");
const router = express.Router();
const connection = require("../../db");
const authMiddleware = require("../middleware/authMiddleware");


router.get("/lobby", authMiddleware, (req, res) => {
	// Redirect to a specific lobby, or render a lobby list page
	res.redirect("../views/lobby.ejs"); 
  });
  

// Render the lobby page for a specific lobbyId
router.get("/lobby/:lobbyId", authMiddleware,(req, res) => {
	const lobbyId = req.params.lobbyId;

	// Query the lobby details from the database
	connection.query("SELECT * FROM lobbies WHERE lobby_id = ?", [lobbyId], (error, lobbyResults) => {
		if (error) {
			console.error(error);
			return res.status(500).json({ error: "Database error" });
		}

		// Query the messages for this lobby from the database
		connection.query("SELECT * FROM messages WHERE lobby_id = ?", [lobbyId], (error, messageResults) => {
			if (error) {
				console.error(error);
				return res.status(500).json({ error: "Database error" });
			}

			// Render the lobby.ejs template and pass the lobby and messages data
			res.render("lobby", {
				lobby: lobbyResults[0],
				messages: messageResults,
			});
		});
	});
});

// Create a new lobby and set the creator as admin
router.post("/api/lobby", authMiddleware, (req, res) => {
	const userId = req.userId; // Retrieved from authMiddleware
	const { name, description } = req.body;
	connection.query(
		"INSERT INTO lobbies (name, description, admin_id) VALUES (?, ?, ?)",
		[name, description, userId],
		(error) => {
			if (error) {
				console.error(error);
				return res.status(500).json({ error: "Database error" });
			}
			res.json({ message: "Lobby has been created" });
		},
	);
});

// Add a user to a lobby (admin only)
router.post("/api/lobby/:lobbyId/add-user", authMiddleware, (req, res) => {
	const userId = req.userId;
	const lobbyId = req.params.lobbyId;
	const { addUserEmail } = req.body;

	// Check if the current user is an admin of the lobby
	connection.query("SELECT * FROM lobbies WHERE lobby_id = ? AND admin_id = ?", [lobbyId, userId], (error, results) => {
		if (error || results.length === 0) {
			return res.status(403).json({ error: "Permission denied" });
		}

		// Find the user to add by email
		connection.query("SELECT user_id FROM users WHERE email = ?", [addUserEmail], (error, userResults) => {
			if (error || userResults.length === 0) {
				return res.status(400).json({ error: "User not found" });
			}

			const addUser = userResults[0].user_id;
			// Add the user to the lobby
			connection.query("INSERT INTO lobby_users (lobby_id, user_id) VALUES (?, ?)", [lobbyId, addUser], (error) => {
				if (error) {
					console.error(error);
					return res.status(500).json({ error: "Database error" });
				}
				res.json({ message: "User has been added to the lobby" });
			});
		});
	});
});


// Remove a user from a lobby (admin only)
router.post("/api/lobby/:lobbyId/remove-user", authMiddleware, (req, res) => {
	const userId = req.userId;
	const lobbyId = req.params.lobbyId;
	const { removeUserId } = req.body;

	// Check if the current user is an admin of the lobby
	connection.query("SELECT * FROM lobbies WHERE lobby_id = ? AND admin_id = ?", [lobbyId, userId], (error, results) => {
		if (error || results.length === 0) {
			return res.status(403).json({ error: "Permission denied" });
		}

		// Remove the user from the lobby
		connection.query("DELETE FROM lobby_users WHERE lobby_id = ? AND user_id = ?", [lobbyId, removeUserId], (error) => {
			if (error) {
				console.error(error);
				return res.status(500).json({ error: "Database error" });
			}
			res.json({ message: "User has been removed from the lobby" });
		});
	});
});


module.exports = router;
