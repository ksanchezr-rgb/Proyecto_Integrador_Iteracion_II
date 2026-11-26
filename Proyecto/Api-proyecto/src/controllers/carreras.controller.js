// carreras.controller.js: recibe las peticiones de carreras.

const crypto = require('crypto');
const carreras = require('../data/carreras');

// Mensajes para los campos obligatorios.
const OBLIGATORIOS = {
  codigo: 'Falta el código',
  nombre: 'Falta el nombre',
  escuela: 'Falta la escuela'
};

// Revisa los datos recibidos antes de registrar una carrera.
function validar(datos) {
  const faltante = Object.keys(OBLIGATORIOS).find(
    (campo) => datos[campo] === undefined ||
               datos[campo] === null ||
               datos[campo] === ''
  );

  if (faltante) {
    return OBLIGATORIOS[faltante];
  }

  return null;
}

 // POST /api/carreras
function crear(req, res) {
  const error = validar(req.body);

  if (error) {
    return res.status(400).json({ mensaje: error });
  }

  const { codigo, nombre, escuela } = req.body;

  // Comprueba que no exista otra carrera con el mismo código.
  if (carreras.some((carrera) => carrera.codigo === codigo)) {
    return res.status(409).json({
      mensaje: 'Ya existe una carrera con ese código'
    });
  }

  // Crea la nueva carrera.
  const carrera = {
    _id: crypto.randomUUID(),
    codigo,
    nombre,
    escuela
  };

  // Guarda la carrera temporalmente.
  carreras.push(carrera);

  // Responde que el registro fue exitoso.
  res.status(201).json({
    mensaje: 'Carrera registrada',
    carrera
  });
}
module.exports = { crear };