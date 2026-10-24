import React, { useState, useEffect } from 'react';
import { db } from '../firebase/configuracionFirebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';

export default function SeccionResenas({ usuarioActivo }) {
  const [resenas, setResenas] = useState([]);
  const [comentario, setComentario] = useState('');
  const [estrellas, setEstrellas] = useState(5);

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

  // Convertir el archivo seleccionado por la clienta a formato Base64
  const manejarSeleccionImagen = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      if (archivo.size > 1024 * 1024 * 2) { // Límite de 2MB
        alert('La imagen es demasiado grande. Selecciona un archivo menor a 2MB.');
        return;
      }
      const lector = new FileReader();
      lector.onloadend = () => {
        setImagenBase64(lector.result);
      };
      lector.readAsDataURL(archivo);
    }
  };

  const enviarIdea = async (e) => {
    e.preventDefault();
    if (!tituloIdea || !descIdea) {
      alert('Por favor completa el título y la descripción de tu propuesta.');
      return;
    }

    setCargando(true);
    try {
      await addDoc(collection(db, 'ideas_disenos'), {
        titulo: tituloIdea,
        descripcion: descIdea,
        imagenUrl: imagenBase64 || '',
        autora: usuarioActivo ? usuarioActivo.email.split('@')[0] : 'Clienta Anónima',
        aprobado: false, // Inicia pendiente hasta aprobación por Admin
        creadoEn: serverTimestamp()
      });

      alert('¡Idea enviada con éxito! 🐾✨ La revisaremos para destacarla en la portada.');
      setTituloIdea('');
      setDescIdea('');
      setImagenBase64('');
    } catch (error) {
      console.error('Error al subir idea:', error);
      alert('Ocurrió un error al enviar tu propuesta.');
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
        creadoEn: serverTimestamp()
      });
      setComentario('');
      alert('¡Muchas gracias por tu reseña! 🐾');
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      {/* FORMULARIO DE PROPUESTA DE DISEÑO */}
      <div className="retro-card" style={{ padding: '25px', background: '#c084fc', marginBottom: '30px' }}>
        <h3 style={{ fontWeight: '900', color: '#fff', marginBottom: '15px', textAlign: 'center' }}>
          📸 ¡SUBE TU PROPUESTA DE DISEÑO DE UÑAS!
        </h3>
        <p style={{ color: '#fff', fontWeight: '700', textAlign: 'center', marginBottom: '15px', fontSize: '0.9rem' }}>
          Selecciona una foto desde tu dispositivo. Las propuestas aprobadas se mostrarán en los "Diseños Destacados" de la portada.
        </p>

        <form onSubmit={enviarIdea} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input 
            type="text" 
            placeholder="Título de la idea (Ej: Garritas Pastel Neón)" 
            value={tituloIdea} 
            onChange={e => setTituloIdea(e.target.value)}
            style={{ padding: '10px', borderRadius: '8px', border: '3px solid #121019', fontWeight: 'bold' }}
          />

          <textarea 
            placeholder="Descripción detallada (colores, cristales, estilo...)" 
            value={descIdea} 
            onChange={e => setDescIdea(e.target.value)}
            style={{ padding: '10px', borderRadius: '8px', border: '3px solid #121019', fontWeight: 'bold', height: '60px' }}
          />

          {/* Campo de archivo local */}
          <div>
            <label style={{ display: 'block', color: '#fff', fontWeight: '800', marginBottom: '5px' }}>
              Subir Foto desde tu dispositivo:
            </label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={manejarSeleccionImagen}
              style={{ background: '#fff', padding: '8px', borderRadius: '8px', border: '3px solid #121019', width: '100%', fontWeight: 'bold' }}
            />
          </div>

          {/* Vista previa de la imagen cargada */}
          {imagenBase64 && (
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <p style={{ color: '#fff', fontWeight: 'bold', fontSize: '0.85rem' }}>Vista previa:</p>
              <img 
                src={imagenBase64} 
                alt="Vista previa" 
                style={{ maxHeight: '120px', borderRadius: '8px', border: '2px solid #121019', marginTop: '5px' }} 
              />
            </div>
          )}

          <button 
            type="submit" 
            className="retro-button" 
            style={{ background: '#facc15', fontSize: '1rem', padding: '10px', marginTop: '10px' }}
            disabled={cargando}
          >
            ✨ ENVIAR PROPUESTA A REVISIÓN
          </button>
        </form>
      </div>

      {/* SECCIÓN DE RESEÑAS */}
      <div className="retro-card" style={{ padding: '25px', background: '#fff', marginBottom: '30px' }}>
        <h3 style={{ fontWeight: '900', color: '#be185d', marginBottom: '15px', textAlign: 'center' }}>
          ⭐ DEJAR RESEÑA DEL SERVICIO
        </h3>
        <form onSubmit={enviarResena} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <select 
            value={estrellas} 
            onChange={e => setEstrellas(e.target.value)}
            style={{ padding: '10px', borderRadius: '8px', border: '3px solid #121019', fontWeight: 'bold' }}
          >
            <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
            <option value={4}>⭐⭐⭐⭐ (4/5)</option>
            <option value={3}>⭐⭐⭐ (3/5)</option>
          </select>
          <textarea 
            placeholder="Escribe tu opinión sobre la atención y el espacio..." 
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
            <h4 style={{ fontWeight: '900' }}>👤 {r.autor} - {'⭐'.repeat(r.estrellas || 5)}</h4>
            <p style={{ fontWeight: '600' }}>"{r.comentario}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}