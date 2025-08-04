const express = require('express');
const app = express();
require('dotenv').config();

const coffeeRoutes = require('./Routes/coffeeRoutes');
const foodRoutes = require('./Routes/foodRoutes');
const nonCoffeeRoutes = require('./Routes/noncoffeeRoutes');
const merchandiseRoutes = require('./Routes/merchandiseRoutes');

app.use(express.json());

app.use('/api', coffeeRoutes);
app.use('/api', foodRoutes);
app.use('/api', nonCoffeeRoutes);
app.use('/api', merchandiseRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
