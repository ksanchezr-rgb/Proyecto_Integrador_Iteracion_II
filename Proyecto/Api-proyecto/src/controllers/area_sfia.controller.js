const crypto = require('crypto');
const areas = require('../data/area_sfia');

const OBLIGATORIOS = {
  codigo: 'Falta el código',
  nombre: 'Falta el nombre'
};

function limpiar(datos = {}) {
  return {
    codigo: String(datos.codigo ?? '').trim().toUpperCase(),
    nombre: String(datos.nombre ?? '').trim(),
    descripcion: String(datos.descripcion ?? '').trim()
  };
}

function validar(datos) {
  const faltante = Object.keys(OBLIGATORIOS).find((campo) => datos[campo] === '');

  if (faltante) {
    return OBLIGATORIOS[faltante];
  }

  if (!/^[A-Z0-9-]+$/.test(datos.codigo)) {
    return 'El código solo admite letras, números y guiones';
  }

  return null;
}

function buscar(id) {
  return areas.find((item) => item._id === id);
}

function listar(req, res) {
  res.json(areas);
}

function obtener(req, res) {
  const item = buscar(req.params.id);

  if (!item) {
    return res.status(404).json({ mensaje: 'El área no existe' });
  }

  res.json(item);
}

function crear(req, res) {
  const datos = limpiar(req.body);
  const error = validar(datos);

  if (error) {
    return res.status(400).json({ mensaje: error });
  }

  if (areas.some((item) => item.codigo === datos.codigo)) {
    return res.status(409).json({ mensaje: 'Ya existe un área con ese código' });
  }

  const item = { _id: crypto.randomUUID(), ...datos };
  areas.push(item);

  res.status(201).json({ mensaje: 'Área registrada', area: item });
}

function actualizar(req, res) {
  const item = buscar(req.params.id);

  if (!item) {
    return res.status(404).json({ mensaje: 'El área no existe' });
  }

  const datos = limpiar(req.body);
  const error = validar(datos);

  if (error) {
    return res.status(400).json({ mensaje: error });
  }

  const repetido = areas.some(
    (otro) => otro.codigo === datos.codigo && otro._id !== item._id
  );

  if (repetido) {
    return res.status(409).json({ mensaje: 'Ya existe un área con ese código' });
  }

  Object.assign(item, datos);

  res.json({ mensaje: 'Área actualizada', area: item });
}

function eliminar(req, res) {
  const posicion = areas.findIndex((item) => item._id === req.params.id);

  if (posicion === -1) {
    return res.status(404).json({ mensaje: 'El área no existe' });
  }

  areas.splice(posicion, 1);

  res.json({ mensaje: 'Área eliminada' });
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
