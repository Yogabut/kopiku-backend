const express = require('express');
const router = express.Router();
const controller = require('../Controller/foodControllers');

router.get('/food', controller.getAllFood);
router.get('/food-sub', controller.getAllFoodSub);

module.exports = router;
