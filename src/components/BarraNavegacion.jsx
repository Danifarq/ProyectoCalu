import React, { useState, useEffect } from 'react';
import { auth } from '../firebase/configuracionFirebase';
import { signOut } from 'firebase/auth';
import fondoBanner from '../assets/banner-2.jpeg';
import imagenGatito from '../assets/quiron-mirando.png';

export default function BarraNavegacion({ pestanaActiva, setPestanaActiva, puntos, contadorCarrito, onAbrirCarrito, usuarioActivo }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
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
      <style>
        {`@import url('https://googleapis.com');`}
      </style>

      <header style={{ 
        backgroundImage: `url(${fondoBanner})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        borderBottom: '4px solid #121019', 
        position: 'sticky', 
        top: 0, 
        zIndex: 1000 
      }}>
        {/* --- SECCIÓN SUPERIOR: Logo centrado e iconos a la derecha --- */}
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          display: 'grid', 
          gridTemplateColumns: '1fr auto 1fr', 
          alignItems: 'center', 
          padding: '15px 20px' 
        }}>
          
          <div></div>

          {/* Logo / Nombre centrado */}
          <div 
            style={{ 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '10px',
              textAlign: 'center'
            }}
            onClick={() => setPestanaActiva('inicio')}
          >
            <span style={{ fontSize: '2rem' }}>🐾</span>
            <h1 className="fuente-retro-logo" style={{ margin: 0 }}>
              MAGIC BLING
            </h1>
          </div>

          {/* Iconos de Redes Sociales y Cuenta/Carrito a la derecha */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px' }}>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" title="Instagram" style={{ fontSize: '1.2rem', textDecoration: 'none' }}>
              📸
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" title="Facebook" style={{ fontSize: '1.2rem', textDecoration: 'none' }}>
              📘
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" title="TikTok" style={{ fontSize: '1.2rem', textDecoration: 'none' }}>
              🎵
            </a>

            <span style={{ color: '#121019', margin: '0 4px', fontWeight: 'bold' }}>|</span>

            <button 
              onClick={() => setPestanaActiva(usuarioActivo ? 'perfil' : 'auth')}
              title={usuarioActivo ? "Mi Cuenta" : "Ingresar"}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
            >
              👤
            </button>

            <button 
              onClick={onAbrirCarrito}
              title="Ver Carrito"
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', position: 'relative' }}
            >
              🛍️
              {contadorCarrito > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-8px',
                  background: '#ef4444',
                  color: 'white',
                  borderRadius: '50%',
                  padding: '2px 6px',
                  fontSize: '0.7rem',
                  fontWeight: 'bold'
                }}>
                  {contadorCarrito}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* --- SECCIÓN INFERIOR: Menú de Navegación Estilo Texto Limpio --- */}
        <nav style={{ 
          background: 'rgba(255, 255, 255, 0.85)', 
          backdropFilter: 'blur(5px)',
          borderTop: '2px solid #121019',
          display: 'flex', 
          justifyContent: 'center', 
          gap: '4px', 
          flexWrap: 'wrap', 
          padding: '10px 20px',
          alignItems: 'center' 
        }}>
          <button 
            className="menu-link" 
            style={{ background: pestanaActiva === 'inicio' ? 'rgba(18, 16, 25, 0.12)' : 'transparent' }} 
            onClick={() => setPestanaActiva('inicio')}
          >
            🏠 Inicio
          </button>

          <button 
            className="menu-link" 
            style={{ background: pestanaActiva === 'turnos' ? 'rgba(18, 16, 25, 0.12)' : 'transparent' }} 
            onClick={() => setPestanaActiva('turnos')}
          >
            📅 Turnos
          </button>

          <button 
            className="menu-link" 
            style={{ background: pestanaActiva === 'armatucombo' ? 'rgba(18, 16, 25, 0.12)' : 'transparent' }} 
            onClick={() => setPestanaActiva('armatucombo')}
          >
            🎨 Arma tu Combo
          </button>

          <button 
            className="menu-link" 
            style={{ background: pestanaActiva === 'tienda' ? 'rgba(18, 16, 25, 0.12)' : 'transparent' }} 
            onClick={() => setPestanaActiva('tienda')}
          >
            🛍️ Tienda
          </button>

          <button 
            className="menu-link" 
            style={{ background: pestanaActiva === 'resenas' ? 'rgba(18, 16, 25, 0.12)' : 'transparent' }} 
            onClick={() => setPestanaActiva('resenas')}
          >
            ⭐ Reseñas
          </button>

          <button 
            className="menu-link" 
            style={{ background: pestanaActiva === 'sobremi' ? 'rgba(18, 16, 25, 0.12)' : 'transparent' }} 
            onClick={() => setPestanaActiva('sobremi')}
          >
            🐱 Sobre Mí
          </button>

          <button 
            className="menu-link" 
            style={{ background: pestanaActiva === 'perfil' ? 'rgba(18, 16, 25, 0.12)' : 'transparent' }} 
            onClick={() => setPestanaActiva('perfil')}
          >
            👤 Mi Cuenta
          </button>

          <button 
            className="menu-link" 
            style={{ background: pestanaActiva === 'admin' ? 'rgba(18, 16, 25, 0.12)' : 'transparent' }} 
            onClick={() => setPestanaActiva('admin')}
          >
            👑 Admin
          </button>

          {!usuarioActivo ? (
            <button 
              className="menu-link" 
              style={{ background: pestanaActiva === 'auth' ? 'rgba(74, 222, 128, 0.3)' : 'transparent', fontWeight: 'bold' }} 
              onClick={() => setPestanaActiva('auth')}
            >
              🔑 Ingresar
            </button>
          ) : (
            <button 
              className="menu-link" 
              style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#b91c1c' }} 
              onClick={cerrarSesion}
              title="Cerrar Sesión"
            >
              🚪 Salir
            </button>
          )}
        </nav>

        {/* Gatito asomándose */}
        <img 
          src={imagenGatito} 
          alt="Gatito asomándose" 
          style={{
            position: 'fixed',
            bottom: '-15px',
            left: scrolled ? '-420px' : '-61px',
            width: '400px',
            height: 'auto',
            zIndex: 9999,
            pointerEvents: 'none',
            transition: 'left 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </header>
    </>
  );
}