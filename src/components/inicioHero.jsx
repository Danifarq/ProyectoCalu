import React, { useState, useEffect } from 'react';
import { db } from '../firebase/configuracionFirebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import marcoRosa from '../assets/marco-rosa.png';

export default function InicioHero({ setPestanaActiva }) {
  const [disenosAprobados, setDisenosAprobados] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'ideas_disenos'), where('aprobado', '==', true));
    const desuscribir = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDisenosAprobados(lista);
    });

    return () => desuscribir();
  }, []);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
      {/* Banner Principal */}
      <div className="retro-card" style={{ padding: '40px 20px', background: '#fbcfe8', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#be185d', marginBottom: '15px' }}>
          NAILS: FUN & COLORFUL ART 🐾✨
        </h1>
        <p style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '25px', color: '#1e1b4b' }}>
          ¡Sacá tus garras más cute y llenas de estilo retro-maximalista!
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            className="retro-button" 
            style={{ background: '#4ade80', fontSize: '1.1rem', padding: '12px 25px' }}
            onClick={() => setPestanaActiva('turnos')}
          >
            📅 RESERVAR MI TURNO
          </button>
          <button 
            className="retro-button" 
            style={{ background: '#facc15', fontSize: '1.1rem', padding: '12px 25px' }}
            onClick={() => setPestanaActiva('resenas')}
          >
            📸 SUBIR MI IDEA DE DISEÑO
          </button>
        </div>
      </div>

      {/* Galería de Inspiración Aprobada */}
      <h2 style={{ fontWeight: '900', color: '#4338ca', marginBottom: '20px' }}>
        💖 DISEÑOS DESTACADOS Y PROPUESTAS DE LA COMUNIDAD
      </h2>

      {disenosAprobados.length === 0 ? (
        <p style={{ fontWeight: 'bold', color: '#6b7280', padding: '20px' }}>
          ¡Aún no hay propuestas aprobadas este mes! Subí la tuya desde la sección de Reseñas. 🐾
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {disenosAprobados.map((item) => (
            <div 
              key={item.id} 
              className="retro-card" 
              style={{ 
                padding: '18px', 
           
                textAlign: 'left', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                boxShadow: 'none'
              }}
            >
              <div>
                {/* Contenedor del Marco con la Imagen Adentro */}
                {item.imagenUrl ? (
                  <div style={{ 
                    position: 'relative',
                    width: '100%', 
                    aspectRatio: '1 / 1', 
                    marginBottom: '12px', 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    {/* 1. Imagen de las Uñas (Fondo / Atrás) */}
                    <img 
                      src={item.imagenUrl} 
                      alt={item.titulo} 
                      style={{ 
                        width: '86%', 
                        height: '86%', 
                        objectFit: 'cover',
                        borderRadius: '16px',
                        position: 'absolute'
                      }} 
                    />

                    {/* 2. Imagen del Marco sin fondo (Por encima) */}
                    <img 
                      src={marcoRosa} 
                      alt="Marco decorativo" 
                      style={{ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'none',
                        objectFit: 'contain'
                      }} 
                    />
                  </div>
                ) : (
                  <div style={{ 
                    position: 'relative',
                    width: '100%', 
                    aspectRatio: '1 / 1', 
                    marginBottom: '12px', 
                    background: '#fef08a', 
                    borderRadius: '12px',
                    border: '3px solid #121019',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '3rem' 
                  }}>
                    💅✨
                  </div>
                )}

               
              </div>

              <div>
               
                <button 
                  className="retro-button" 
                  style={{ background: '#facc15', width: '100%', fontSize: '0.85rem' }}
                  onClick={() => setPestanaActiva('turnos')}
                >
                  Pedir este diseño 📅
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}