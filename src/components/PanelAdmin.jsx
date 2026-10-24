import React, { useState, useEffect } from 'react';
import { db } from '../firebase/configuracionFirebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export default function PanelAdmin() {
  const [vista, setVista] = useState('turnos'); // 'turnos', 'compras', 'ideas'
  const [turnos, setTurnos] = useState([]);
  const [compras, setCompras] = useState([]);
  const [ideas, setIdeas] = useState([]);

  // Escuchar en tiempo real todas las colecciones desde Firestore
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

  // Cambiar estado de Turno (Pendiente -> Completado / Asistió)
  const cambiarEstadoTurno = async (id, estadoActual) => {
    const nuevoEstado = estadoActual === 'completado' ? 'pendiente' : 'completado';
    try {
      await updateDoc(doc(db, 'turnos', id), { estado: nuevoEstado });
    } catch (e) {
      console.error('Error al actualizar estado del turno:', e);
    }
  };

  // Cambiar estado de Pedido de Tienda (Pendiente -> Entregado)
  const cambiarEstadoCompra = async (id, estadoActual) => {
    const nuevoEstado = estadoActual === 'entregado' ? 'pendiente' : 'entregado';
    try {
      await updateDoc(doc(db, 'compras', id), { estado: nuevoEstado });
    } catch (e) {
      console.error('Error al actualizar estado de la compra:', e);
    }
  };

  // Cambiar estado de Publicación de Propuesta de Diseño
  const cambiarAprobacionIdea = async (id, estadoActual) => {
    try {
      await updateDoc(doc(db, 'ideas_disenos', id), { aprobado: !estadoActual });
    } catch (e) {
      console.error('Error al actualizar estado de la propuesta:', e);
    }
  };

  // Eliminar cualquier registro
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
    <div style={{ maxWidth: '950px', margin: '0 auto' }}>
      <div className="retro-card" style={{ padding: '30px', background: '#e0e7ff' }}>
        <h2 style={{ fontWeight: '900', marginBottom: '20px', textAlign: 'center', color: '#4338ca', fontSize: '2rem' }}>
          👑 PANEL DE ADMINISTRACIÓN
        </h2>

        {/* Botones de Navegación del Panel Admin */}
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
            🛒 Pedidos Tienda ({compras.length})
          </button>
          <button 
            className="retro-button" 
            style={{ background: vista === 'ideas' ? '#facc15' : '#fff' }}
            onClick={() => setVista('ideas')}
          >
            💡 Propuestas de Diseños ({ideas.length})
          </button>
        </div>

        {/* VISTA 1: GESTIÓN DE TURNOS Y ASISTENCIA */}
        {vista === 'turnos' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h3 style={{ fontWeight: '900', color: '#1e1b4b', marginBottom: '10px' }}>📋 Agenda de Turnos Solicitados</h3>
            {turnos.length === 0 ? (
              <p style={{ textAlign: 'center', fontWeight: 'bold', padding: '15px' }}>No hay turnos registrados aún. 🐾</p>
            ) : (
              turnos.map((t) => (
                <div key={t.id} style={{ background: '#fff', border: '3px solid #121019', borderRadius: '12px', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                  <div>
                    <h4 style={{ fontWeight: '900', fontSize: '1.1rem', color: '#be185d' }}>💅 {t.servicio}</h4>
                    <p style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1e1b4b' }}>👤 Cliente: {t.cliente}</p>
                    <p style={{ fontWeight: '800', fontSize: '0.9rem', color: '#4338ca' }}>📅 Fecha: {t.fecha} - {t.hora} hs</p>
                    {t.esClientaFiel && (
                      <span style={{ background: '#fef08a', border: '2px solid #121019', padding: '2px 8px', borderRadius: '10px', fontWeight: '900', fontSize: '0.75rem', marginTop: '5px', display: 'inline-block' }}>
                        👑 Clienta Fiel
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <button 
                      className="retro-button" 
                      style={{ background: t.estado === 'completado' ? '#86efac' : '#fca5a5', padding: '8px 14px', fontSize: '0.85rem' }} 
                      onClick={() => cambiarEstadoTurno(t.id, t.estado)}
                    >
                      {t.estado === 'completado' ? '✅ Asistencia Confirmada' : '⏳ Marcar Asistido / Completado'}
                    </button>
                    <button 
                      className="retro-button" 
                      style={{ background: '#ef4444', color: '#fff', padding: '8px 12px', fontSize: '0.85rem' }} 
                      onClick={() => eliminarRegistro('turnos', t.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* VISTA 2: GESTIÓN DE PEDIDOS Y VOUCHERS DE TIENDA */}
        {vista === 'compras' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h3 style={{ fontWeight: '900', color: '#1e1b4b', marginBottom: '10px' }}>🛒 Pedidos y Vouchers Comprados</h3>
            {compras.length === 0 ? (
              <p style={{ textAlign: 'center', fontWeight: 'bold', padding: '15px' }}>No hay compras registradas en la tienda. 🐾</p>
            ) : (
              compras.map((c) => (
                <div key={c.id} style={{ background: '#fff', border: '3px solid #121019', borderRadius: '12px', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                  <div style={{ maxWidth: '450px' }}>
                    <h4 style={{ fontWeight: '900', fontSize: '1.05rem', color: '#1e1b4b' }}>👤 Comprador: {c.comprador}</h4>
                    <p style={{ fontWeight: '800', fontSize: '0.95rem', color: '#16a34a', margin: '4px 0' }}>
                      Total: ${c.total?.toLocaleString()} ARS
                    </p>
                    
                    {/* Lista de productos incluidos */}
                    <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginTop: '6px' }}>
                      <strong>Artículos:</strong> {c.productos?.map(p => `${p.nombre} (x${p.cantidad})`).join(', ')}
                    </div>

                    {/* Si la compra incluye un Voucher de Regalo */}
                    {c.datosVoucher && (
                      <div style={{ background: '#fef08a', border: '2px solid #121019', padding: '8px 12px', borderRadius: '8px', marginTop: '8px', fontSize: '0.85rem' }}>
                        <p>🎁 <strong>Voucher para:</strong> {c.datosVoucher.paraNombre} ({c.datosVoucher.paraEmail})</p>
                        <p>🔑 <strong>Código Generado:</strong> <code style={{ background: '#fff', padding: '2px 6px', borderRadius: '4px', border: '1px solid #121019' }}>{c.datosVoucher.codigo}</code></p>
                        {c.datosVoucher.mensaje && <p>💬 <i>"{c.datosVoucher.mensaje}"</i></p>}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <button 
                      className="retro-button" 
                      style={{ background: c.estado === 'entregado' ? '#86efac' : '#fdb174', padding: '8px 14px', fontSize: '0.85rem' }} 
                      onClick={() => cambiarEstadoCompra(c.id, c.estado)}
                    >
                      {c.estado === 'entregado' ? '📦 Entregado' : '⏳ Marcar Entregado / Despachado'}
                    </button>
                    <button 
                      className="retro-button" 
                      style={{ background: '#ef4444', color: '#fff', padding: '8px 12px', fontSize: '0.85rem' }} 
                      onClick={() => eliminarRegistro('compras', c.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* VISTA 3: APROBAR IDEAS / PROPUESTAS CON PREVISUALIZACIÓN */}
        {vista === 'ideas' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontWeight: '900', color: '#1e1b4b', marginBottom: '10px' }}>💡 Moderación de Propuestas de Diseños</h3>
            {ideas.length === 0 ? (
              <p style={{ textAlign: 'center', fontWeight: 'bold', padding: '15px' }}>Sin propuestas recibidas. 🐾</p>
            ) : (
              ideas.map((i) => (
                <div key={i.id} style={{ background: '#fff', border: '3px solid #121019', borderRadius: '12px', padding: '20px', display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                  
                  {/* Vista Previa de la Imagen */}
                  <div style={{ flex: '0 0 130px', textAlign: 'center' }}>
                    {i.imagenUrl ? (
                      <div style={{ background: '#f8fafc', padding: '4px', borderRadius: '8px', border: '2px solid #121019' }}>
                        <img 
                          src={i.imagenUrl} 
                          alt={i.titulo} 
                          style={{ width: '120px', height: '120px', objectFit: 'contain', borderRadius: '6px', display: 'block', margin: '0 auto' }} 
                        />
                        <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#475569', display: 'block', marginTop: '4px' }}>Foto Adjunta</span>
                      </div>
                    ) : (
                      <div style={{ width: '120px', height: '120px', borderRadius: '8px', border: '2px dashed #94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontWeight: 'bold', fontSize: '0.8rem' }}>
                        Sin Imagen
                      </div>
                    )}
                  </div>

                  {/* Datos del Diseño */}
                  <div style={{ flex: '1 1 250px' }}>
                    <h4 style={{ fontWeight: '900', fontSize: '1.15rem', color: '#1e1b4b', marginBottom: '5px' }}>💡 {i.titulo}</h4>
                    <p style={{ fontWeight: '600', fontSize: '0.9rem', color: '#334155', lineHeight: '1.4' }}>{i.descripcion}</p>
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