import { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';
import Equipos from './Equipos.jsx';
import IncidenciaForm from './IncidenciaForm.jsx';
import Incidencias from './Incidencias.jsx';

export default function Panel({ user, onSesionExpirada }) {
  const [equipos, setEquipos] = useState([]);
  const [incidencias, setIncidencias] = useState([]);
  const [equipoId, setEquipoId] = useState('');
  const [error, setError] = useState('');

  const manejarError = useCallback(
    (err) => {
      if (err.status === 401) onSesionExpirada();
      else setError(err.message);
    },
    [onSesionExpirada]
  );

  useEffect(() => {
    Promise.all([api.equipos(), api.incidencias()])
      .then(([eq, inc]) => {
        setEquipos(eq);
        setIncidencias(inc);
      })
      .catch(manejarError);
  }, [manejarError]);

  async function registrar(descripcion) {
    setError('');
    try {
      const nueva = await api.crearIncidencia(Number(equipoId), descripcion);
      setIncidencias((prev) => [nueva, ...prev]);
      return true;
    } catch (err) {
      manejarError(err);
      return false;
    }
  }

  async function cerrar(id) {
    setError('');
    try {
      const cerrada = await api.cerrarIncidencia(id);
      setIncidencias((prev) => prev.map((i) => (i.id === id ? cerrada : i)));
    } catch (err) {
      manejarError(err);
    }
  }

  const abiertasPorEquipo = incidencias.reduce((acc, i) => {
    if (i.estado === 'abierta') acc[i.equipoId] = (acc[i.equipoId] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="panel">
      <aside>
        <Equipos
          equipos={equipos}
          abiertasPorEquipo={abiertasPorEquipo}
          seleccionado={equipoId}
          onSeleccionar={setEquipoId}
        />
      </aside>
      <section>
        <IncidenciaForm equipos={equipos} equipoId={equipoId} onEquipoChange={setEquipoId} onRegistrar={registrar} />
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <Incidencias incidencias={incidencias} user={user} onCerrar={cerrar} />
      </section>
    </div>
  );
}
