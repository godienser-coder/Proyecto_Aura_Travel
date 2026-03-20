const db = require('../config/db');

const login = (NombreUsuario, Contrasena) => {
  return new Promise((resolve, reject) => {

    const sql = 'SELECT * FROM usuarios WHERE NombreUsuario = ? AND Contrasena = ?';

    db.query(sql, [NombreUsuario, Contrasena], (err, results) => {
      if (err) reject(err);
      else resolve(results[0]);
    });

  });
};

module.exports = {
  login
};