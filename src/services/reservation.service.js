// services/reservation.service.js

const db = require('../config/db');

// Obtener todas las reservas
const getAllReservations = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT r.*, u.NombreUsuario, e.NombreEstadoReserva, m.NomMetodoPago,
                        p.IDPaquete, p.NombrePaquete, p.Precio AS PrecioPaquete,
                        h.IDHabitacion, h.NombreHabitacion, h.Costo AS CostoHabitacion
                 FROM reserva r
                 JOIN usuarios u ON r.UsuarioIdusuario = u.IDUsuario
                 JOIN estadosreserva e ON r.IdEstadoReserva = e.IdEstadoReserva
                 JOIN metodopago m ON r.MetodoPago = m.IdMetodoPago
                 LEFT JOIN detallereservapaquetes drp ON drp.IDReserva = r.IdReserva
                 LEFT JOIN paquetes p ON drp.IDPaquete = p.IDPaquete
                 LEFT JOIN habitacion h ON p.IDHabitacion = h.IDHabitacion`;
    db.query(sql, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

// Obtener reserva por ID
const getReservationById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT r.*, u.NombreUsuario, e.NombreEstadoReserva, m.NomMetodoPago,
                        p.IDPaquete, p.NombrePaquete, p.Precio AS PrecioPaquete,
                        h.IDHabitacion, h.NombreHabitacion, h.Costo AS CostoHabitacion
                 FROM reserva r
                 JOIN usuarios u ON r.UsuarioIdusuario = u.IDUsuario
                 JOIN estadosreserva e ON r.IdEstadoReserva = e.IdEstadoReserva
                 JOIN metodopago m ON r.MetodoPago = m.IdMetodoPago
                 LEFT JOIN detallereservapaquetes drp ON drp.IDReserva = r.IdReserva
                 LEFT JOIN paquetes p ON drp.IDPaquete = p.IDPaquete
                 LEFT JOIN habitacion h ON p.IDHabitacion = h.IDHabitacion
                 WHERE r.IdReserva = ?`;

    db.query(sql, [id], (err, results) => {
      if (err) return reject(err);
      const reservation = results[0];
      if (!reservation) return resolve(null);

      const servicioSql = `SELECT s.IDServicio, s.NombreServicio, s.Costo
                           FROM detallereservaservicio drs
                           JOIN servicios s ON drs.IDServicio = s.IDServicio
                           WHERE drs.IDReserva = ?`;

      db.query(servicioSql, [id], (err, servicioResults) => {
        if (err) return reject(err);
        resolve({ ...reservation, servicios: servicioResults || [] });
      });
    });
  });
};

