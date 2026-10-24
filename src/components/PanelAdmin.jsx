import React, { useState, useEffect } from 'react';
import { db } from '../firebase/configuracionFirebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export default function PanelAdmin() {
  const [vista, setVista] = useState('ideas'); // 'turnos', 'compras', 'ideas'
  const [turnos, setTurnos] = useState([]);
  const [compras, setCompras] = useState([]);
  const [ideas, setIdeas] = useState([]);

  useEffect(() => {
    const qTurnos = query(collection(db, 'turnos'), orderBy('creadoEn', 'desc'));
    const desuscribirTurnos = onSnapshot(qTurnos, (s) => setTurnos(s.docs.map(d => ({ id: d.id, ...d.data() }))));

    const qCompras = query(collection(db, 'compras'), orderBy('creadoEn', 'desc'));
    const desuscribirCompras = onSnapshot(qCompras, (s) => setCompras(s.docs.map(d => ({ id: d.id, ...d.data() }))));

    const qIdeas = query(collection(db, 'ideas_disenos'), orderBy('creadoEn', 'desc'));
    const desuscribirIdeas = onSnapshot(qIdeas, (s) => setIdeas(s.docs.map(d => ({ id: d.id, ...d.data() }))));

    return () => {
      desuscribirTurnos();
      desuscribirCompras();
      desuscribirIdeas();
    };
  }, []);

  const cambiarAprobacionIdea = async (id, estadoActual) => {
    try {
      await updateDoc(doc(db, 'ideas_disenos', id), { aprobado: !estadoActual });
    } catch (e) {
      console.error('Error al actualizar estado:', e);
    }
  };

  const eliminarRegistro = async (coleccion, id) => {
    if (window.confirm('¿Deseas eliminar este registro de forma permanente?')) {
      try {
        await deleteDoc(doc(db, coleccion, id));
      } catch (e) {
        console.error('Error al eliminar:', e);
      }
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="retro-card" style={{ padding: '30px', background: '#e0e7ff' }}>
        <h2 style={{ fontWeight: '900', marginBottom: '20px', textAlign: 'center', color: '#4338ca' }}>
          👑 PANEL DE ADMINISTRACIÓN
        </h2>

        {/* Botones de navegación del Admin */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '25px', flexWrap: 'wrap' }}>
          <button 
            className="retro-button" 
            style={{ background: vista === 'turnos' ? '#facc15' : '#fff' }}
            onClick={() => setVista('turnos')}
          >
            📅 Turnos ({turnos.length})
          </button>
          <button 
            className="retro-button" 
            style={{ background: vista === 'compras' ? '#facc15' : '#fff' }}
            onClick={() => setVista('compras')}
          >
            🛒 Pedidos ({compras.length})
          </button>
          <button 
            className="retro-button" 
            style={{ background: vista === 'ideas' ? '#facc15' : '#fff' }}
            onClick={() => setVista('ideas')}
          >
            💡 Propuestas de Diseños ({ideas.length})
          </button>
        </div>

        {/* VISTA TURNOS */}
        {vista === 'turnos' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {turnos.length === 0 ? (
              <p style={{ textAlign: 'center', fontWeight: 'bold' }}>No hay turnos agendados aún.</p>
            ) : (
              turnos.map(t => (
                <div key={t.id} style={{ background: '#fff', padding: '12px 18px', borderRadius: '8px', border: '2px solid #121019', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>👤 {t.cliente}</strong> — 💅 {t.servicio} ({t.fecha} a las {t.hora}hs)
                  </div>
                  <button className="retro-button" style={{ background: '#ef4444', color: '#fff', padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => eliminarRegistro('turnos', t.id)}>🗑️</button>
                </div>
              ))
            )}
          </div>
        )}

        {/* VISTA COMPRAS */}
        {vista === 'compras' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {compras.length === 0 ? (
              <p style={{ textAlign: 'center', fontWeight: 'bold' }}>No hay compras registradas.</p>
            ) : (
              compras.map(c => (
                <div key={c.id} style={{ background: '#fff', padding: '12px 18px', borderRadius: '8px', border: '2px solid #121019', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>🛒 {c.comprador}</strong> — Total: ${c.total?.toLocaleString()} ARS
                  </div>
                  <button className="retro-button" style={{ background: '#ef4444', color: '#fff', padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => eliminarRegistro('compras', c.id)}>🗑️</button>
                </div>
              ))
            )}
          </div>
        )}

        {/* VISTA APROBAR IDEAS CON PREVISUALIZACIÓN DE IMAGEN */}
        {vista === 'ideas' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {ideas.length === 0 ? (
              <p style={{ textAlign: 'center', fontWeight: 'bold' }}>Sin propuestas recibidas.</p>
            ) : (
              ideas.map((i) => (
                <div key={i.id} style={{ background: '#fff', border: '3px solid #121019', borderRadius: '12px', padding: '20px', display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                  
                  {/* Vista Previa de la Imagen antes de Aceptar */}
                  <div style={{ flex: '0 0 140px', textAlign: 'center' }}>
                    {i.imagenUrl ? (
                      <div style={{ background: '#f8fafc', padding: '5px', borderRadius: '8px', border: '2px solid #121019' }}>
                        <img 
                          src={i.imagenUrl} 
                          alt={i.titulo} 
                          style={{ width: '130px', height: '130px', objectFit: 'contain', borderRadius: '6px', display: 'block', margin: '0 auto' }} 
                        />
                        <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#475569', display: 'block', marginTop: '4px' }}>Foto Adjunta</span>
                      </div>
                    ) : (
                      <div style={{ width: '130px', height: '130px', borderRadius: '8px', border: '2px dashed #94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontWeight: 'bold', fontSize: '0.8rem' }}>
                        Sin Imagen
                      </div>
                    )}
                  </div>

                  {/* Datos del Diseño */}
                  <div style={{ flex: '1 1 250px' }}>
                    <h4 style={{ fontWeight: '900', fontSize: '1.2rem', color: '#1e1b4b', marginBottom: '5px' }}>💡 {i.titulo}</h4>
                    <p style={{ fontWeight: '600', fontSize: '0.95rem', color: '#334155', lineHeight: '1.4' }}>{i.descripcion}</p>
                    <p style={{ fontSize: '0.85rem', color: '#be185d', fontWeight: '800', marginTop: '6px' }}>Enviado por: {i.autora}</p>
                    
                    <span style={{ display: 'inline-block', marginTop: '8px', padding: '3px 10px', borderRadius: '6px', fontWeight: '900', fontSize: '0.8rem', border: '2px solid #121019', background: i.aprobado ? '#86efac' : '#fca5a5' }}>
                      {i.aprobado ? 'PUBLICADO EN INICIO ✨' : 'PENDIENTE DE REVISIÓN ⏳'}
                    </span>
                  </div>

                  {/* Botones de Acción */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '160px' }}>
                    <button 
                      className="retro-button" 
                      style={{ background: i.aprobado ? '#fdba74' : '#4ade80', padding: '8px', fontSize: '0.85rem', width: '100%' }} 
                      onClick={() => cambiarAprobacionIdea(i.id, i.aprobado)}
                    >
                      {i.aprobado ? '🙈 Ocultar' : '✨ Aprobar y Mostrar'}
                    </button>
                    <button 
                      className="retro-button" 
                      style={{ background: '#ef4444', color: '#fff', padding: '8px', fontSize: '0.85rem', width: '100%' }} 
                      onClick={() => eliminarRegistro('ideas_disenos', i.id)}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}