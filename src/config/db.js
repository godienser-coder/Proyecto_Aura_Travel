const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hospedaje',
  port: 3306
});

connection.connect((error) => {
  if (error) {
    console.error('Error de conexión a MySQL:', error.message);
    console.log('Asegúrate de que MySQL esté corriendo y que la base de datos "hospedaje" exista.');
    return;
  }
  console.log('✅ Conectado exitosamente a MySQL');
});

module.exports = connection;