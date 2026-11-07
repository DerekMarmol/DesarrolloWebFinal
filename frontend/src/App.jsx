import { useEffect, useState } from 'react';
import { api } from './api.js';
import Login from './components/Login.jsx';
import Panel from './components/Panel.jsx';

export default function App() {
  const [user, setUser] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Recupera la sesión existente (cookie) al recargar la página.
  useEffect(() => {
    api
      .me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setCargando(false));
  }, []);

  async function handleLogout() {
    await api.logout();
    setUser(null);
  }

  if (cargando) return <p className="centrado">Cargando…</p>;

  return (
    <>
      <header className="cabecera">
        <h1>Incidencias de laboratorio</h1>
        {user && (
          <div className="usuario">
            <span>{user.nombre}</span>
            <span className={`rol rol-${user.rol}`}>{user.rol === 'tecnico' ? 'Técnico' : 'Usuario'}</span>
            <button className="secundario" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        )}
      </header>
      <main>{user ? <Panel user={user} onSesionExpirada={() => setUser(null)} /> : <Login onLogin={setUser} />}</main>
    </>
  );
}
