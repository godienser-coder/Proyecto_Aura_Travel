const express = require('express');
const router = express.Router();
const serviciosController = require('../controllers/servicios.controller');

router.get('/', serviciosController.getAll);
router.get('/:id', serviciosController.getById);

module.exports = router;