# Incidencias de laboratorio

App web para registrar incidencias técnicas de los equipos de un laboratorio.

- **Backend:** Node.js + Express + Sequelize (SQLite), sesión por cookie (`express-session`).
- **Frontend:** React + Vite.

Para usar la app hay que arrancar los dos (cada uno en su terminal) y abrir http://localhost:5173.

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
| POST   | `/api/auth/register`          | `{ nombre, username, password }` → crea la cuenta (rol `usuario`) e inicia sesión |
| POST   | `/api/auth/login`             | `{ username, password }` → crea la sesión     |
| POST   | `/api/auth/logout`            | Cierra la sesión                              |
| GET    | `/api/auth/me`                | Usuario y rol de la sesión actual             |
| GET    | `/api/equipos`                | Listado de equipos                            |
| GET    | `/api/incidencias`            | Listado (filtros `?estado=` y `?equipoId=`)   |
| POST   | `/api/incidencias`            | `{ equipoId, descripcion }`                   |
| PATCH  | `/api/incidencias/:id/cerrar` | Cierra la incidencia                          |

Todas las rutas salvo `register` y `login` requieren sesión (401 si no la hay).

**Registro:** usuario de 3-30 caracteres (letras, números, `_` o `.`, se guarda en minúsculas) y
contraseña de al menos 6. Responde `409` si el usuario ya existe. El registro público siempre crea
cuentas con rol `usuario` (se ignora cualquier `rol` enviado); las cuentas de técnico se crean desde el seed.

**Regla de cierre:** solo puede cerrar una incidencia quien la registró o un usuario con rol `tecnico`.
Se comprueba en el backend con el usuario de la sesión (rol leído de la BD en cada petición);
si no se cumple responde `403`, y `409` si ya estaba cerrada.

## Frontend

```bash
cd frontend
npm install
npm run dev      # http://localhost:5173
```

Vite redirige `/api` a `http://localhost:3001` (ver `vite.config.js`), así el frontend y la API
comparten origen y la cookie de sesión se envía sin necesidad de CORS.

- **Login / registro:** el mismo formulario permite iniciar sesión o crear una cuenta («Regístrate»);
  al registrarse se inicia sesión directamente. La sesión se recupera al recargar con `/api/auth/me`.
- **Equipos:** listado lateral con el número de incidencias abiertas; al pulsar uno se selecciona en el formulario.
- **Registrar incidencia:** equipo + descripción.
- **Incidencias:** listado con filtro (todas/abiertas/cerradas). El botón «Cerrar incidencia» solo aparece
  si el backend indica `puedeCerrar` (creador o técnico); aun así, el backend vuelve a validar al cerrar.
