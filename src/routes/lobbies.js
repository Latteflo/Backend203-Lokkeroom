const express = require('express');
const router = express.Router();

router.get('/:lobbyId', (req, res) => {
    res.json({ message: ' lobby working' });
});


module.exports = router;
