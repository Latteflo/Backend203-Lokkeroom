const express = require('express');
const router = express.Router();

router.get('/:lobbyId', (req, res) => {
    res.json({ message: 'Lobby route is working!' });
  });
  

module.exports = router;
