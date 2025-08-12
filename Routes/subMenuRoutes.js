const express = require('express');
const router = express.Router();
const db = require('../Config/db'); // sesuaikan path koneksi db kamu

// GET submenu Food
router.get('/food-sub', (req, res) => {
  db.query('SELECT * FROM tb_food_sub', (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
});

// GET submenu Non Coffee
router.get('/non-coffee-sub', (req, res) => {
  db.query('SELECT * FROM tb_non_coffee_sub', (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
});

module.exports = router;
