const express = require('express');
const router = express.Router();
const controller = require('../Controller/coffeeControllers');

router.get('/coffee', controller.getAllCoffee);

module.exports = router;
