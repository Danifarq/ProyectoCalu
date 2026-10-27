import React, { useState, useEffect } from 'react';
import { auth } from '../firebase/configuracionFirebase';
import { signOut } from 'firebase/auth';
import imagenGatito from '../assets/quiron-mirando.png';
import logoMB from '../assets/MB-logo.png';
import logoIG from '../assets/logo-IG.png';
import logoTikTok from '../assets/logo-TicTok.png'; // Importación de la imagen de TikTok[cite: 8]
import './BarraNavegacion.css';

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
    <header className="header-container">
      {/* BARRA SUPERIOR: Anuncios y Redes Sociales */}
      <div className="top-bar">
        <div className="top-bar-socials">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" title="Instagram">
            <img src={logoIG} alt="Instagram" className="social-icon" />
          </a>
          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" title="TikTok">
            <img src={logoTikTok} alt="TikTok" className="social-icon" />
          </a>
        </div>
        
        <div className="top-bar-announcement">
          <span>¡Bienvenidos a Magic Bling! </span>
        </div>

        <div></div>
      </div>

      {/* BARRA DE NAVEGACIÓN PRINCIPAL */}
      <nav className="main-navbar">
        <div className="nav-section left">
          <button 
            className={`nav-btn ${pestanaActiva === 'inicio' ? 'active' : ''}`}
            onClick={() => setPestanaActiva('inicio')}
          >
             Inicio
          </button>
          <button 
            className={`nav-btn ${pestanaActiva === 'turnos' ? 'active' : ''}`}
            onClick={() => setPestanaActiva('turnos')}
          >
             Turnos
          </button>
          <button 
            className={`nav-btn ${pestanaActiva === 'armatucombo' ? 'active' : ''}`}
            onClick={() => setPestanaActiva('armatucombo')}
          >
             Combo
          </button>
          <button 
            className={`nav-btn ${pestanaActiva === 'tienda' ? 'active' : ''}`}
            onClick={() => setPestanaActiva('tienda')}
          >
             Tienda
          </button>
        </div>

        <div className="nav-logo" onClick={() => setPestanaActiva('inicio')}>
          <img src={logoMB} alt="Magic Bling Logo" className="logo-img" />
        </div>

        <div className="nav-section right">
          <button 
            className={`nav-btn ${pestanaActiva === 'resenas' ? 'active' : ''}`}
            onClick={() => setPestanaActiva('resenas')}
          >
            Reseñas
          </button>
          <button 
            className={`nav-btn ${pestanaActiva === 'sobremi' ? 'active' : ''}`}
            onClick={() => setPestanaActiva('sobremi')}
          >
             Sobre Mí
          </button>
          <button 
            className={`nav-btn ${pestanaActiva === 'admin' ? 'active' : ''}`}
            onClick={() => setPestanaActiva('admin')}
          >
             Admin
          </button>

          <button className="cart-btn" onClick={onAbrirCarrito} title="Ver Carrito">
            🛍️
            {contadorCarrito > 0 && (
              <span className="cart-badge">{contadorCarrito}</span>
            )}
          </button>

          {!usuarioActivo ? (
            <button 
              className={`btn-your-space ${pestanaActiva === 'auth' ? 'active' : ''}`}
              onClick={() => setPestanaActiva('auth')}
            >
              Ingresar
            </button>
          ) : (
            <>
              <button 
                className={`btn-your-space ${pestanaActiva === 'perfil' ? 'active' : ''}`}
                onClick={() => setPestanaActiva('perfil')}
              >
                Mi Cuenta
              </button>
              <button className="nav-btn btn-logout" onClick={cerrarSesion} title="Cerrar Sesión">
                🚪
              </button>
            </>
          )}
        </div>
      </nav>

      <img 
        src={imagenGatito} 
        alt="Gatito asomándose" 
        className="gatito-asomado"
        style={{ left: scrolled ? '-420px' : '-61px' }}
      />
    </header>
  );
}