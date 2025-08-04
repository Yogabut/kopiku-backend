const express = require('express');
const router = express.Router();
const controller = require('../Controller/merchandiseControllers');

router.get('/merchandise', controller.getAllMerchandise);

module.exports = router;
