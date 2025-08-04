const db = require('../Config/db');

exports.getAllNonCoffee = (req, res) => {
  const { sub_id } = req.query;

  let sql = `
    SELECT nc.*, ncs.non_coffee_sub_name
    FROM tb_non_coffee nc
    LEFT JOIN tb_noncoffee_sub ncs ON nc.non_coffee_sub_id = ncs.non_coffee_sub_id
  `;

  const params = [];

  if (sub_id) {
    sql += ' WHERE nc.non_coffee_sub_id = ?';
    params.push(sub_id);
  }

  sql += ' ORDER BY nc.non_coffee_id ASC';

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getAllNonCoffeeSub = (req, res) => {
  db.query('SELECT * FROM tb_noncoffee_sub ORDER BY non_coffee_sub_id ASC', (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
};
