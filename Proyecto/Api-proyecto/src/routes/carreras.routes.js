// carreras.routes.js: conecta las peticiones de carreras con su controlador.

const express = require('express');
const controlador = require('../controllers/carreras.controller');

const router = express.Router();

// Ruta para registrar una carrera.
router.post('/', controlador.crear);

module.exports = router;
