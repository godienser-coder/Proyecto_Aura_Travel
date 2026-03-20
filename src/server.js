const app = require('./app');

// importar la conexión a la base de datos
require('./config/db');

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});