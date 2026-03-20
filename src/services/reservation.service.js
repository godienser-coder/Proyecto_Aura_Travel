// services/reservation.service.js

const db = require('../config/db');

// Obtener todas las reservas
const getAllReservations = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM reserva', (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

// Obtener reserva por ID
const getReservationById = (id) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM reserva WHERE id = ?', [id], (err, results) => {
      if (err) reject(err);
      else resolve(results[0]);
    });
  });
};

// Crear nueva reserva
const createReservation = (data) => {
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO reserva SET ?', data, (err, result) => {
      if (err) reject(err);
      else resolve({ id: result.insertId, ...data });
    });
  });
};

// Actualizar reserva
const updateReservation = (id, data) => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE reserva SET ? WHERE id = ?', [data, id], (err) => {
      if (err) reject(err);
      else resolve({ id, ...data });
    });
  });
};

// Eliminar reserva
const deleteReservation = (id) => {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM reserva WHERE id = ?', [id], (err) => {
      if (err) reject(err);
      else resolve({ message: 'Reserva eliminada' });
    });
  });
};

module.exports = {
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation
};