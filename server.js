const express = require('express');
const app = express();
app.use(express.json());
const path = require('path');
const authMiddleware = require('./src/middleware/authMiddleware');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './src/views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

const homePage= require('./src/routes/home');
const usersRouter = require('./src/routes/users');
const dashboardRouter = require('./src/routes/dashboard');
const lobbiesRouter = require('./src/routes/lobbies');
const messagesRouter = require('./src/routes/messages');


app.use('/', homePage);
app.use('/', dashboardRouter);
app.use('/api/users', usersRouter);
app.use('/dashboard', authMiddleware, dashboardRouter);
app.use('/lobbies', authMiddleware, lobbiesRouter);
app.use('/messages', authMiddleware, messagesRouter);


const port = 3000;

app.listen(port, () => {
  console.log(`WE are aliiiveee on http://localhost:${port}`);
});

