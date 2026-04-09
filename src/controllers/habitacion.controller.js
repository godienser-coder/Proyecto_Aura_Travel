const habitacionService = require('../services/habitacion.service');

const getAll = async (req, res, next) => {
  try {
    const habitaciones = await habitacionService.getAll();
    res.status(200).json(habitaciones);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const habitacion = await habitacionService.getById(req.params.id);
    if (!habitacion) {
      return res.status(404).json({ message: 'Habitación no encontrada' });
    }
    res.status(200).json(habitacion);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById };