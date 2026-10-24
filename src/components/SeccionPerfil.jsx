import React, { useState } from 'react';
import { auth, db } from '../firebase/configuracionFirebase';
import { signOut } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

export default function SeccionPerfil({ puntos, setPuntos, usuarioActivo, datosUsuario, setDatosUsuario }) {
  const [mensajeCanje, setMensajeCanje] = useState('');
  const [cargandoMembresia, setCargandoMembresia] = useState(false);

  const mesesSeguidos = datosUsuario?.mesesSeguidos || 0;
  const esClientaFiel = datosUsuario?.esClientaFiel || mesesSeguidos >= 7;

  const cerrarSesion = async () => {
    try {
      await signOut(auth);
      alert('Sesión cerrada correctamente 🐾');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

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

  const abonarClientaFiel = async () => {
    if (!usuarioActivo) {
      alert('Debes iniciar sesión para suscribirte como Clienta Fiel.');
      return;
    }

    if (window.confirm('¿Deseas abonar la Membresía Clienta Fiel por $5.000 ARS/mes?')) {
      setCargandoMembresia(true);
      try {
        const userRef = doc(db, 'usuarios', usuarioActivo.uid);
        await updateDoc(userRef, { esClientaFiel: true });
        
        if (setDatosUsuario) {
          setDatosUsuario(prev => ({ ...prev, esClientaFiel: true }));
        }

        alert('¡Felicidades! Ahora eres CLIENTA FIEL 👑.');
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setCargandoMembresia(false);
      }
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
            {usuarioActivo && (
              <button 
                className="retro-button" 
                style={{ background: '#ef4444', color: '#fff', padding: '6px 12px', fontSize: '0.85rem', marginTop: '10px' }}
                onClick={cerrarSesion}
              >
                🚪 Cerrar Sesión
              </button>
            )}
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

      {/* CLIENTA FIEL */}
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
              <span className="retro-button" style={{ background: '#4ade80', cursor: 'default' }}>
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
      </div>
    </div>
  );
}