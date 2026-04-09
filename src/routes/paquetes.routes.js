const express = require('express');
const router = express.Router();
const paquetesController = require('../controllers/paquetes.controller');

router.get('/', paquetesController.getAll);
router.get('/:id', paquetesController.getById);

module.exports = router;