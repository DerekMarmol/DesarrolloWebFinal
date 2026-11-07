const bcrypt = require('bcryptjs');
const { sequelize, Usuario, Equipo } = require('./models');

// Datos de prueba para desarrollo.
const usuarios = [
  { username: 'ana', nombre: 'Ana Pérez', password: 'usuario123', rol: 'usuario' },
  { username: 'luis', nombre: 'Luis Gómez', password: 'usuario123', rol: 'usuario' },
  { username: 'tecnico', nombre: 'Marta Ruiz', password: 'tecnico123', rol: 'tecnico' },
];

const equipos = [
  { codigo: 'PC-01', nombre: 'PC Dell OptiPlex 7090', ubicacion: 'Laboratorio A' },
  { codigo: 'PC-02', nombre: 'PC Dell OptiPlex 7090', ubicacion: 'Laboratorio A' },
  { codigo: 'PC-03', nombre: 'PC HP ProDesk 400', ubicacion: 'Laboratorio B' },
  { codigo: 'PROY-01', nombre: 'Proyector Epson EB-X51', ubicacion: 'Laboratorio A' },
  { codigo: 'IMP-01', nombre: 'Impresora HP LaserJet M404', ubicacion: 'Laboratorio B' },
];

async function seed({ reset = false } = {}) {
  await sequelize.sync({ force: reset });

  for (const { password, ...datos } of usuarios) {
    const passwordHash = await bcrypt.hash(password, 10);
    await Usuario.findOrCreate({ where: { username: datos.username }, defaults: { ...datos, passwordHash } });
  }
  for (const equipo of equipos) {
    await Equipo.findOrCreate({ where: { codigo: equipo.codigo }, defaults: equipo });
  }
}

module.exports = seed;

if (require.main === module) {
  seed({ reset: process.argv.includes('--reset') })
    .then(() => {
      console.log('Base de datos inicializada');
      return sequelize.close();
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
