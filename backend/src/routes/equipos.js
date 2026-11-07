const express = require('express');
const { Equipo } = require('../models');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  const equipos = await Equipo.findAll({ order: [['codigo', 'ASC']] });
  res.json(equipos);
});

module.exports = router;
