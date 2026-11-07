import { useState } from 'react';

export default function IncidenciaForm({ equipos, equipoId, onEquipoChange, onRegistrar }) {
  const [descripcion, setDescripcion] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setEnviando(true);
    const ok = await onRegistrar(descripcion.trim());
    setEnviando(false);
    if (ok) setDescripcion('');
  }

  return (
    <form className="tarjeta" onSubmit={handleSubmit}>
      <h2>Registrar incidencia</h2>
      <label>
        Equipo
        <select value={equipoId} onChange={(e) => onEquipoChange(e.target.value)} required>
          <option value="">Selecciona un equipo…</option>
          {equipos.map((eq) => (
            <option key={eq.id} value={eq.id}>
              {eq.codigo} — {eq.nombre}
            </option>
          ))}
        </select>
      </label>
      <label>
        Descripción
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={3}
          placeholder="Describe el problema del equipo"
          required
        />
      </label>
      <button type="submit" disabled={enviando || !equipoId || !descripcion.trim()}>
        {enviando ? 'Registrando…' : 'Registrar'}
      </button>
    </form>
  );
}
