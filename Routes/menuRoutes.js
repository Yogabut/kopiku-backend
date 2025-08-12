const express = require('express');
const router = express.Router();
const menuController = require('../Controller/menuControllers'); // pastikan path benar

// Middleware logging untuk routes
router.use((req, res, next) => {
    console.log(`API Route: ${req.method} ${req.path}`);
    console.log('Body:', req.body);
    console.log('Files:', req.files);
    next();
});

// Route untuk add menu
router.post('/add-menu', (req, res, next) => {
    console.log('POST /add-menu endpoint hit');
    console.log('Request body before controller:', req.body);
    
    // Call the controller
    menuController.addMenu(req, res, next);
});

// Route untuk get menu by category (optional)
router.get('/menu/:category', menuController.getMenuByCategory);

// Test route
router.get('/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

module.exports = router;