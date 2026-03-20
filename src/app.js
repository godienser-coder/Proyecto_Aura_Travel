const express = require('express');
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar rutas
const reservationRoutes = require('./routes/reservation.routes');
const authRoutes = require('./routes/auth.routes');

// Usar rutas
app.use('/api/reservations', reservationRoutes);
app.use('/api/auth', authRoutes);

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