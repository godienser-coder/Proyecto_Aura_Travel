const express = require('express');
const path = require('path');
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Redirigir raíz al login
app.get('/', (req, res) => {
  res.redirect('/page/index.html');
});

// Importar rutas
const authRoutes = require('./routes/auth.routes');
const reservationRoutes = require('./routes/reservation.routes');
const habitacionRoutes = require('./routes/habitacion.routes');
const serviciosRoutes = require('./routes/servicios.routes');
const paquetesRoutes = require('./routes/paquetes.routes');
const metodoPagoRoutes = require('./routes/metodopago.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const clientesRoutes = require('./routes/clientes.routes');
const estadosReservaRoutes = require('./routes/estadosreserva.routes');

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/habitaciones', habitacionRoutes);
app.use('/api/servicios', serviciosRoutes);
app.use('/api/paquetes', paquetesRoutes);
app.use('/api/metodopago', metodoPagoRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/estadosreserva', estadosReservaRoutes);

// Manejo de errores (siempre al final)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message,
      status: err.status || 500
    }
  });
});

module.exports = app;