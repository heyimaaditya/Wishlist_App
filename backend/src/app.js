const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const productRoutes = require('./routes/productRoutes');

require('./config/firebase-admin');

const app = express();

// Middleware
app.use(cors()); 
app.use(bodyParser.json()); // Parse JSON request bodies

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/wishlists', wishlistRoutes);

app.get('/', (req, res) => {
  res.send('Shared Wishlist Backend API');
});

module.exports = app;