// Obtener reservas por usuario
const getReservationsByUser = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT r.*, u.NombreUsuario, e.NombreEstadoReserva, m.NomMetodoPago,
                        p.IDPaquete, p.NombrePaquete, p.Precio AS PrecioPaquete,
                        h.IDHabitacion, h.NombreHabitacion, h.Costo AS CostoHabitacion
                 FROM reserva r
                 JOIN usuarios u ON r.UsuarioIdusuario = u.IDUsuario
                 JOIN estadosreserva e ON r.IdEstadoReserva = e.IdEstadoReserva
                 JOIN metodopago m ON r.MetodoPago = m.IdMetodoPago
                 LEFT JOIN detallereservapaquetes drp ON drp.IDReserva = r.IdReserva
                 LEFT JOIN paquetes p ON drp.IDPaquete = p.IDPaquete
                 LEFT JOIN habitacion h ON p.IDHabitacion = h.IDHabitacion
                 WHERE r.UsuarioIdusuario = ?`;
    db.query(sql, [userId], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

const getPackagePrice = (IDPaquete) => {
  return new Promise((resolve, reject) => {
    if (!IDPaquete) return resolve(0);
    db.query('SELECT Precio FROM paquetes WHERE IDPaquete = ?', [IDPaquete], (err, results) => {
      if (err) return reject(err);
      if (!results.length) return reject(new Error('Paquete no encontrado'));
      resolve(Number(results[0].Precio) || 0);
    });
  });
};

const getServicesPrices = (servicioIds) => {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(servicioIds) || servicioIds.length === 0) return resolve([]);
    db.query('SELECT IDServicio, Costo FROM servicios WHERE IDServicio IN (?)', [servicioIds], (err, results) => {
      if (err) return reject(err);
      resolve(results.map(r => ({ IDServicio: r.IDServicio, Costo: Number(r.Costo) || 0 })));
    });
  });
};

const insertPackageDetail = (reservaId, IDPaquete, precio) => {
  return new Promise((resolve, reject) => {
    if (!IDPaquete) return resolve();
    const data = {
      IDReserva: reservaId,
      IDPaquete,
      Cantidad: 1,
      Precio: precio,
      Estado: 1
    };
    db.query('INSERT INTO detallereservapaquetes SET ?', data, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

const insertServiceDetails = (reservaId, serviceRows) => {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(serviceRows) || serviceRows.length === 0) return resolve();
    const inserts = serviceRows.map(servicio => [reservaId, servicio.IDServicio, 1, servicio.Costo, 1]);
    db.query(
      'INSERT INTO detallereservaservicio (IDReserva, IDServicio, Cantidad, Precio, Estado) VALUES ? ',
      [inserts],
      (err) => {
        if (err) return reject(err);
        resolve();
      }
    );
  });
};

const calculateTotals = async (IDPaquete, servicioIds) => {
  const paquetePrecio = await getPackagePrice(IDPaquete);
  const servicios = await getServicesPrices(servicioIds);
  const totalServicios = servicios.reduce((sum, servicio) => sum + servicio.Costo, 0);
  const subtotal = paquetePrecio + totalServicios;
  const iva = parseFloat((subtotal * 0.19).toFixed(2));
  const total = parseFloat((subtotal + iva).toFixed(2));
  return {
    paquetePrecio,
    servicios,
    subtotal,
    iva,
    total
  };
};

// Crear nueva reserva
const createReservation = async (data) => {
  const servicioIds = Array.isArray(data.serviciosAdicionales) ? data.serviciosAdicionales : [];
  const totals = await calculateTotals(data.IDPaquete, servicioIds);
  const reservaData = {
    FechaReserva: data.FechaReserva || new Date(),
    FechaInicio: data.FechaInicio || null,
    FechaFinalizacion: data.FechaFinalizacion || null,
    SubTotal: totals.subtotal,
    Descuento: 0,
    IVA: totals.iva,
    MontoTotal: totals.total,
    MetodoPago: data.MetodoPago || null,
    IdEstadoReserva: data.IdEstadoReserva || 1,
    UsuarioIdusuario: data.UsuarioIdusuario || null
  };

  return new Promise((resolve, reject) => {
    db.beginTransaction((err) => {
      if (err) return reject(err);

      db.query('INSERT INTO reserva SET ?', reservaData, async (err, result) => {
        if (err) {
          return db.rollback(() => reject(err));
        }

        const reservaId = result.insertId;

        try {
          await insertPackageDetail(reservaId, data.IDPaquete, totals.paquetePrecio);
          await insertServiceDetails(reservaId, totals.servicios);
          db.commit((errCommit) => {
            if (errCommit) {
              return db.rollback(() => reject(errCommit));
            }
            resolve({ id: reservaId, ...reservaData });
          });
        } catch (detailError) {
          db.rollback(() => reject(detailError));
        }
      });
    });
  });
};

// Actualizar reserva
const updateReservation = async (id, data) => {
  const servicioIds = Array.isArray(data.serviciosAdicionales) ? data.serviciosAdicionales : [];
  const totals = await calculateTotals(data.IDPaquete, servicioIds);
  const reservaData = {
    FechaInicio: data.FechaInicio || null,
    FechaFinalizacion: data.FechaFinalizacion || null,
    SubTotal: totals.subtotal,
    Descuento: 0,
    IVA: totals.iva,
    MontoTotal: totals.total,
    MetodoPago: data.MetodoPago || null
  };

  return new Promise((resolve, reject) => {
    db.beginTransaction((err) => {
      if (err) return reject(err);

      db.query('UPDATE reserva SET ? WHERE IdReserva = ?', [reservaData, id], (err, result) => {
        if (err) {
          return db.rollback(() => reject(err));
        }

        if (result.affectedRows === 0) {
          return db.rollback(() => resolve(null));
        }

        db.query('DELETE FROM detallereservapaquetes WHERE IDReserva = ?', [id], (err) => {
          if (err) {
            return db.rollback(() => reject(err));
          }

          db.query('DELETE FROM detallereservaservicio WHERE IDReserva = ?', [id], async (err) => {
            if (err) {
              return db.rollback(() => reject(err));
            }

            try {
              await insertPackageDetail(id, data.IDPaquete, totals.paquetePrecio);
              await insertServiceDetails(id, totals.servicios);
              db.commit((errCommit) => {
                if (errCommit) {
                  return db.rollback(() => reject(errCommit));
                }
                resolve({ id, ...reservaData });
              });
            } catch (detailError) {
              db.rollback(() => reject(detailError));
            }
          });
        });
      });
    });
  });
};

// Eliminar reserva
const deleteReservation = (id) => {
  return new Promise((resolve, reject) => {
    const deleteServiciosSql = 'DELETE FROM detallereservaservicio WHERE IDReserva = ?';
    const deletePaquetesSql = 'DELETE FROM detallereservapaquetes WHERE IDReserva = ?';
    const deleteReservaSql = 'DELETE FROM reserva WHERE IdReserva = ?';

    db.beginTransaction((err) => {
      if (err) return reject(err);

      db.query(deleteServiciosSql, [id], (err) => {
        if (err) {
          return db.rollback(() => reject(err));
        }

        db.query(deletePaquetesSql, [id], (err) => {
          if (err) {
            return db.rollback(() => reject(err));
          }

          db.query(deleteReservaSql, [id], (err) => {
            if (err) {
              return db.rollback(() => reject(err));
            }

            db.commit((errCommit) => {
              if (errCommit) {
                return db.rollback(() => reject(errCommit));
              }
              resolve({ message: 'Reserva eliminada' });
            });
          });
        });
      });
    });
  });
};

module.exports = {
  getAllReservations,
  getReservationById,
  getReservationsByUser,
  createReservation,
  updateReservation,
  deleteReservation
};