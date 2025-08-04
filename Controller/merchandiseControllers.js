const db = require('../Config/db');

exports.getAllMerchandise = (req, res) => {
  db.query('SELECT * FROM tb_merchandise ORDER BY merchandise_id ASC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
