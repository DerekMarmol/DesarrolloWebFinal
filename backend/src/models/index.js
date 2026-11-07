const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const ROLES = ['usuario', 'tecnico'];
const ESTADOS = ['abierta', 'cerrada'];

const Usuario = sequelize.define('Usuario', {
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  rol: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'usuario',
    validate: { isIn: [ROLES] },
  },
});

const Equipo = sequelize.define('Equipo', {
  codigo: { type: DataTypes.STRING, allowNull: false, unique: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  ubicacion: { type: DataTypes.STRING },
});

const Incidencia = sequelize.define('Incidencia', {
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: { notEmpty: true },
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'abierta',
    validate: { isIn: [ESTADOS] },
  },
  cerradaEn: { type: DataTypes.DATE },
});

Equipo.hasMany(Incidencia, { foreignKey: { name: 'equipoId', allowNull: false } });
Incidencia.belongsTo(Equipo, { foreignKey: 'equipoId', as: 'equipo' });

Usuario.hasMany(Incidencia, { foreignKey: { name: 'creadaPorId', allowNull: false } });
Incidencia.belongsTo(Usuario, { foreignKey: 'creadaPorId', as: 'creadaPor' });

Incidencia.belongsTo(Usuario, { foreignKey: 'cerradaPorId', as: 'cerradaPor' });

module.exports = { sequelize, Usuario, Equipo, Incidencia, ROLES, ESTADOS };
