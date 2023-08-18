const express = require('express');
const app = express();
app.use(express.json());
const path = require('path');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const authMiddleware = require('./src/middleware/authMiddleware');

// Importing routers
const homePage = require('./src/routes/home');
const usersRouter = require('./src/routes/users');
const lobbiesRouter = require('./src/routes/lobbies');
const messagesRouter = require('./src/routes/messages');

// Defining routes
app.use('/', homePage);
app.use('/api/users', usersRouter);
app.use('/api/lobbies', authMiddleware, lobbiesRouter);
app.use('/api/messages', authMiddleware, messagesRouter);

// Port setting
const port = process.env.PORT || 3000;

// Starting the server
app.listen(port, () => {
  console.log(`We are alive on http://localhost:${port}`);
});



