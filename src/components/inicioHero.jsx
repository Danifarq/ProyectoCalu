import React, { useState, useEffect } from 'react';
import { db } from '../firebase/configuracionFirebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export default function InicioHero({ setPestanaActiva }) {
  const [disenosAprobados, setDisenosAprobados] = useState([]);

  // Traer solo las propuestas aprobadas por el Admin
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
            <div key={item.id} className="retro-card" style={{ padding: '20px', background: item.color || '#f472b6', textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                {/* Contenedor de la Imagen Adaptada */}
                {item.imagenUrl ? (
                  <div style={{ 
                    width: '100%', 
                    height: '180px', 
                    background: '#fff', 
                    borderRadius: '10px', 
                    border: '3px solid #121019', 
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    <img 
                      src={item.imagenUrl} 
                      alt={item.titulo} 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'contain', // Muestra la imagen entera respetando el tamaño de la caja
                        padding: '4px'
                      }} 
                    />
                  </div>
                ) : (
                  <div style={{ background: '#fff', height: '180px', borderRadius: '10px', border: '3px solid #121019', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', marginBottom: '12px' }}>
                    💅✨
                  </div>
                )}

                <h3 style={{ fontWeight: '900', fontSize: '1.1rem', marginBottom: '5px', color: '#121019' }}>{item.titulo}</h3>
                <p style={{ fontWeight: '600', fontSize: '0.85rem', marginBottom: '10px', color: '#1e1b4b', lineHeight: '1.4' }}>
                  {item.descripcion}
                </p>
              </div>

              <div>
                <p style={{ fontSize: '0.8rem', fontWeight: '800', color: '#be185d', marginBottom: '12px' }}>
                  Propuesto por: {item.autora || 'MichiFan'}
                </p>
                <button 
                  className="retro-button" 
                  style={{ background: '#fff', width: '100%', fontSize: '0.85rem' }}
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