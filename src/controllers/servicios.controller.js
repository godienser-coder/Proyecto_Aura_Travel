const serviciosService = require('../services/servicios.service');

const getAll = async (req, res, next) => {
  try {
    const servicios = await serviciosService.getAll();
    res.status(200).json(servicios);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const servicio = await serviciosService.getById(req.params.id);
    if (!servicio) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }
    res.status(200).json(servicio);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById };