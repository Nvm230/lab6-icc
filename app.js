const express = require('express');
const session = require('express-session');
const methodOverride = require('method-override');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration for admin login
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret-key-123',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using https in production
}));

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

// Redirect root to dashboard if logged in, otherwise login
app.get('/', (req, res) => {
  if (req.session.admin) {
    res.redirect('/users/dashboard');
  } else {
    res.redirect('/auth/login');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
