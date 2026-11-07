import { useState } from 'react';
import { api } from '../api.js';

// Formulario único para iniciar sesión o crear una cuenta nueva.
export default function Login({ onLogin }) {
  const [modo, setModo] = useState('login');
  const [nombre, setNombre] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const esRegistro = modo === 'registro';

  function cambiarModo() {
    setModo(esRegistro ? 'login' : 'registro');
    setError('');
    setPassword('');
    setConfirmacion('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (esRegistro && password !== confirmacion) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setEnviando(true);
    try {
      const usuario = esRegistro ? await api.register(nombre, username, password) : await api.login(username, password);
      onLogin(usuario);
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="tarjeta login" onSubmit={handleSubmit}>
      <h2>{esRegistro ? 'Crear cuenta' : 'Iniciar sesión'}</h2>
      {esRegistro && (
        <label>
          Nombre completo
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="name" required />
        </label>
      )}
      <label>
        Usuario
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
          {...(esRegistro && { minLength: 3, maxLength: 30, pattern: '[A-Za-z0-9_.]+', title: 'Letras, números, "_" o "."' })}
        />
      </label>
      <label>
        Contraseña
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={esRegistro ? 'new-password' : 'current-password'}
          minLength={esRegistro ? 6 : undefined}
          required
        />
      </label>
      {esRegistro && (
        <label>
          Repite la contraseña
          <input
            type="password"
            value={confirmacion}
            onChange={(e) => setConfirmacion(e.target.value)}
            autoComplete="new-password"
            required
          />
        </label>
      )}
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={enviando}>
        {enviando ? 'Enviando…' : esRegistro ? 'Registrarme' : 'Entrar'}
      </button>
      <p className="alternar">
        {esRegistro ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
        <button type="button" className="enlace" onClick={cambiarModo}>
          {esRegistro ? 'Inicia sesión' : 'Regístrate'}
        </button>
      </p>
    </form>
  );
}
