export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function request(method, url, body) {
  const res = await fetch(`/api${url}`, {
    method,
    credentials: 'same-origin',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(res.status, data?.error || `Error ${res.status}`);
  }
  return data;
}

export const api = {
  login: (username, password) => request('POST', '/auth/login', { username, password }),
  register: (nombre, username, password) => request('POST', '/auth/register', { nombre, username, password }),
  logout: () => request('POST', '/auth/logout'),
  me: () => request('GET', '/auth/me'),
  equipos: () => request('GET', '/equipos'),
  incidencias: () => request('GET', '/incidencias'),
  crearIncidencia: (equipoId, descripcion) => request('POST', '/incidencias', { equipoId, descripcion }),
  cerrarIncidencia: (id) => request('PATCH', `/incidencias/${id}/cerrar`),
};
