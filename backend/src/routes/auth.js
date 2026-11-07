const express = require('express');
const bcrypt = require('bcryptjs');
const { Usuario } = require('../models');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña son obligatorios' });
  }

  const usuario = await Usuario.findOne({ where: { username } });
  const valido = usuario && (await bcrypt.compare(password, usuario.passwordHash));
  if (!valido) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }

  // Nuevo id de sesión tras autenticar para evitar fijación de sesión.
  req.session.regenerate((err) => {
    if (err) return res.status(500).json({ error: 'No se pudo iniciar sesión' });
    req.session.userId = usuario.id;
    req.session.rol = usuario.rol;
    res.json({ id: usuario.id, username: usuario.username, nombre: usuario.nombre, rol: usuario.rol });
  });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('sid');
    res.status(204).end();
  });
});

router.get('/me', requireAuth, (req, res) => {
  res.json(req.user);
});

module.exports = router;
