const { Usuario } = require('../models');

// Carga el usuario de la sesión desde la BD en cada petición, de modo que
// el rol que se usa para autorizar siempre es el vigente en el servidor.
async function requireAuth(req, res, next) {
  const userId = req.session.userId;
  if (!userId) {
    return res.status(401).json({ error: 'No autenticado' });
  }
  const usuario = await Usuario.findByPk(userId);
  if (!usuario) {
    req.session.destroy(() => {});
    return res.status(401).json({ error: 'Sesión inválida' });
  }
  req.user = { id: usuario.id, username: usuario.username, nombre: usuario.nombre, rol: usuario.rol };
  next();
}

module.exports = { requireAuth };
