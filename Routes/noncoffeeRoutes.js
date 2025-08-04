const express = require('express');
const router = express.Router();
const controller = require('../Controller/noncoffeeControllers');

router.get('/non-coffee', controller.getAllNonCoffee);
router.get('/non-coffee-sub', controller.getAllNonCoffeeSub);

module.exports = router;
