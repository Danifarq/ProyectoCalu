import React, { useState } from 'react';
import { auth, db } from '../firebase/configuracionFirebase';
import { signOut } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

export default function SeccionPerfil({ puntos, setPuntos, usuarioActivo, datosUsuario, setDatosUsuario }) {
  const [mensajeCanje, setMensajeCanje] = useState('');

  const mesesSeguidos = datosUsuario?.mesesSeguidos || 0;
  
  // Validar si la membresía de Clienta Fiel sigue activa o expiro
  const esClientaFielActiva = datosUsuario?.esClientaFiel && (
    !datosUsuario?.vencimientoClientaFiel || new Date(datosUsuario.vencimientoClientaFiel) > new Date()
  );

  const fechaVencimiento = datosUsuario?.vencimientoClientaFiel 
    ? new Date(datosUsuario.vencimientoClientaFiel).toLocaleDateString() 
    : null;

  const cerrarSesion = async () => {
    try {
      await signOut(auth);
      alert('Sesión cerrada correctamente 🐾');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      {/* Perfil Usuario */}
      <div className="retro-card" style={{ padding: '30px', background: '#fff', marginBottom: '25px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h2 style={{ fontWeight: '900', color: '#be185d', fontSize: '1.8rem' }}>👤 PERFIL VIP</h2>
            <p style={{ fontWeight: '600', color: '#4b5563', marginTop: '5px' }}>
              {usuarioActivo ? usuarioActivo.email : 'Usuario Invitado'}
            </p>
            {usuarioActivo && (
              <button className="retro-button" style={{ background: '#ef4444', color: '#fff', padding: '6px 12px', fontSize: '0.85rem', marginTop: '10px' }} onClick={cerrarSesion}>
                🚪 Cerrar Sesión
              </button>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <h3 style={{ fontWeight: '900', fontSize: '1.5rem', color: '#0284c7' }}>💎 {puntos.toLocaleString()} Pts</h3>
          </div>
        </div>
      </div>

      {/* Tarjeta Clienta Fiel */}
      <div className="retro-card" style={{ padding: '25px', background: esClientaFielActiva ? '#fef08a' : '#fbcfe8', marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h3 style={{ fontWeight: '900', color: '#be185d', fontSize: '1.4rem' }}>👑 ESTATUS CLIENTA FIEL</h3>
            <p style={{ fontWeight: '700', color: '#1e1b4b', marginTop: '5px' }}>
              Beneficio: Agenda del próximo mes habilitada 1 semana antes 📅⚡
            </p>
            {fechaVencimiento && (
              <p style={{ fontWeight: '800', fontSize: '0.85rem', color: '#be185d', marginTop: '5px' }}>
                Vencimiento del beneficio: {fechaVencimiento}
              </p>
            )}
          </div>
          <div>
            {esClientaFielActiva ? (
              <span className="retro-button" style={{ background: '#4ade80', cursor: 'default' }}>
                ✨ ¡BENEFICIO ACTIVO!
              </span>
            ) : (
              <span className="retro-button" style={{ background: '#cbd5e1', cursor: 'default' }}>
                🔒 BENEFICIO INACTIVO
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}