const crypto = require('crypto');
const niveles = require('../data/niveles');

const OBLIGATORIOS = {
  codigo: 'Falta el código',
  nombre: 'Falta el nombre',
  descripcion: 'Falta la descripción',
  nivel: 'Falta el nivel de complejidad'
};

const COMPLEJIDADES = ['Básico', 'Intermedio', 'Avanzado', 'Certificación', 'Nivel variable'];

function limpiar(datos = {}) {
  return {
    codigo: String(datos.codigo ?? '').trim().toUpperCase(),
    nombre: String(datos.nombre ?? '').trim(),
    descripcion: String(datos.descripcion ?? '').trim(),
    nivel: String(datos.nivel ?? '').trim()
  };
}

function validar(datos) {
  const faltante = Object.keys(OBLIGATORIOS).find((campo) => datos[campo] === '');

  if (faltante) {
    return OBLIGATORIOS[faltante];
  }

  if (!/^\d+$/.test(datos.codigo)) {
    return 'El código debe ser numérico';
  }

  if (!COMPLEJIDADES.includes(datos.nivel)) {
    return 'Nivel de complejidad no válido';
  }

  return null;
}

function buscar(id) {
  return niveles.find((item) => item._id === id);
}

function listar(req, res) {
  res.json(niveles);
}

function obtener(req, res) {
  const item = buscar(req.params.id);

  if (!item) {
    return res.status(404).json({ mensaje: 'El nivel no existe' });
  }

  res.json(item);
}

function crear(req, res) {
  const datos = limpiar(req.body);
  const error = validar(datos);

  if (error) {
    return res.status(400).json({ mensaje: error });
  }

  if (niveles.some((item) => item.codigo === datos.codigo)) {
    return res.status(409).json({ mensaje: 'Ya existe un nivel con ese código' });
  }

  const item = { _id: crypto.randomUUID(), ...datos };
  niveles.push(item);

  res.status(201).json({ mensaje: 'Nivel registrado', nivel: item });
}

function actualizar(req, res) {
  const item = buscar(req.params.id);

  if (!item) {
    return res.status(404).json({ mensaje: 'El nivel no existe' });
  }

  const datos = limpiar(req.body);
  const error = validar(datos);

  if (error) {
    return res.status(400).json({ mensaje: error });
  }

  const repetido = niveles.some(
    (otro) => otro.codigo === datos.codigo && otro._id !== item._id
  );

  if (repetido) {
    return res.status(409).json({ mensaje: 'Ya existe un nivel con ese código' });
  }

  Object.assign(item, datos);

  res.json({ mensaje: 'Nivel actualizado', nivel: item });
}

function eliminar(req, res) {
  const posicion = niveles.findIndex((item) => item._id === req.params.id);

  if (posicion === -1) {
    return res.status(404).json({ mensaje: 'El nivel no existe' });
  }

  niveles.splice(posicion, 1);

  res.json({ mensaje: 'Nivel eliminado' });
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
