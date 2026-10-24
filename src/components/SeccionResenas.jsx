import React, { useState, useEffect } from 'react';
import { db } from '../firebase/configuracionFirebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';

export default function SeccionResenas({ usuarioActivo }) {
  const [resenas, setResenas] = useState([]);
  const [nombre, setNombre] = useState('');
  const [comentario, setComentario] = useState('');
  const [estrellas, setEstrellas] = useState(5);
  const [servicioRecibido, setServicioRecibido] = useState('Nail Art Kapping');
  const [cargando, setCargando] = useState(false);

  // Escuchar las reseñas en tiempo real desde Firestore
  useEffect(() => {
    const q = query(collection(db, 'resenas'), orderBy('creadoEn', 'desc'));
    const desuscribir = onSnapshot(q, (snapshot) => {
      const listaResenas = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setResenas(listaResenas);
    });

    return () => desuscribir();
  }, []);

  // Calcular el promedio de estrellas
  const promedioEstrellas = resenas.length > 0
    ? (resenas.reduce((acc, r) => acc + (r.estrellas || 5), 0) / resenas.length).toFixed(1)
    : '5.0';

  const enviarResena = async (e) => {
    e.preventDefault();
    if (!comentario.trim()) {
      alert('Por favor, escribe un comentario sobre tu experiencia.');
      return;
    }

    setCargando(true);
    try {
      await addDoc(collection(db, 'resenas'), {
        autor: nombre.trim() || (usuarioActivo ? usuarioActivo.email.split('@')[0] : 'Gatita Anónima'),
        comentario: comentario.trim(),
        estrellas: Number(estrellas),
        servicio: servicioRecibido,
        creadoEn: serverTimestamp()
      });

      setComentario('');
      setNombre('');
      alert('¡Muchas gracias por tu reseña! 🐾✨');
    } catch (error) {
      console.error('Error al guardar la reseña:', error);
      alert('Ocurrió un error al enviar tu comentario.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      {/* Banner Principal de Opiniones */}
      <div className="retro-card" style={{ padding: '30px', background: '#fbcfe8', marginBottom: '30px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#be185d', marginBottom: '10px' }}>
          ⭐ OPINIONES DE NAILEXPERIENCIAS 🐾
        </h2>
        <p style={{ fontWeight: '700', color: '#4338ca', marginBottom: '15px' }}>
          Descubre lo que dicen nuestras clientas sobre sus sets soñados.
        </p>
        
        <div style={{ display: 'inline-block', background: '#fff', padding: '10px 20px', borderRadius: '12px', border: '3px solid #121019' }}>
          <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#eab308' }}>
            {'⭐'.repeat(Math.round(promedioEstrellas))} {promedioEstrellas} / 5.0
          </span>
          <p style={{ fontWeight: '800', fontSize: '0.85rem', color: '#6b7280', marginTop: '3px' }}>
            Basado en {resenas.length} reseñas
          </p>
        </div>
      </div>

      {/* Formulario para Dejar Reseña */}
      <div className="retro-card" style={{ padding: '25px', background: '#fff', marginBottom: '35px' }}>
        <h3 style={{ fontWeight: '900', color: '#be185d', marginBottom: '15px', textAlign: 'center' }}>
          ✍️ ¡DEJA TU RESEÑA!
        </h3>

        <form onSubmit={enviarResena} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '800', marginBottom: '5px' }}>Tu Nombre o Apodo:</label>
              <input 
                type="text" 
                placeholder={usuarioActivo ? usuarioActivo.email.split('@')[0] : "Ej: MichiFan123"} 
                value={nombre} 
                onChange={(e) => setNombre(e.target.value)} 
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '3px solid #121019', fontWeight: 'bold' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: '800', marginBottom: '5px' }}>Calificación:</label>
              <select 
                value={estrellas} 
                onChange={(e) => setEstrellas(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '3px solid #121019', fontWeight: 'bold' }}
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5/5) ¡Amé mi set!</option>
                <option value={4}>⭐⭐⭐⭐ (4/5) Muy lindo</option>
                <option value={3}>⭐⭐⭐ (3/3) Aceptable</option>
                <option value={2}>⭐⭐ (2/5) Regular</option>
                <option value={1}>⭐ (1/5) Mala experiencia</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: '800', marginBottom: '5px' }}>Servicio Realizado:</label>
            <select 
              value={servicioRecibido} 
              onChange={(e) => setServicioRecibido(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '3px solid #121019', fontWeight: 'bold' }}
            >
              <option value="Nail Art Kapping">Nail Art Kapping Gel</option>
              <option value="Esmaltado Semipermanente">Esmaltado Semipermanente</option>
              <option value="Set Press-On Custom">Set Press-On Custom</option>
              <option value="Compra en Tienda Online">Productos de Tienda Online</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: '800', marginBottom: '5px' }}>Tu Comentario:</label>
            <textarea 
              placeholder="Cuéntanos qué tal te pareció el diseño, la atención y el espacio..." 
              value={comentario} 
              onChange={(e) => setComentario(e.target.value)} 
              rows={3} 
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '3px solid #121019', fontWeight: 'bold' }}
            />
          </div>

          <button 
            type="submit" 
            className="retro-button" 
            style={{ background: '#4ade80', fontSize: '1.1rem', padding: '12px' }}
            disabled={cargando}
          >
            {cargando ? 'Publicando...' : '✨ PUBLICAR MI RESEÑA'}
          </button>
        </form>
      </div>

      {/* Lista de Reseñas Publicadas */}
      <h3 style={{ fontWeight: '900', color: '#4338ca', marginBottom: '20px', textAlign: 'center' }}>
        💬 LO QUE DICEN NUESTRAS CLIENTAS
      </h3>

      {resenas.length === 0 ? (
        <p style={{ textAlign: 'center', fontWeight: 'bold', color: '#6b7280' }}>
          ¡Sé la primera en dejar una reseña para Gatitos Nails! 🐾
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {resenas.map((r) => (
            <div key={r.id} className="retro-card" style={{ padding: '20px', background: '#fef08a' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
                <h4 style={{ fontWeight: '900', fontSize: '1.1rem', color: '#1e1b4b' }}>
                  👤 {r.autor} <span style={{ fontSize: '0.85rem', color: '#be185d', fontWeight: '800' }}>({r.servicio})</span>
                </h4>
                <span style={{ fontSize: '1.2rem' }}>
                  {'⭐'.repeat(r.estrellas || 5)}
                </span>
              </div>
              <p style={{ fontWeight: '600', color: '#334155', lineHeight: '1.5' }}>
                "{r.comentario}"
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}