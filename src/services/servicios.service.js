const db = require('../config/db');

const getAll = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM servicios WHERE Estado = 1';
    db.query(sql, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

const getById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM servicios WHERE IDServicio = ?';
    db.query(sql, [id], (err, results) => {
      if (err) reject(err);
      else resolve(results[0]);
    });
  });
};

module.exports = { getAll, getById };