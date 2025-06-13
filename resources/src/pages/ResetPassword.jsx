import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../styles/ForgotPassword.css'

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const correo = searchParams.get('correo');

  const [contraseña, setContraseña] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setMensaje('');
  setError('');

  if (contraseña !== confirmacion) {
    setError('Las contraseñas no coinciden.');
    return;
  }

  try {
    const res = await fetch('http://localhost:8000/api/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        correo,
        contraseña,
        contraseña_confirmation: confirmacion,
      }),
    });

    const data = await res.json();

    if (res.json === 201) {
        alert("Usuario creado exitosamente");
        window.location.href = "/login";
      } else if (res.json === 400 || res.json === 422) {
        setMensaje = "Error en los datos:\n";
        {/*const err = result.errors || {};*/}

    } else {
      setError(data.message || '❌ Ocurrió un error.');
    }
  } catch (err) {
    setError('⚠️ Ocurrió un error de conexión con el servidor (Por ejemplo datos de validación incorrectos (La contraseña debe contener mínimo 8 carácteres, una letra mayúscula, una letra minúscula, un número y un carácter especial)).');
  }
};


  {/*const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (contraseña !== confirmacion) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          correo,
          contraseña,
          contraseña_confirmation: confirmacion,
        }),
      });

      const data = await res.json();
      if (res.status === 422 && data.errors) {
  // Aquí extraemos los errores del backend y los mostramos
  const errores = Object.values(data.errors).flat();
  setError(errores.join(" "));
} else if (res.ok) {
  setMensaje('✅ Contraseña restablecida con éxito. Ahora puedes iniciar sesión.');
} else {
  setError(data.message || '❌ Ocurrió un error.');
}
    } catch (err) {
      setError('⚠️ Error de conexión con el servidor.');
    }
  };*/}

  return (
    <div className="forgot-password-section">
      <div className="forgot-container">
        {/*<div className="login-card-inner">*/}
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Restablecer Contraseña</h2>

        {mensaje && <p className="mb-4 text-green-600 text-sm text-center">{mensaje}</p>}
        {error && <p className="mb-4 text-red-600 text-sm text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Campo contraseña */}
          <div className="input-horizontal">
            <label className="nueva-contrasena">Nueva Contraseña:</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-10"
            />
            <div
              className="ojito-ojo"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          {/* Campo confirmación */}
          <div className="input-horizontal">
            <label className="nueva-contrasena">Confirmar Contraseña:</label>
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmacion}
              onChange={(e) => setConfirmacion(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-10"
            />
            <div
              className="ojito-ojo"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100" style={{backgroundColor: '#a2231d', border:'#a2231d'}}
          >
            Restablecer
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;

{/*import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const correo = searchParams.get('correo');

  const [contraseña, setContraseña] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (contraseña !== confirmacion) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          correo,
          contraseña,
          contraseña_confirmation: confirmacion,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje('Contraseña restablecida con éxito. Ahora puedes iniciar sesión.');
      } else {
        setError(data.message || 'Ocurrió un error.');
      }
    } catch (err) {
      setError('Error de conexión con el servidor.');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Restablecer Contraseña</h2>
      {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nueva Contraseña:</label>
          <input
            type="password"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirmar Contraseña:</label>
          <input
            type="password"
            value={confirmacion}
            onChange={(e) => setConfirmacion(e.target.value)}
            required
          />
        </div>
        <button type="submit">Restablecer</button>
      </form>
    </div>
  );
}

export default ResetPassword;*/}
