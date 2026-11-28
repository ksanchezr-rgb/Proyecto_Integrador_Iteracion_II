const express = require('express');
const controlador = require('../controllers/niveles.controller');
const autenticar = require('../middlewares/autenticar');
const permitir = require('../middlewares/permitir');

const router = express.Router();

router.use(autenticar);

router.get('/', permitir('catalogos:leer'), controlador.listar);
router.get('/:id', permitir('catalogos:leer'), controlador.obtener);
router.post('/', permitir('catalogos:escribir'), controlador.crear);
router.put('/:id', permitir('catalogos:escribir'), controlador.actualizar);
router.delete('/:id', permitir('catalogos:escribir'), controlador.eliminar);

module.exports = router;
