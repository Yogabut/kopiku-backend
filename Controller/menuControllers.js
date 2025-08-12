const path = require('path');
const multer = require('multer');
const fs = require('fs');
const db = require('../Config/db');

// Setup multer dengan folder dinamis sesuai kategori
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('Multer destination - req.body:', req.body);
        
        let category = req.body.category?.toLowerCase();
        let folderPath;

        switch (category) {
            case 'coffee':
                folderPath = path.join(__dirname, '../public/coffee_image');
                break;
            case 'non coffee':
                folderPath = path.join(__dirname, '../public/non_coffee_image');
                break;
            case 'food':
                folderPath = path.join(__dirname, '../public/food_image');
                break;
            case 'merchandise':
                folderPath = path.join(__dirname, '../public/merchandise_image');
                break;
            default:
                console.log('Invalid category:', category);
                return cb(new Error('Kategori tidak valid'));
        }

        console.log('Target folder path:', folderPath);

        // Pastikan folder exists
        try {
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
                console.log('Created folder:', folderPath);
            }
            cb(null, folderPath);
        } catch (error) {
            console.error('Error creating folder:', error);
            cb(error);
        }
    },
    filename: (req, file, cb) => {
        // Generate unique filename
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        console.log('Generated filename:', uniqueName);
        cb(null, uniqueName);
    }
});

const upload = multer({ 
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Check if file is an image
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('File harus berupa gambar'));
        }
    }
}).single('image');

// Helper function to get relative path for database storage
const getRelativeImagePath = (category, filename) => {
    if (!filename) return null;
    
    let folderName;
    switch (category.toLowerCase()) {
        case 'coffee':
            folderName = 'coffee_image';
            break;
        case 'non coffee':
            folderName = 'non_coffee_image';
            break;
        case 'food':
            folderName = 'food_image';
            break;
        case 'merchandise':
            folderName = 'merchandise_image';
            break;
        default:
            folderName = 'uploads';
    }
    
    return `${folderName}/${filename}`;
};

