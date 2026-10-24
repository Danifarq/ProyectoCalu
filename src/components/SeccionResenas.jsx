import React, { useState, useEffect } from 'react';
import { db } from '../firebase/configuracionFirebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';

export default function SeccionResenas({ usuarioActivo }) {
  const [resenas, setResenas] = useState([]);
  const [comentario, setComentario] = useState('');
  const [estrellas, setEstrellas] = useState(5);
  const [servicioRecibido, setServicioRecibido] = useState('Nail Art Kapping');

  // Estados para subir idea de diseño
  const [tituloIdea, setTituloIdea] = useState('');
  const [descIdea, setDescIdea] = useState('');
  const [imagenBase64, setImagenBase64] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'resenas'), orderBy('creadoEn', 'desc'));
    const desuscribir = onSnapshot(q, (snapshot) => {
      setResenas(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => desuscribir();
  }, []);

  const promedioEstrellas = resenas.length > 0
    ? (resenas.reduce((acc, r) => acc + (Number(r.estrellas) || 5), 0) / resenas.length).toFixed(1)
    : '5.0';

  const manejarSeleccionImagen = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      if (archivo.size > 1024 * 1024 * 2) {
        alert('La imagen es demasiado grande. Máximo 2MB.');
        return;
      }
      const lector = new FileReader();
      lector.onloadend = () => setImagenBase64(lector.result);
      lector.readAsDataURL(archivo);
    }
  };

  const enviarIdea = async (e) => {
    e.preventDefault();
    if (!tituloIdea || !descIdea) {
      alert('Completa el título y la descripción.');
      return;
    }

    setCargando(true);
    try {
      await addDoc(collection(db, 'ideas_disenos'), {
        titulo: tituloIdea,
        descripcion: descIdea,
        imagenUrl: imagenBase64 || '',
        autora: usuarioActivo ? usuarioActivo.email.split('@')[0] : 'Clienta Anónima',
        aprobado: false,
        creadoEn: serverTimestamp()
      });
      alert('¡Propuesta enviada con éxito! 🐾✨ Quedó pendiente de aprobación.');
      setTituloIdea('');
      setDescIdea('');
      setImagenBase64('');
    } catch (error) {
      console.error(error);
      alert('Error al enviar propuesta.');
    } finally {
      setCargando(false);
    }
  };

  const enviarResena = async (e) => {
    e.preventDefault();
    if (!comentario.trim()) return;

    setCargando(true);
    try {
      await addDoc(collection(db, 'resenas'), {
        autor: usuarioActivo ? usuarioActivo.email.split('@')[0] : 'Clienta Anónima',
        comentario: comentario.trim(),
        estrellas: Number(estrellas),
        servicio: servicioRecibido,
        creadoEn: serverTimestamp()
      });
      setComentario('');
      alert('¡Gracias por tu reseña! 🐾');
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      {/* Banner de Calificación */}
      <div className="retro-card" style={{ padding: '25px', background: '#fbcfe8', marginBottom: '30px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#be185d', marginBottom: '10px' }}>
          ⭐ RESEÑAS Y OPINIONES 🐾
        </h2>
        <div style={{ display: 'inline-block', background: '#fff', padding: '8px 18px', borderRadius: '12px', border: '3px solid #121019' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#eab308' }}>
            {'⭐'.repeat(Math.round(promedioEstrellas))} {promedioEstrellas} / 5.0
          </span>
          <p style={{ fontWeight: '800', fontSize: '0.85rem', color: '#6b7280', marginTop: '3px' }}>
            Basado en {resenas.length} reseñas
          </p>
        </div>
      </div>

      {/* Formulario Propuesta Idea */}
      <div className="retro-card" style={{ padding: '25px', background: '#c084fc', marginBottom: '30px' }}>
        <h3 style={{ fontWeight: '900', color: '#fff', marginBottom: '15px', textAlign: 'center' }}>
          📸 ¡SUBE TU PROPUESTA DE DISEÑO!
        </h3>
        <form onSubmit={enviarIdea} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input 
            type="text" 
            placeholder="Título (Ej: Garritas Neón)" 
            value={tituloIdea} 
            onChange={e => setTituloIdea(e.target.value)}
            style={{ padding: '10px', borderRadius: '8px', border: '3px solid #121019', fontWeight: 'bold' }}
          />
          <textarea 
            placeholder="Descripción..." 
            value={descIdea} 
            onChange={e => setDescIdea(e.target.value)}
            style={{ padding: '10px', borderRadius: '8px', border: '3px solid #121019', fontWeight: 'bold', height: '60px' }}
          />
          <input 
            type="file" 
            accept="image/*" 
            onChange={manejarSeleccionImagen}
            style={{ background: '#fff', padding: '8px', borderRadius: '8px', border: '3px solid #121019', width: '100%', fontWeight: 'bold' }}
          />
          {imagenBase64 && (
            <div style={{ textAlign: 'center' }}>
              <img src={imagenBase64} alt="Previa" style={{ maxHeight: '100px', borderRadius: '6px', border: '2px solid #121019' }} />
            </div>
          )}
          <button type="submit" className="retro-button" style={{ background: '#facc15', padding: '10px' }} disabled={cargando}>
            ✨ ENVIAR PROPUESTA A REVISIÓN
          </button>
        </form>
      </div>

      {/* Formulario Reseña */}
      <div className="retro-card" style={{ padding: '25px', background: '#fff', marginBottom: '30px' }}>
        <h3 style={{ fontWeight: '900', color: '#be185d', marginBottom: '15px', textAlign: 'center' }}>
          ✍️ DEJAR MI RESEÑA
        </h3>
        <form onSubmit={enviarResena} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <select value={estrellas} onChange={e => setEstrellas(e.target.value)} style={{ padding: '8px', borderRadius: '8px', border: '3px solid #121019', fontWeight: 'bold' }}>
              <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
              <option value={4}>⭐⭐⭐⭐ (4/5)</option>
              <option value={3}>⭐⭐⭐ (3/5)</option>
            </select>
            <select value={servicioRecibido} onChange={e => setServicioRecibido(e.target.value)} style={{ padding: '8px', borderRadius: '8px', border: '3px solid #121019', fontWeight: 'bold' }}>
              <option value="Nail Art Kapping">Nail Art Kapping</option>
              <option value="Esmaltado Semipermanente">Esmaltado Semipermanente</option>
              <option value="Set Press-On Custom">Set Press-On Custom</option>
            </select>
          </div>
          <textarea 
            placeholder="Escribe tu opinión..." 
            value={comentario} 
            onChange={e => setComentario(e.target.value)}
            style={{ padding: '10px', borderRadius: '8px', border: '3px solid #121019', fontWeight: 'bold' }}
          />
          <button type="submit" className="retro-button" style={{ background: '#4ade80' }}>
            Publicar Reseña
          </button>
        </form>
      </div>

      {/* Lista de Reseñas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {resenas.map(r => (
          <div key={r.id} className="retro-card" style={{ padding: '15px', background: '#fef08a' }}>
            <h4 style={{ fontWeight: '900' }}>👤 {r.autor} - {'⭐'.repeat(r.estrellas || 5)} <span style={{ fontSize: '0.8rem', color: '#be185d' }}>({r.servicio || 'Servicio General'})</span></h4>
            <p style={{ fontWeight: '600', marginTop: '5px' }}>"{r.comentario}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}