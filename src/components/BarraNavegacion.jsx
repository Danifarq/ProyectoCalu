import React from 'react';
import { auth } from '../firebase/configuracionFirebase';
import { signOut } from 'firebase/auth';

export default function BarraNavegacion({ pestanaActiva, setPestanaActiva, puntos, contadorCarrito, onAbrirCarrito, usuarioActivo }) {
  const cerrarSesion = async () => {
    try {
      await signOut(auth);
      alert('Sesión cerrada correctamente 🐾');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <header style={{ background: '#fbcfe8', borderBottom: '4px solid #121019', padding: '15px 20px', position: 'sticky', top: 0, zIndex: 1000 }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        
        {/* Logo / Nombre del salón */}
        <div 
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
          onClick={() => setPestanaActiva('inicio')}
        >
          <span style={{ fontSize: '2rem' }}>🐾</span>
          <h1 style={{ fontWeight: '900', color: '#be185d', fontSize: '1.6rem', margin: 0 }}>
            GATITOS NAILS
          </h1>
        </div>

        {/* Botones de Navegación */}
        <nav style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button 
            className="retro-button" 
            style={{ background: pestanaActiva === 'inicio' ? '#facc15' : '#fff' }} 
            onClick={() => setPestanaActiva('inicio')}
          >
            🏠 Inicio
          </button>

          <button 
            className="retro-button" 
            style={{ background: pestanaActiva === 'turnos' ? '#facc15' : '#fff' }} 
            onClick={() => setPestanaActiva('turnos')}
          >
            📅 Turnos
          </button>

          <button 
            className="retro-button" 
            style={{ background: pestanaActiva === 'armatucombo' ? '#facc15' : '#fff' }} 
            onClick={() => setPestanaActiva('armatucombo')}
          >
            🎨 Arma tu Combo
          </button>

          <button 
            className="retro-button" 
            style={{ background: pestanaActiva === 'tienda' ? '#facc15' : '#fff' }} 
            onClick={() => setPestanaActiva('tienda')}
          >
            🛍️ Tienda
          </button>

          <button 
            className="retro-button" 
            style={{ background: pestanaActiva === 'resenas' ? '#facc15' : '#fff' }} 
            onClick={() => setPestanaActiva('resenas')}
          >
            ⭐ Reseñas
          </button>

          <button 
            className="retro-button" 
            style={{ background: pestanaActiva === 'sobremi' ? '#facc15' : '#fff' }} 
            onClick={() => setPestanaActiva('sobremi')}
          >
            🐱 Sobre Mí
          </button>

          <button 
            className="retro-button" 
            style={{ background: pestanaActiva === 'perfil' ? '#facc15' : '#fff' }} 
            onClick={() => setPestanaActiva('perfil')}
          >
            👤 Mi Cuenta
          </button>

          <button 
            className="retro-button" 
            style={{ background: pestanaActiva === 'admin' ? '#facc15' : '#fff' }} 
            onClick={() => setPestanaActiva('admin')}
          >
            👑 Admin
          </button>

          {/* Si NO hay usuario activo, muestra el botón de Iniciar Sesión / Registrarse */}
          {!usuarioActivo ? (
            <button 
              className="retro-button" 
              style={{ background: pestanaActiva === 'auth' ? '#facc15' : '#4ade80' }} 
              onClick={() => setPestanaActiva('auth')}
            >
              🔑 Ingresar / Registrarse
            </button>
          ) : (
            <button 
              className="retro-button" 
              style={{ background: '#ef4444', color: '#fff', padding: '8px 12px' }} 
              onClick={cerrarSesion}
              title="Cerrar Sesión"
            >
              🚪 Salir
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}