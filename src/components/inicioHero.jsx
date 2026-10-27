import React, { useState, useEffect } from 'react';
import { db } from '../firebase/configuracionFirebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import marcoRosa from '../assets/marco-rosa.png';
import bannerInicio from '../assets/banner-inicio.png';
import './InicioHero.css';

export default function InicioHero({ setPestanaActiva }) {
  const [disenosAprobados, setDisenosAprobados] = useState([]);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'ideas_disenos'), where('aprobado', '==', true));
    const desuscribir = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDisenosAprobados(lista);
    });

    return () => desuscribir();
  }, []);

  return (
    <div className="inicio-hero-wrapper">
      {/* 1. HERO BANNER TARJETA CON ESQUINAS REDONDEADAS */}
      <section className="hero-card-container">
        <img 
          src={bannerInicio} 
          alt="Nails Fun & Colorful Art" 
          className="hero-banner-img" 
        />

        <div className="hero-overlay">
          <h1 className="hero-title">Bold & Funky Nails</h1>

          <p className="hero-subtitle">
            ¡Sacá tus garras más cute y llenas de estilo retro-maximalista! 🐾✨
          </p>

          <div className="hero-buttons">
            <button 
              className="retro-button btn-reserva" 
              onClick={() => setPestanaActiva('turnos')}
            >
              📅 RESERVAR MI TURNO
            </button>
            
            <button 
              className="retro-button btn-idea" 
              onClick={() => setPestanaActiva('resenas')}
            >
              📸 SUBIR MI IDEA
            </button>
          </div>
        </div>
      </section>

      {/* 2. BARRA MARGEN VERDE EN MOVIMIENTO (DE BORDE A BORDE) */}
      <div className="ticker-bar">
        <div className="ticker-content">
          <div className="ticker-item">
            <span>Dreamy Clothing</span> <span className="ticker-separator">🎀</span>
            <span>To Wear Forever</span> <span className="ticker-separator">🎀</span>
            <span>Magic Bling</span> <span className="ticker-separator">🎀</span>
            <span>Dreamy Clothing</span> <span className="ticker-separator">🎀</span>
            <span>To Wear Forever</span> <span className="ticker-separator">🎀</span>
            <span>Magic Bling</span> <span className="ticker-separator">🎀</span>
          </div>
          <div className="ticker-item">
            <span>Dreamy Clothing</span> <span className="ticker-separator">🎀</span>
            <span>To Wear Forever</span> <span className="ticker-separator">🎀</span>
            <span>Magic Bling</span> <span className="ticker-separator">🎀</span>
            <span>Dreamy Clothing</span> <span className="ticker-separator">🎀</span>
            <span>To Wear Forever</span> <span className="ticker-separator">🎀</span>
            <span>Magic Bling</span> <span className="ticker-separator">🎀</span>
          </div>
        </div>
      </div>

      {/* 3. GALERÍA DE DISEÑOS */}
      <section className="galeria-container">
        <h2 className="galeria-titulo">
          💖 DISEÑOS DESTACADOS Y PROPUESTAS DE LA COMUNIDAD
        </h2>

        {disenosAprobados.length === 0 ? (
          <p className="galeria-vacia">
            ¡Aún no hay propuestas aprobadas este mes! Subí la tuya desde la sección de Reseñas. 🐾
          </p>
        ) : (
          <div className="galeria-grid">
            {disenosAprobados.map((item) => (
              <div key={item.id} className="retro-card card-item">
                {item.imagenUrl ? (
                  <div 
                    className="marco-wrapper"
                    onClick={() => setImagenSeleccionada(imagenSeleccionada === item.id ? null : item.id)}
                  >
                    <img 
                      src={item.imagenUrl} 
                      alt={item.titulo} 
                      className="imagen-diseno"
                    />

                    <img 
                      src={marcoRosa} 
                      alt="Marco decorativo" 
                      className="imagen-marco"
                    />

                    {imagenSeleccionada === item.id && (
                      <button 
                        className="retro-button btn-pedir-diseno"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPestanaActiva('turnos');
                        }}
                      >
                        Pedir este diseño 📅
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="placeholder-diseno">
                    💅✨
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}