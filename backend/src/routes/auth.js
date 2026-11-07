const express = require('express');
const bcrypt = require('bcryptjs');
const { Usuario } = require('../models');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Inicia la sesión con un id nuevo para evitar fijación de sesión.
function iniciarSesion(req, res, usuario, status = 200) {
  req.session.regenerate((err) => {
    if (err) return res.status(500).json({ error: 'No se pudo iniciar sesión' });
    req.session.userId = usuario.id;
    req.session.rol = usuario.rol;
    res.status(status).json({ id: usuario.id, username: usuario.username, nombre: usuario.nombre, rol: usuario.rol });
  });
}

// El registro público siempre crea cuentas con rol "usuario"; el rol se
// ignora aunque venga en el body para que nadie pueda autoasignarse "tecnico".
router.post('/register', async (req, res) => {
  const username = String(req.body?.username || '').trim().toLowerCase();
  const nombre = String(req.body?.nombre || '').trim();
  const password = String(req.body?.password || '');

  if (!username || !nombre || !password) {
    return res.status(400).json({ error: 'Nombre, usuario y contraseña son obligatorios' });
  }
  if (!/^[a-z0-9_.]{3,30}$/.test(username)) {
    return res.status(400).json({ error: 'El usuario debe tener 3-30 caracteres: letras, números, "_" o "."' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
  }
  if (await Usuario.findOne({ where: { username } })) {
    return res.status(409).json({ error: 'Ese nombre de usuario ya está en uso' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const usuario = await Usuario.create({ username, nombre, passwordHash, rol: 'usuario' });
  iniciarSesion(req, res, usuario, 201);
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña son obligatorios' });
  }

  const usuario = await Usuario.findOne({ where: { username: String(username).trim().toLowerCase() } });
  const valido = usuario && (await bcrypt.compare(password, usuario.passwordHash));
  if (!valido) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }

  iniciarSesion(req, res, usuario);
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
