const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();

const cors = require('cors');
app.use(cors()); // penting di atas routes

// ✅ Tambahkan ini untuk serve file gambar statis dari folder public
app.use(express.static(path.join(__dirname, 'public')));

// Import routes
const coffeeRoutes = require('./Routes/coffeeRoutes');
const foodRoutes = require('./Routes/foodRoutes');
const nonCoffeeRoutes = require('./Routes/noncoffeeRoutes');
const merchandiseRoutes = require('./Routes/merchandiseRoutes');

app.use(express.json());

// Gunakan routes
app.use('/api', coffeeRoutes);
app.use('/api', foodRoutes);
app.use('/api', nonCoffeeRoutes);
app.use('/api', merchandiseRoutes);

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