// Controller add menu
exports.addMenu = (req, res) => {
    console.log('\n=== ADD MENU CONTROLLER START ===');
    console.log('Request method:', req.method);
    console.log('Content-Type:', req.headers['content-type']);
    
    upload(req, res, (err) => {
        console.log('\n--- MULTER UPLOAD RESULT ---');
        
        if (err) {
            console.error('Multer upload error:', err);
            console.error('Error type:', err.constructor.name);
            console.error('Error code:', err.code);
            return res.status(500).json({ 
                error: err.message || 'Error uploading file',
                type: 'upload_error'
            });
        }

        try {
            console.log('Request body after multer:', req.body);
            console.log('Uploaded file info:', req.file ? {
                filename: req.file.filename,
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size,
                path: req.file.path
            } : 'No file uploaded');

            const { category, product_name, submenu, type_menu, description, price } = req.body;

            // Basic validation
            if (!category) {
                return res.status(400).json({ error: 'Category is required', type: 'validation_error' });
            }
            if (!product_name) {
                return res.status(400).json({ error: 'Product name is required', type: 'validation_error' });
            }
            if (!description) {
                return res.status(400).json({ error: 'Description is required', type: 'validation_error' });
            }
            if (!price) {
                return res.status(400).json({ error: 'Price is required', type: 'validation_error' });
            }

            // Convert price to number
            const numPrice = parseFloat(price);
            if (isNaN(numPrice) || numPrice < 0) {
                return res.status(400).json({ error: 'Invalid price format', type: 'validation_error' });
            }

            // Category-specific validation
            if ((category === 'food' || category === 'non coffee') && !submenu) {
                return res.status(400).json({ 
                    error: 'Submenu is required for food and non coffee categories',
                    type: 'validation_error'
                });
            }

            if ((category === 'coffee' || category === 'non coffee') && !type_menu) {
                return res.status(400).json({ 
                    error: 'Temperature type is required for coffee and non coffee categories',
                    type: 'validation_error'
                });
            }

            // Get the relative path for database storage
            const imagePath = req.file ? getRelativeImagePath(category, req.file.filename) : null;
            console.log('Image path for database:', imagePath);
            
            let query = '';
            let values = [];

            console.log('\n--- DATABASE OPERATION ---');
            console.log('Category:', category);

            switch (category.toLowerCase()) {
                case 'coffee':
                    // Check if coffee_id is auto_increment or needs to be provided
                    query = `INSERT INTO tb_coffee (coffee_name, coffee_type, coffee_description, coffee_price, coffee_image) VALUES (?, ?, ?, ?, ?)`;
                    values = [product_name, type_menu, description, numPrice, imagePath];
                    break;

                case 'non coffee':
                    if (submenu) {
                        query = `INSERT INTO tb_non_coffee (non_coffee_name, non_coffee_sub_id, non_coffee_type, non_coffee_description, non_coffee_price, non_coffee_image) VALUES (?, ?, ?, ?, ?, ?)`;
                        values = [product_name, submenu, type_menu, description, numPrice, imagePath];
                    } else {
                        query = `INSERT INTO tb_non_coffee (non_coffee_name, non_coffee_type, non_coffee_description, non_coffee_price, non_coffee_image) VALUES (?, ?, ?, ?, ?)`;
                        values = [product_name, type_menu, description, numPrice, imagePath];
                    }
                    break;

                case 'food':
                    if (submenu) {
                        query = `INSERT INTO tb_food (food_name, food_sub_id, food_description, food_price, food_image) VALUES (?, ?, ?, ?, ?)`;
                        values = [product_name, submenu, description, numPrice, imagePath];
                    } else {
                        query = `INSERT INTO tb_food (food_name, food_description, food_price, food_image) VALUES (?, ?, ?, ?)`;
                        values = [product_name, description, numPrice, imagePath];
                    }
                    break;

                case 'merchandise':
                    query = `INSERT INTO tb_merchandise (merchandise_name, merchandise_description, merchandise_price, merchandise_image) VALUES (?, ?, ?, ?)`;
                    values = [product_name, description, numPrice, imagePath];
                    break;

                default:
                    return res.status(400).json({ 
                        error: 'Invalid category: ' + category,
                        type: 'validation_error'
                    });
            }

            console.log('SQL Query:', query);
            console.log('Values:', values);

            // Test database connection first
            db.query('SELECT 1', (connectionErr) => {
                if (connectionErr) {
                    console.error('Database connection error:', connectionErr);
                    return res.status(500).json({ 
                        error: 'Database connection failed: ' + connectionErr.message,
                        type: 'database_connection_error'
                    });
                }

                console.log('Database connection OK, executing insert query...');

                db.query(query, values, (dbErr, result) => {
                    if (dbErr) {
                        console.error('Database insert error:', dbErr);
                        console.error('Error code:', dbErr.code);
                        console.error('Error errno:', dbErr.errno);
                        console.error('Error sqlMessage:', dbErr.sqlMessage);
                        
                        // Delete uploaded file if database insertion fails
                        if (req.file && fs.existsSync(req.file.path)) {
                            try {
                                fs.unlinkSync(req.file.path);
                                console.log('Deleted uploaded file due to database error');
                            } catch (deleteErr) {
                                console.error('Error deleting file:', deleteErr);
                            }
                        }
                        
                        return res.status(500).json({ 
                            error: 'Database error: ' + dbErr.message,
                            type: 'database_error',
                            code: dbErr.code
                        });
                    }

                    console.log('Menu added successfully!');
                    console.log('Insert ID:', result.insertId);
                    console.log('Affected rows:', result.affectedRows);
                    console.log('Image path saved to database:', imagePath);
                    
                    res.status(201).json({ 
                        message: 'Menu berhasil ditambahkan', 
                        id: result.insertId,
                        category: category,
                        product_name: product_name,
                        image_path: imagePath,
                        success: true
                    });
                    
                    console.log('=== ADD MENU CONTROLLER END ===\n');
                });
            });

        } catch (error) {
            console.error('Controller catch error:', error);
            console.error('Error stack:', error.stack);
            
            // Delete uploaded file if there's an error
            if (req.file && fs.existsSync(req.file.path)) {
                try {
                    fs.unlinkSync(req.file.path);
                    console.log('Deleted uploaded file due to controller error');
                } catch (deleteErr) {
                    console.error('Error deleting file:', deleteErr);
                }
            }
            
            res.status(500).json({ 
                error: 'Internal server error: ' + error.message,
                type: 'controller_error'
            });
        }
    });
};

// Optional: Add other menu-related controllers
exports.getMenuByCategory = (req, res) => {
    const { category } = req.params;
    let query = '';
    let tableName = '';

    switch (category.toLowerCase()) {
        case 'coffee':
            tableName = 'tb_coffee';
            query = 'SELECT * FROM tb_coffee ORDER BY coffee_name';
            break;
        case 'non coffee':
            tableName = 'tb_non_coffee';
            query = 'SELECT * FROM tb_non_coffee ORDER BY non_coffee_name';
            break;
        case 'food':
            tableName = 'tb_food';
            query = 'SELECT * FROM tb_food ORDER BY food_name';
            break;
        case 'merchandise':
            tableName = 'tb_merchandise';
            query = 'SELECT * FROM tb_merchandise ORDER BY merchandise_name';
            break;
        default:
            return res.status(400).json({ error: 'Invalid category' });
    }

    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};