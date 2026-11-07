const express = require('express');
const { Incidencia, Equipo, Usuario } = require('../models');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const include = [
  { model: Equipo, as: 'equipo', attributes: ['id', 'codigo', 'nombre'] },
  { model: Usuario, as: 'creadaPor', attributes: ['id', 'username', 'nombre'] },
  { model: Usuario, as: 'cerradaPor', attributes: ['id', 'username', 'nombre'] },
];

// Regla de negocio: solo quien registró la incidencia o un técnico puede cerrarla.
function puedeCerrar(user, incidencia) {
  return user.rol === 'tecnico' || incidencia.creadaPorId === user.id;
}

function serializar(user, incidencia) {
  return { ...incidencia.toJSON(), puedeCerrar: incidencia.estado === 'abierta' && puedeCerrar(user, incidencia) };
}

router.use(requireAuth);

router.get('/', async (req, res) => {
  const where = {};
  if (req.query.estado) where.estado = req.query.estado;
  if (req.query.equipoId) where.equipoId = req.query.equipoId;

  const incidencias = await Incidencia.findAll({ where, include, order: [['createdAt', 'DESC']] });
  res.json(incidencias.map((i) => serializar(req.user, i)));
});

router.post('/', async (req, res) => {
  const { equipoId, descripcion } = req.body || {};
  if (!equipoId || !descripcion || !String(descripcion).trim()) {
    return res.status(400).json({ error: 'Equipo y descripción son obligatorios' });
  }

  const equipo = await Equipo.findByPk(equipoId);
  if (!equipo) {
    return res.status(400).json({ error: 'El equipo indicado no existe' });
  }

  const creada = await Incidencia.create({
    equipoId: equipo.id,
    descripcion: String(descripcion).trim(),
    creadaPorId: req.user.id,
  });
  const incidencia = await Incidencia.findByPk(creada.id, { include });
  res.status(201).json(serializar(req.user, incidencia));
});

// La autorización del cierre se valida aquí, en el servidor, con el usuario
// y rol de la sesión; el flag `puedeCerrar` del listado es solo informativo.
router.patch('/:id/cerrar', async (req, res) => {
  const incidencia = await Incidencia.findByPk(req.params.id);
  if (!incidencia) {
    return res.status(404).json({ error: 'Incidencia no encontrada' });
  }
  if (!puedeCerrar(req.user, incidencia)) {
    return res.status(403).json({ error: 'Solo quien registró la incidencia o un técnico puede cerrarla' });
  }
  if (incidencia.estado === 'cerrada') {
    return res.status(409).json({ error: 'La incidencia ya está cerrada' });
  }

  await incidencia.update({ estado: 'cerrada', cerradaEn: new Date(), cerradaPorId: req.user.id });
  await incidencia.reload({ include });
  res.json(serializar(req.user, incidencia));
});

module.exports = router;
