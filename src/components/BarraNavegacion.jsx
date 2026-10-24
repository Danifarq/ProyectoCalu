
import React, { useState, useEffect } from 'react';
import { auth } from '../firebase/configuracionFirebase';
import { signOut } from 'firebase/auth';
import fondoBanner from '../assets/banner-2.jpeg';
import imagenGatito from '../assets/quiron-mirando.png';
export default function BarraNavegacion({ pestanaActiva, setPestanaActiva, puntos, contadorCarrito, onAbrirCarrito, usuarioActivo }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Si bajamos más de 30 píxeles, activamos el estado de "scrolled"
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const cerrarSesion = async () => {
    try {
      await signOut(auth);
      alert('Sesión cerrada correctamente 🐾');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <>
      {/* Forzamos la carga de la fuente directamente desde el componente */}
      <style>
        {`@import url('https://googleapis.com');`}
      </style>

      <header style={{ 
       backgroundImage: `url(${fondoBanner})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        borderBottom: '4px solid #121019', 
        padding: '15px 20px', 
        position: 'sticky', 
        top: 0, 
        zIndex: 1000 
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          
          {/* Logo / Nombre del salón con la tipografía retro */}
          <div 
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
            onClick={() => setPestanaActiva('inicio')}
          >
            <div>
              <span style={{ fontSize: '2rem' }}>🐾</span>
              <h1 className="fuente-retro-logo" style={{ margin: 0 }}>
                MAGIC BLING
              </h1>
            </div>
          </div>

          {/* Resto de los botones de navegación... */}
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
        </div>{/* --- 3. GATITO ASOMÁNDOSE DESDE EL BORDE --- */}
        <img 
          src={imagenGatito} 
          alt="Gatito asomándose" 
          style={{
            position: 'fixed',
            bottom: '-15px',
            // Al hacer scroll se desplaza a -420px (fuera de la pantalla por la izquierda)
            left: scrolled ? '-420px' : '-61px',
            width: '400px',
            height: 'auto',
            zIndex: 9999,
            pointerEvents: 'none',
            // Transición animada para la propiedad 'left'
            transition: 'left 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </header>
    </>
  );
}