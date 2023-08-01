const express = require("express");
const path = require("path");
const router = express.Router();

router.get("/", (req, res) => {
	const title = "Lockkeroom - Home";
	res.render(path.join(__dirname, "../views/index"), { title });
});

module.exports = router;
