const express = require("express");
const router = express.Router();
const connection = require("../../db");

const authMiddleware = require("../middleware/authMiddleware");

// Render the messages page for a specific lobby
router.get("/lobby/:lobbyId/messages", authMiddleware, (req, res) => {
	const lobbyId = req.params.lobbyId;

	// Query the messages for this lobby from the database
	connection.query("SELECT * FROM Messages WHERE lobby_id = ?", [lobbyId], (error, messageResults) => {
		if (error) {
			console.error(error);
			return res.status(500).json({ error: "Database error" });
		}

		// Render the messages.ejs template and pass the messages data
		res.json({
			messages: messageResults,
		});
	});
});

// Post a message to a specific lobby
router.post("/lobby/:lobbyId/messages", authMiddleware, (req, res) => {
	const userId = req.userId;
	const lobbyId = req.params.lobbyId;
	const { content } = req.body;
	connection.query(
		"INSERT INTO Messages (content, user_id, lobby_id) VALUES (?, ?, ?)",
		[content, userId, lobbyId],
		(error) => {
			if (error) {
				console.error(error);
				return res.status(500).json({ error: "Database error" });
			}
			res.json({ message: "Message has been posted" });
		},
	);
});

// Edit a message (users can only edit their own messages, unless they are admins)
router.patch("/messages/:messageId", authMiddleware, (req, res) => {
	const userId = req.userId;
	const messageId = req.params.messageId;
	const { content } = req.body;

	// Query to find the message and verify the user's permission
	connection.query(
		"SELECT * FROM Messages m LEFT JOIN admins a ON m.lobby_id = a.lobby_id WHERE m.message_id = ? AND (m.user_id = ? OR a.user_id = ?)",
		[messageId, userId, userId],
		(error, results) => {
			if (error || results.length === 0) {
				return res.status(403).json({ error: "Permission denied" });
			}
			// Update the message content
			connection.query("UPDATE Messages SET content = ? WHERE message_id = ?", [content, messageId], (error) => {
				if (error) {
					console.error(error);
					return res.status(500).json({ error: "Database error" });
				}
				res.json({ message: "Message has been edited" });
			});
		},
	);
});

// Delete a message (users can only delete their own messages, unless they are admins)
router.delete("/messages/:messageId", authMiddleware, (req, res) => {
	const userId = req.userId;
	const messageId = req.params.messageId;
	const { content } = req.body;

	// Query to find the message and verify the user's permission
	connection.query(
		"SELECT * FROM Messages m LEFT JOIN admins a ON m.lobby_id = a.lobby_id WHERE m.message_id = ? AND (m.user_id = ? OR a.user_id = ?)",
		[messageId, userId, userId],
		(error, results) => {
			if (error || results.length === 0) {
				return res.status(403).json({ error: "Permission denied" });
			}
			// Update the message content
			connection.query("UPDATE Messages SET content = ? WHERE message_id = ?", [content, messageId], (error) => {
				if (error) {
					console.error(error);
					return res.status(500).json({ error: "Database error" });
				}
				res.json({ message: "Message has been edited" });
			});
		},
	);
});

module.exports = router;
