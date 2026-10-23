import React, { useState } from 'react';
import { db } from '../firebase/configuracionFirebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function SeccionTurnos({ setPuntos }) {
  const [servicioSeleccionado, setServicioSeleccionado] = useState('Manicuría Neón con Arte (300 pts)');
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);
  const [horaSeleccionada, setHoraSeleccionada] = useState('11:00');
  const [nombreCliente, setNombreCliente] = useState('');
  const [cargando, setCargando] = useState(false);
  const [reservaConfirmada, setReservaConfirmada] = useState(false);

  const confirmarTurno = async (e) => {
    e.preventDefault();
    if (!nombreCliente.trim()) {
      alert('Por favor, ingresa tu nombre para reservar.');
      return;
    }

    setCargando(true);

    try {
      // 1. Guardar la reserva en la colección "turnos" de Firestore
      await addDoc(collection(db, 'turnos'), {
        cliente: nombreCliente,
        servicio: servicioSeleccionado,
        fecha: fechaSeleccionada,
        hora: horaSeleccionada,
        puntosGanados: 150,
        estado: 'pendiente',
        creadoEn: serverTimestamp()
      });

      // 2. Sumar puntos al estado local
      setPuntos(prev => prev + 150);
      setReservaConfirmada(true);
    } catch (error) {
      console.error('Error al guardar el turno:', error);
      alert('Hubo un problema al guardar tu turno. Revisa la consola o tu configuración de Firebase.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="retro-card" style={{ padding: '30px', background: '#fbcfe8' }}>
        <h2 style={{ fontWeight: '900', marginBottom: '20px', textAlign: 'center', color: '#be185d' }}>📅 SISTEMA DE TURNOS</h2>

        {reservaConfirmada ? (
          <div style={{ textAlign: 'center', padding: '30px', background: '#dcfce7', border: '3px solid #121019', borderRadius: '15px' }}>
            <h3 style={{ fontSize: '1.8rem', color: '#15803d', fontWeight: '900' }}>¡Turno Confirmado en Firebase! 🐾✨</h3>
            <p style={{ margin: '10px 0', fontWeight: '600' }}>Cliente: {nombreCliente}</p>
            <p style={{ margin: '10px 0', fontWeight: '600' }}>Servicio: {servicioSeleccionado}</p>
            <p style={{ margin: '10px 0', fontWeight: '600' }}>Fecha y Hora: {fechaSeleccionada} a las {horaSeleccionada} hs</p>
            <p style={{ color: '#047857', fontWeight: 'bold' }}>¡Ganaste +150 Puntos!</p>
            <button className="retro-button" style={{ background: '#38bdf8', marginTop: '15px' }} onClick={() => setReservaConfirmada(false)}>
              Reservar Otro Turno
            </button>
          </div>
        ) : (
          <form onSubmit={confirmarTurno}>
            {/* Nombre del Cliente */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontWeight: '800', display: 'block', marginBottom: '8px' }}>1. Tu Nombre / Nickname:</label>
              <input 
                type="text" 
                value={nombreCliente}
                onChange={(e) => setNombreCliente(e.target.value)}
                placeholder="Ej: Calu"
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '3px solid #121019', fontWeight: 'bold' }}
              />
            </div>

            {/* Servicio */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontWeight: '800', display: 'block', marginBottom: '8px' }}>2. Elige tu Servicio:</label>
              <select 
                value={servicioSeleccionado} 
                onChange={(e) => setServicioSeleccionado(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '3px solid #121019', fontWeight: 'bold', background: '#fff' }}
              >
                <option>Manicuría Neón con Arte (300 pts)</option>
                <option>Kapping con 3D (150 pts)</option>
                <option>Nail Art Minimalista (150 pts)</option>
              </select>
            </div>

            {/* Fecha */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontWeight: '800', display: 'block', marginBottom: '8px' }}>3. Selecciona la Fecha:</label>
              <input 
                type="date"
                value={fechaSeleccionada}
                onChange={(e) => setFechaSeleccionada(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '3px solid #121019', fontWeight: 'bold', background: '#fff' }}
              />
            </div>

            {/* Hora */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontWeight: '800', display: 'block', marginBottom: '8px' }}>4. Selecciona la Hora:</label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {['09:00', '11:00', '14:30', '17:00'].map((hora) => (
                  <button 
                    type="button"
                    key={hora}
                    onClick={() => setHoraSeleccionada(hora)}
                    className="retro-button"
                    style={{ background: horaSeleccionada === hora ? '#facc15' : '#fff' }}
                  >
                    {hora} hs
                  </button>
                ))}
              </div>
            </div>

            {/* Botón Guardar */}
            <button 
              type="submit"
              disabled={cargando}
              className="retro-button" 
              style={{ width: '100%', background: '#4ade80', fontSize: '1.2rem', padding: '15px', marginTop: '10px' }}
            >
              {cargando ? 'Guardando en Firebase...' : '✨ CONFIRMAR RESERVA Y SUMAR PUNTOS'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}