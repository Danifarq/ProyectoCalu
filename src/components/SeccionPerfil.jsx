import React, { useState } from 'react';
import { db } from '../firebase/configuracionFirebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function SeccionPerfil({ puntos, setPuntos, usuarioActivo }) {
  const [mensajeCanje, setMensajeCanje] = useState('');

  // Recompensas disponibles para canjear
  const recompensas = [
    { id: 1, titulo: '10% OFF en tu próximo Turno', puntosRequeridos: 300, color: '#fbcfe8' },
    { id: 2, titulo: 'Esmaltado Semipermanente Gratis', puntosRequeridos: 600, color: '#bae6fd' },
    { id: 3, titulo: 'Set Press-On Customizado', puntosRequeridos: 1000, color: '#fef08a' }
  ];

  // Calcular el Nivel VIP según los puntos acumulados
  const obtenerNivelVIP = () => {
    if (puntos >= 1000) return { nombre: 'Gato Oro 👑', color: '#eab308' };
    if (puntos >= 500) return { nombre: 'Gato Plata 🥈', color: '#94a3b8' };
    return { nombre: 'Gato Bronce 🐾', color: '#b45309' };
  };

  const nivelVIP = obtenerNivelVIP();

  // Canjear recompensa y actualizar Firestore
  const canjearRecompensa = async (recompensa) => {
    if (puntos < recompensa.puntosRequeridos) {
      alert('No tienes suficientes puntos para este canje todavía. ¡Sigue reservando turnos!');
      return;
    }

    const nuevosPuntos = puntos - recompensa.puntosRequeridos;

    try {
      if (usuarioActivo) {
        const userRef = doc(db, 'usuarios', usuarioActivo.uid);
        await updateDoc(userRef, { puntos: nuevosPuntos });
      }
      setPuntos(nuevosPuntos);
      setMensajeCanje(`¡Felicidades! Canjeaste: "${recompensa.titulo}". Presenta tu correo al asistir a tu turno.`);
    } catch (error) {
      console.error('Error al canjear puntos: ', error);
      alert('Ocurrió un error al procesar el canje.');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Tarjeta de Perfil */}
      <div className="retro-card" style={{ padding: '30px', background: '#fff', marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h2 style={{ fontWeight: '900', color: '#be185d', fontSize: '1.8rem' }}>
              👤 PERFIL VIP
            </h2>
            <p style={{ fontWeight: '600', color: '#4b5563', marginTop: '5px' }}>
              {usuarioActivo ? usuarioActivo.email : 'Usuario Invitado'}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ 
              background: nivelVIP.color, 
              color: '#fff', 
              padding: '6px 14px', 
              borderRadius: '20px', 
              fontWeight: '900', 
              border: '2px solid #121019',
              display: 'inline-block',
              marginBottom: '8px'
            }}>
              {nivelVIP.nombre}
            </span>
            <h3 style={{ fontWeight: '900', fontSize: '1.5rem', color: '#0284c7' }}>
              💎 {puntos.toLocaleString()} Pts
            </h3>
          </div>
        </div>
      </div>

      {/* Alerta de Canje Exitoso */}
      {mensajeCanje && (
        <div style={{ padding: '15px', background: '#dcfce7', border: '3px solid #121019', borderRadius: '12px', marginBottom: '20px', fontWeight: 'bold', color: '#15803d', textAlign: 'center' }}>
          ✨ {mensajeCanje}
        </div>
      )}

      {/* Catálogo de Recompensas */}
      <div className="retro-card" style={{ padding: '30px', background: '#f8fafc' }}>
        <h3 style={{ fontWeight: '900', marginBottom: '20px', color: '#4338ca', textAlign: 'center' }}>
          🎁 CATÁLOGO DE CANJE DE PUNTOS
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {recompensas.map((item) => (
            <div 
              key={item.id} 
              style={{ 
                background: item.color, 
                border: '3px solid #121019', 
                borderRadius: '12px', 
                padding: '15px 20px', 
                display: 'flex', 
                justify: 'space-between', 
                alignItems: 'center', 
                flexWrap: 'wrap',
                gap: '10px'
              }}
            >
              <div>
                <h4 style={{ fontWeight: '900', fontSize: '1.1rem' }}>{item.titulo}</h4>
                <p style={{ fontWeight: '700', fontSize: '0.9rem', color: '#334155' }}>
                  Costo: {item.puntosRequeridos} Pts
                </p>
              </div>

              <button 
                className="retro-button" 
                style={{ background: puntos >= item.puntosRequeridos ? '#4ade80' : '#e2e8f0', cursor: puntos >= item.puntosRequeridos ? 'pointer' : 'not-allowed' }}
                onClick={() => canjearRecompensa(item)}
                disabled={puntos < item.puntosRequeridos}
              >
                {puntos >= item.puntosRequeridos ? '✨ CANJEAR' : 'Puntos Insuficientes'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}