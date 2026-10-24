import React, { useState } from 'react';
import { db } from '../firebase/configuracionFirebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function SeccionPerfil({ puntos, setPuntos, usuarioActivo, datosUsuario, setDatosUsuario }) {
  const [mensajeCanje, setMensajeCanje] = useState('');
  const [cargandoMembresia, setCargandoMembresia] = useState(false);

  // Meses seguidos que lleva la clienta asistiendo (simulado o traído de Firestore)
  const mesesSeguidos = datosUsuario?.mesesSeguidos || 0;
  const esClientaFiel = datosUsuario?.esClientaFiel || mesesSeguidos >= 7;

  // Recompensas de Puntos
  const recompensas = [
    { id: 1, titulo: '10% OFF en tu próximo Turno', puntosRequeridos: 300, color: '#fbcfe8' },
    { id: 2, titulo: 'Esmaltado Semipermanente Gratis', puntosRequeridos: 600, color: '#bae6fd' },
    { id: 3, titulo: 'Set Press-On Customizado', puntosRequeridos: 1000, color: '#fef08a' }
  ];

  const obtenerNivelVIP = () => {
    if (puntos >= 1000) return { nombre: 'Gato Oro 👑', color: '#eab308' };
    if (puntos >= 500) return { nombre: 'Gato Plata 🥈', color: '#94a3b8' };
    return { nombre: 'Gato Bronce 🐾', color: '#b45309' };
  };

  const nivelVIP = obtenerNivelVIP();

  // Activar membresía comprándola o por racha de 7 meses
  const abonarClientaFiel = async () => {
    if (!usuarioActivo) {
      alert('Debes iniciar sesión para suscribirte como Clienta Fiel.');
      return;
    }

    if (window.confirm('¿Deseas abonar la Membresía Clienta Fiel por $5.000 ARS/mes para desbloquear la agenda anticipada?')) {
      setCargandoMembresia(true);
      try {
        const userRef = doc(db, 'usuarios', usuarioActivo.uid);
        await updateDoc(userRef, { esClientaFiel: true });
        
        if (setDatosUsuario) {
          setDatosUsuario(prev => ({ ...prev, esClientaFiel: true }));
        }

        alert('¡Felicidades! Ahora eres CLIENTA FIEL 👑. Tu agenda del próximo mes ya está disponible una semana antes.');
      } catch (error) {
        console.error('Error al activar membresía:', error);
        alert('Ocurrió un error al procesar el pago.');
      } finally {
        setCargandoMembresia(false);
      }
    }
  };

  const canjearRecompensa = async (recompensa) => {
    if (puntos < recompensa.puntosRequeridos) {
      alert('No tienes suficientes puntos todavía.');
      return;
    }

    const nuevosPuntos = puntos - recompensa.puntosRequeridos;
    try {
      if (usuarioActivo) {
        const userRef = doc(db, 'usuarios', usuarioActivo.uid);
        await updateDoc(userRef, { puntos: nuevosPuntos });
      }
      setPuntos(nuevosPuntos);
      setMensajeCanje(`¡Felicidades! Canjeaste: "${recompensa.titulo}".`);
    } catch (error) {
      console.error('Error al canjear:', error);
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      {/* Tarjeta de Perfil General */}
      <div className="retro-card" style={{ padding: '30px', background: '#fff', marginBottom: '25px' }}>
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

      {/* TARJETA EXCLUSIVA: CLIENTA FIEL */}
      <div className="retro-card" style={{ padding: '25px', background: esClientaFiel ? '#fef08a' : '#fbcfe8', marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h3 style={{ fontWeight: '900', color: '#be185d', fontSize: '1.4rem' }}>
              👑 ESTATUS CLIENTA FIEL
            </h3>
            <p style={{ fontWeight: '700', color: '#1e1b4b', marginTop: '5px' }}>
              Beneficio: ¡Acceso a la agenda del mes que viene 1 semana antes! 📅⚡
            </p>
            <p style={{ fontWeight: '600', fontSize: '0.9rem', marginTop: '8px', color: '#4338ca' }}>
              Racha actual: <strong>{mesesSeguidos} / 7 meses seguidos asistiendo</strong>
            </p>
          </div>

          <div>
            {esClientaFiel ? (
              <span className="retro-button" style={{ background: '#4ade80', cursor: 'default', display: 'inline-block' }}>
                ✨ ¡ERES CLIENTA FIEL!
              </span>
            ) : (
              <button 
                className="retro-button" 
                style={{ background: '#38bdf8' }}
                onClick={abonarClientaFiel}
                disabled={cargandoMembresia}
              >
                {cargandoMembresia ? 'Procesando...' : '💳 ABONAR PASSE ($5.000 ARS)'}
              </button>
            )}
          </div>
        </div>

        {/* Barra de progreso de los 7 meses */}
        {!esClientaFiel && (
          <div style={{ marginTop: '15px', background: '#fff', borderRadius: '10px', border: '2px solid #121019', height: '20px', overflow: 'hidden' }}>
            <div style={{ 
              width: `${(mesesSeguidos / 7) * 100}%`, 
              background: '#be185d', 
              height: '100%', 
              transition: 'width 0.3s ease' 
            }} />
          </div>
        )}
      </div>

      {mensajeCanje && (
        <div style={{ padding: '15px', background: '#dcfce7', border: '3px solid #121019', borderRadius: '12px', marginBottom: '20px', fontWeight: 'bold', color: '#15803d', textAlign: 'center' }}>
          ✨ {mensajeCanje}
        </div>
      )}

      {/* Catálogo de Canje */}
      <div className="retro-card" style={{ padding: '25px', background: '#f8fafc' }}>
        <h3 style={{ fontWeight: '900', marginBottom: '20px', color: '#4338ca', textAlign: 'center' }}>
          🎁 CATÁLOGO DE RECOMPENSAS
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {recompensas.map((item) => (
            <div key={item.id} style={{ background: item.color, border: '3px solid #121019', borderRadius: '12px', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h4 style={{ fontWeight: '900', fontSize: '1.1rem' }}>{item.titulo}</h4>
                <p style={{ fontWeight: '700', fontSize: '0.9rem', color: '#334155' }}>Costo: {item.puntosRequeridos} Pts</p>
              </div>

              <button 
                className="retro-button" 
                style={{ background: puntos >= item.puntosRequeridos ? '#4ade80' : '#e2e8f0' }}
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