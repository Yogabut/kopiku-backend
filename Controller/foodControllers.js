const db = require('../Config/db');

exports.getAllFood = (req, res) => {
  const { sub_id } = req.query;

  let sql = `
    SELECT f.*, fs.food_sub_name
    FROM tb_food f
    LEFT JOIN tb_food_sub fs ON f.food_sub_id = fs.food_sub_id
  `;

  const params = [];

  if (sub_id) {
    sql += ' WHERE f.food_sub_id = ?';
    params.push(sub_id);
  }

  sql += ' ORDER BY f.food_id ASC';

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getAllFoodSub = (req, res) => {
  db.query('SELECT * FROM tb_food_sub ORDER BY food_sub_id ASC', (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};
