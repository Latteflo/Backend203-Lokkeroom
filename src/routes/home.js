const ejs = require('ejs');
const express = require('express');
const path = require('path');

const router = express.Router();

router.get('/', (req, res) => {
    const title = 'Lockkeroom - Home';
    ejs.renderFile(path.join(__dirname, '../views/index.ejs'), (err, body) => {
        if (err) {
            console.error(err);
            return res.status(500).send('An error occurred trying to connect to the homepage' );
        }
        res.render('layout', { title, body });
    });
});

module.exports = router;
