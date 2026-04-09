const express = require('express');
const router = express.Router();
const habitacionController = require('../controllers/habitacion.controller');

router.get('/', habitacionController.getAll);
router.get('/:id', habitacionController.getById);

module.exports = router;