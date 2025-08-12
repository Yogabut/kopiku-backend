const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();

const cors = require('cors');
app.use(cors()); 


app.use(express.static(path.join(__dirname, 'public')));


const coffeeRoutes = require('./Routes/coffeeRoutes');
const foodRoutes = require('./Routes/foodRoutes');
const nonCoffeeRoutes = require('./Routes/noncoffeeRoutes');
const merchandiseRoutes = require('./Routes/merchandiseRoutes');
const menuRoutes = require('./Routes/menuRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware untuk akses gambar
app.use('/coffee_image', express.static('public/coffee_image'));
app.use('/non_coffee_image', express.static('public/non_coffee_image'));
app.use('/food_image', express.static('public/food_image'));
app.use('/merchandise_image', express.static('public/merchandise_image'));


app.use('/api', coffeeRoutes);
app.use('/api', foodRoutes);
app.use('/api', nonCoffeeRoutes);
app.use('/api', merchandiseRoutes);
app.use('/api', menuRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
