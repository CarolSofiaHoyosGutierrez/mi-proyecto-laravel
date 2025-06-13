import React, { useState } from 'react';

export default function DonacionModal({ isOpen, onClose, ayudaId, onSuccess }) {
  const [monto, setMonto] = useState('');
  const [metodoPago, setMetodoPago] = useState('Tarjeta');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const enviarDonacion = async () => {
    setLoading(true);
    setMensaje('');
    setError('');

    try {
      const token = localStorage.getItem('token');

      const res = await fetch('http://localhost:8000/api/donaciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ayuda_id: ayudaId,
          monto,
          metodo_pago: metodoPago,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje('¡Donación realizada con éxito!');
        onSuccess(); // para refrescar la lista o cerrar modal
      } else {
        setError(data.message || 'Error al procesar donación.');
      }
    } catch (err) {
      setError('Error de red o del servidor.');
    }

    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">Donar a la causa</h2>

        <label className="block mb-2 text-sm font-medium">Monto:</label>
        <input
          type="number"
          className="w-full p-2 border rounded mb-4"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
        />

        <label className="block mb-2 text-sm font-medium">Método de pago:</label>
        <select
          className="w-full p-2 border rounded mb-4"
          value={metodoPago}
          onChange={(e) => setMetodoPago(e.target.value)}
        >
          <option value="Tarjeta">Tarjeta</option>
          <option value="Transferencia">Transferencia</option>
          <option value="Efectivo">Efectivo</option>
        </select>

        {mensaje && <p className="text-green-600 mb-2">{mensaje}</p>}
        {error && <p className="text-red-600 mb-2">{error}</p>}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={enviarDonacion}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Donar'}
          </button>
        </div>
      </div>
    </div>
  );
}
