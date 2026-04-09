const app = require('./app');

// importar la conexión a la base de datos
require('./config/db');

const port = 3000;

// Función para liberar el puerto si está ocupado
function killPortProcess(port) {
  return new Promise((resolve) => {
    const { exec } = require('child_process');
    exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
      if (stdout) {
        const lines = stdout.split('\n');
        for (const line of lines) {
          if (line.includes(`:${port}`) && line.includes('LISTENING')) {
            const parts = line.trim().split(/\s+/);
            const pid = parts[parts.length - 1];
            if (pid && pid !== '0') {
              exec(`taskkill /PID ${pid} /F`, () => {
                console.log(`🔄 Terminado proceso ${pid} que usaba el puerto ${port}`);
                setTimeout(resolve, 1000); // Esperar 1 segundo
              });
              return;
            }
          }
        }
      }
      resolve();
    });
  });
}

// Intentar liberar el puerto y luego iniciar el servidor
killPortProcess(port).then(() => {
  app.listen(port, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${port}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Puerto ${port} sigue ocupado después de intentar liberarlo`);
      console.log('Intenta ejecutar manualmente:');
      console.log('netstat -ano | findstr :3000');
      console.log('taskkill /PID <PID> /F');
    } else {
      console.error('❌ Error al iniciar servidor:', err.message);
    }
    process.exit(1);
  });
});