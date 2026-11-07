import { useState } from 'react';

const FILTROS = [
  { valor: 'todas', texto: 'Todas' },
  { valor: 'abierta', texto: 'Abiertas' },
  { valor: 'cerrada', texto: 'Cerradas' },
];

const formatoFecha = (iso) => new Date(iso).toLocaleString('es', { dateStyle: 'short', timeStyle: 'short' });

export default function Incidencias({ incidencias, user, onCerrar }) {
  const [filtro, setFiltro] = useState('todas');
  const visibles = filtro === 'todas' ? incidencias : incidencias.filter((i) => i.estado === filtro);

  return (
    <div className="tarjeta">
      <div className="titulo-lista">
        <h2>Incidencias</h2>
        <div className="filtros">
          {FILTROS.map((f) => (
            <button
              key={f.valor}
              className={filtro === f.valor ? 'activo' : 'secundario'}
              onClick={() => setFiltro(f.valor)}
            >
              {f.texto}
            </button>
          ))}
        </div>
      </div>

      {visibles.length === 0 ? (
        <p className="vacio">No hay incidencias.</p>
      ) : (
        <ul className="incidencias">
          {visibles.map((i) => (
            <li key={i.id} className={`incidencia ${i.estado}`}>
              <div className="cabecera-incidencia">
                <strong>
                  #{i.id} · {i.equipo.codigo}
                </strong>
                <span className={`estado estado-${i.estado}`}>{i.estado}</span>
              </div>
              <p>{i.descripcion}</p>
              <small>
                Registrada por {i.creadaPorId === user.id ? 'ti' : i.creadaPor.nombre} el {formatoFecha(i.createdAt)}
                {i.estado === 'cerrada' && i.cerradaPor && (
                  <>
                    {' '}
                    · Cerrada por {i.cerradaPor.nombre} el {formatoFecha(i.cerradaEn)}
                  </>
                )}
              </small>
              {i.puedeCerrar && (
                <button className="cerrar" onClick={() => onCerrar(i.id)}>
                  Cerrar incidencia
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
