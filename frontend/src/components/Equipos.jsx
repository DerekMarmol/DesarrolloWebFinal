export default function Equipos({ equipos, abiertasPorEquipo, seleccionado, onSeleccionar }) {
  return (
    <div className="tarjeta">
      <h2>Equipos</h2>
      <ul className="equipos">
        {equipos.map((eq) => (
          <li key={eq.id}>
            <button
              className={`equipo ${String(eq.id) === String(seleccionado) ? 'activo' : ''}`}
              onClick={() => onSeleccionar(String(eq.id))}
              title="Registrar una incidencia para este equipo"
            >
              <strong>{eq.codigo}</strong>
              <span>{eq.nombre}</span>
              <small>{eq.ubicacion}</small>
              {abiertasPorEquipo[eq.id] > 0 && (
                <span className="contador">
                  {abiertasPorEquipo[eq.id]} {abiertasPorEquipo[eq.id] === 1 ? 'abierta' : 'abiertas'}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
