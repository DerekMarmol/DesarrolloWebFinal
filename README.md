# Incidencias de laboratorio

App web para registrar incidencias técnicas de los equipos de un laboratorio.

- **Backend:** Node.js + Express + Sequelize (SQLite), sesión por cookie (`express-session`).
- **Frontend:** React.

## Backend

```bash
cd backend
npm install
npm start        # http://localhost:3001 (crea la BD y los datos de prueba si no existen)
npm run seed -- --reset   # reinicia la base de datos
```

Variables opcionales: `PORT`, `DB_PATH`, `SESSION_SECRET`, `NODE_ENV=production` (cookie `secure`).

### Usuarios de prueba

| Usuario   | Contraseña   | Rol      |
|-----------|--------------|----------|
| `ana`     | `usuario123` | usuario  |
| `luis`    | `usuario123` | usuario  |
| `tecnico` | `tecnico123` | tecnico  |

### API

| Método | Ruta                          | Descripción                                   |
|--------|-------------------------------|-----------------------------------------------|
| POST   | `/api/auth/login`             | `{ username, password }` → crea la sesión     |
| POST   | `/api/auth/logout`            | Cierra la sesión                              |
| GET    | `/api/auth/me`                | Usuario y rol de la sesión actual             |
| GET    | `/api/equipos`                | Listado de equipos                            |
| GET    | `/api/incidencias`            | Listado (filtros `?estado=` y `?equipoId=`)   |
| POST   | `/api/incidencias`            | `{ equipoId, descripcion }`                   |
| PATCH  | `/api/incidencias/:id/cerrar` | Cierra la incidencia                          |

Todas las rutas salvo `login` requieren sesión (401 si no la hay).

**Regla de cierre:** solo puede cerrar una incidencia quien la registró o un usuario con rol `tecnico`.
Se comprueba en el backend con el usuario de la sesión (rol leído de la BD en cada petición);
si no se cumple responde `403`, y `409` si ya estaba cerrada.
