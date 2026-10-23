import React, { useState } from 'react';

export default function SeccionTurnos({ setPuntos }) {
  const [servicioSeleccionado, setServicioSeleccionado] = useState('Manicuría Neón con Arte (300 pts)');
  const [horaSeleccionada, setHoraSeleccionada] = useState('11:00');
  const [reservaConfirmada, setReservaConfirmada] = useState(false);

  const confirmarTurno = () => {
    setReservaConfirmada(true);
    setPuntos(prev => prev + 150); // Suma puntos al reservar
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="retro-card" style={{ padding: '30px', background: '#fbcfe8' }}>
        <h2 style={{ fontWeight: '900', marginBottom: '20px', textAlign: 'center', color: '#be185d' }}>📅 SISTEMA DE TURNOS</h2>

        {reservaConfirmada ? (
          <div style={{ textAlign: 'center', padding: '30px', background: '#dcfce7', border: '3px solid #121019', borderRadius: '15px' }}>
            <h3 style={{ fontSize: '1.8rem', color: '#15803d', fontWeight: '900' }}>¡Turno Confirmado con Éxito! 🐾✨</h3>
            <p style={{ margin: '15px 0', fontWeight: '600' }}>Servicio: {servicioSeleccionado}</p>
            <p style={{ margin: '15px 0', fontWeight: '600' }}>Horario: {horaSeleccionada} hs</p>
            <p style={{ color: '#047857', fontWeight: 'bold' }}>¡Ganaste +150 Puntos en tu billetera!</p>
            <button className="retro-button" style={{ background: '#38bdf8', marginTop: '15px' }} onClick={() => setReservaConfirmada(false)}>
              Reservar Otro Turno
            </button>
          </div>
        ) : (
          <div>
            {/* Paso 1: Servicios */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontWeight: '800', display: 'block', marginBottom: '8px' }}>1. Elige tu Servicio:</label>
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

            {/* Paso 2: Horarios */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontWeight: '800', display: 'block', marginBottom: '8px' }}>2. Selecciona la Hora:</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['09:00', '11:00', '14:30', '17:00'].map((hora) => (
                  <button 
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

            {/* Botón Confirmar */}
            <button 
              className="retro-button" 
              style={{ width: '100%', background: '#4ade80', fontSize: '1.2rem', padding: '15px', marginTop: '10px' }}
              onClick={confirmarTurno}
            >
              ✨ CONFIRMAR RESERVA Y SUMAR PUNTOS
            </button>
          </div>
        )}
      </div>
    </div>
  );
}