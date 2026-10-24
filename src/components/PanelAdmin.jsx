import React, { useState, useEffect } from 'react';
import { db } from '../firebase/configuracionFirebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export default function PanelAdmin() {
  const [vista, setVista] = useState('usuarios'); // 'turnos', 'compras', 'ideas', 'usuarios'
  const [turnos, setTurnos] = useState([]);
  const [compras, setCompras] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  // Escuchar en tiempo real todas las colecciones
  useEffect(() => {
    const qTurnos = query(collection(db, 'turnos'), orderBy('creadoEn', 'desc'));
    const desuscribirTurnos = onSnapshot(qTurnos, (s) => setTurnos(s.docs.map(d => ({ id: d.id, ...d.data() }))));

    const qCompras = query(collection(db, 'compras'), orderBy('creadoEn', 'desc'));
    const desuscribirCompras = onSnapshot(qCompras, (s) => setCompras(s.docs.map(d => ({ id: d.id, ...d.data() }))));

    const qIdeas = query(collection(db, 'ideas_disenos'), orderBy('creadoEn', 'desc'));
    const desuscribirIdeas = onSnapshot(qIdeas, (s) => setIdeas(s.docs.map(d => ({ id: d.id, ...d.data() }))));

    const qUsuarios = query(collection(db, 'usuarios'));
    const desuscribirUsuarios = onSnapshot(qUsuarios, (s) => setUsuarios(s.docs.map(d => ({ id: d.id, ...d.data() }))));

    return () => {
      desuscribirTurnos();
      desuscribirCompras();
      desuscribirIdeas();
      desuscribirUsuarios();
    };
  }, []);

  // Cambiar estado de Turno
  const cambiarEstadoTurno = async (id, estadoActual) => {
    const nuevoEstado = estadoActual === 'completado' ? 'pendiente' : 'completado';
    try {
      await updateDoc(doc(db, 'turnos', id), { estado: nuevoEstado });
    } catch (e) {
      console.error(e);
    }
  };

  // Cambiar estado de Compra
  const cambiarEstadoCompra = async (id, estadoActual) => {
    const nuevoEstado = estadoActual === 'entregado' ? 'pendiente' : 'entregado';
    try {
      await updateDoc(doc(db, 'compras', id), { estado: nuevoEstado });
    } catch (e) {
      console.error(e);
    }
  };

  // Cambiar estado de Propuesta de Diseño
  const cambiarAprobacionIdea = async (id, estadoActual) => {
    try {
      await updateDoc(doc(db, 'ideas_disenos', id), { aprobado: !estadoActual });
    } catch (e) {
      console.error(e);
    }
  };

  // ASIGNAR O MODIFICAR CLIENTA FIEL CON TIEMPO DE EXPIRACIÓN
  const asignarClientaFiel = async (userId, meses) => {
    try {
      let fechaVencimiento = null;

      if (meses > 0) {
        const hoy = new Date();
        hoy.setMonth(hoy.getMonth() + Number(meses));
        fechaVencimiento = hoy.toISOString(); // Guardar fecha exacta de vencimiento
      }

      await updateDoc(doc(db, 'usuarios', userId), {
        esClientaFiel: meses > 0,
        vencimientoClientaFiel: fechaVencimiento
      });

      alert(meses > 0 ? `¡Beneficio otorgado por ${meses} mes(es)! 👑` : 'Beneficio de Clienta Fiel removido.');
    } catch (error) {
      console.error('Error al actualizar Clienta Fiel:', error);
      alert('Ocurrió un error al actualizar la membresía.');
    }
  };

  // Eliminar cualquier registro
  const eliminarRegistro = async (coleccion, id) => {
    if (window.confirm('¿Deseas eliminar este registro?')) {
      try {
        await deleteDoc(doc(db, coleccion, id));
      } catch (e) {
        console.error(e);
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
            style={{ background: vista === 'usuarios' ? '#facc15' : '#fff' }}
            onClick={() => setVista('usuarios')}
          >
            👥 Clientas Fieles ({usuarios.length})
          </button>
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
            💡 Propuestas ({ideas.length})
          </button>
        </div>

        {/* VISTA: GESTIÓN DE CLIENTAS FIELES Y TIEMPO */}
        {vista === 'usuarios' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h3 style={{ fontWeight: '900', color: '#1e1b4b', marginBottom: '10px' }}>👑 Control de Membresías "Clienta Fiel"</h3>
            {usuarios.length === 0 ? (
              <p style={{ textAlign: 'center', fontWeight: 'bold' }}>No hay usuarios registrados aún.</p>
            ) : (
              usuarios.map((u) => {
                const tieneBeneficio = u.esClientaFiel && (!u.vencimientoClientaFiel || new Date(u.vencimientoClientaFiel) > new Date());
                const fechaFormateada = u.vencimientoClientaFiel 
                  ? new Date(u.vencimientoClientaFiel).toLocaleDateString() 
                  : 'Indefinido';

                return (
                  <div key={u.id} style={{ background: '#fff', border: '3px solid #121019', borderRadius: '12px', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                    <div>
                      <h4 style={{ fontWeight: '900', fontSize: '1.05rem', color: '#1e1b4b' }}>👤 {u.email}</h4>
                      <p style={{ fontWeight: '700', fontSize: '0.85rem', color: '#475569', marginTop: '3px' }}>
                        Puntos acumulados: <strong>{u.puntos || 0} Pts</strong>
                      </p>
                      <span style={{ display: 'inline-block', marginTop: '6px', padding: '2px 8px', borderRadius: '8px', fontWeight: '900', fontSize: '0.8rem', border: '2px solid #121019', background: tieneBeneficio ? '#fef08a' : '#e2e8f0' }}>
                        {tieneBeneficio ? `👑 Clienta Fiel (Vence: ${fechaFormateada})` : '👤 Clienta Estándar'}
                      </span>
                    </div>

                    {/* Selector de Duración y Acciones */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <select 
                        defaultValue="" 
                        onChange={(e) => {
                          if (e.target.value !== "") {
                            asignarClientaFiel(u.id, Number(e.target.value));
                            e.target.value = "";
                          }
                        }}
                        style={{ padding: '8px', borderRadius: '8px', border: '2px solid #121019', fontWeight: 'bold', fontSize: '0.85rem' }}
                      >
                        <option value="" disabled>Otorgar beneficio por...</option>
                        <option value="1">1 Mes 🗓️</option>
                        <option value="3">3 Meses 🗓️</option>
                        <option value="6">6 Meses 🗓️</option>
                        <option value="12">1 Año 🗓️</option>
                        <option value="999">Indefinido 👑</option>
                      </select>

                      {tieneBeneficio && (
                        <button 
                          className="retro-button" 
                          style={{ background: '#ef4444', color: '#fff', padding: '8px 12px', fontSize: '0.85rem' }} 
                          onClick={() => asignarClientaFiel(u.id, 0)}
                        >
                          ❌ Sacar Beneficio
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* VISTA TURNOS */}
        {vista === 'turnos' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {turnos.map((t) => (
              <div key={t.id} style={{ background: '#fff', border: '3px solid #121019', borderRadius: '12px', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                  <h4 style={{ fontWeight: '900', color: '#be185d' }}>💅 {t.servicio}</h4>
                  <p style={{ fontWeight: '700', fontSize: '0.9rem' }}>👤 Cliente: {t.cliente}</p>
                  <p style={{ fontWeight: '800', fontSize: '0.9rem', color: '#4338ca' }}>📅 {t.fecha} - {t.hora} hs</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="retro-button" style={{ background: t.estado === 'completado' ? '#86efac' : '#fca5a5', padding: '8px 12px', fontSize: '0.85rem' }} onClick={() => cambiarEstadoTurno(t.id, t.estado)}>
                    {t.estado === 'completado' ? '✅ Asistió' : '⏳ Marcar Asistido'}
                  </button>
                  <button className="retro-button" style={{ background: '#ef4444', color: '#fff', padding: '8px 12px', fontSize: '0.85rem' }} onClick={() => eliminarRegistro('turnos', t.id)}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* VISTA COMPRAS */}
        {vista === 'compras' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {compras.map((c) => (
              <div key={c.id} style={{ background: '#fff', border: '3px solid #121019', borderRadius: '12px', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                  <h4 style={{ fontWeight: '900' }}>👤 Comprador: {c.comprador}</h4>
                  <p style={{ fontWeight: '800', color: '#16a34a' }}>Total: ${c.total?.toLocaleString()} ARS</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="retro-button" style={{ background: c.estado === 'entregado' ? '#86efac' : '#fdb174', padding: '8px 12px', fontSize: '0.85rem' }} onClick={() => cambiarEstadoCompra(c.id, c.estado)}>
                    {c.estado === 'entregado' ? '📦 Entregado' : '⏳ Marcar Entregado'}
                  </button>
                  <button className="retro-button" style={{ background: '#ef4444', color: '#fff', padding: '8px 12px', fontSize: '0.85rem' }} onClick={() => eliminarRegistro('compras', c.id)}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* VISTA PROPUESTAS */}
        {vista === 'ideas' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {ideas.map((i) => (
              <div key={i.id} style={{ background: '#fff', border: '3px solid #121019', borderRadius: '12px', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                  <h4 style={{ fontWeight: '900' }}>💡 {i.titulo}</h4>
                  <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>{i.descripcion}</p>
                  <p style={{ fontSize: '0.8rem', color: '#be185d', fontWeight: 'bold' }}>Por: {i.autora}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="retro-button" style={{ background: i.aprobado ? '#fdba74' : '#4ade80', padding: '6px 12px', fontSize: '0.85rem' }} onClick={() => cambiarAprobacionIdea(i.id, i.aprobado)}>
                    {i.aprobado ? '🙈 Ocultar' : '✨ Aprobar'}
                  </button>
                  <button className="retro-button" style={{ background: '#ef4444', color: '#fff', padding: '6px 12px', fontSize: '0.85rem' }} onClick={() => eliminarRegistro('ideas_disenos', i.id)}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}