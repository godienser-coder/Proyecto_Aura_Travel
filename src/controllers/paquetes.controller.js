const paquetesService = require('../services/paquetes.service');

const getAll = async (req, res, next) => {
  try {
    const paquetes = await paquetesService.getAll();
    res.status(200).json(paquetes);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const paquete = await paquetesService.getById(req.params.id);
    if (!paquete) {
      return res.status(404).json({ message: 'Paquete no encontrado' });
    }
    res.status(200).json(paquete);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById };