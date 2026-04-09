const db = require('../config/db');

const getAll = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT p.*, h.NombreHabitacion, s.NombreServicio 
                 FROM paquetes p
                 JOIN habitacion h ON p.IDHabitacion = h.IDHabitacion
                 JOIN servicios s ON p.IDServicio = s.IDServicio
                 WHERE p.Estado = 1`;
    db.query(sql, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

const getById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT p.*, h.NombreHabitacion, s.NombreServicio 
                 FROM paquetes p
                 JOIN habitacion h ON p.IDHabitacion = h.IDHabitacion
                 JOIN servicios s ON p.IDServicio = s.IDServicio
                 WHERE p.IDPaquete = ?`;
    db.query(sql, [id], (err, results) => {
      if (err) reject(err);
      else resolve(results[0]);
    });
  });
};

module.exports = { getAll, getById };