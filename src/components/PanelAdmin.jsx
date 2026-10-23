import React, { useState, useEffect } from 'react';
import { db } from '../firebase/configuracionFirebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export default function PanelAdmin() {
  const [vista, setVista] = useState('turnos'); // 'turnos' o 'compras'
  const [turnos, setTurnos] = useState([]);
  const [compras, setCompras] = useState([]);

  // Cargar turnos en tiempo real
  useEffect(() => {
    const qTurnos = query(collection(db, 'turnos'), orderBy('creadoEn', 'desc'));
    const desuscribirTurnos = onSnapshot(qTurnos, (snapshot) => {
      setTurnos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qCompras = query(collection(db, 'compras'), orderBy('creadoEn', 'desc'));
    const desuscribirCompras = onSnapshot(qCompras, (snapshot) => {
      setCompras(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      desuscribirTurnos();
      desuscribirCompras();
    };
  }, []);

  const cambiarEstado = async (coleccion, id, nuevoEstado) => {
    try {
      await updateDoc(doc(db, coleccion, id), { estado: nuevoEstado });
    } catch (error) {
      console.error("Error al actualizar estado: ", error);
    }
  };

  const eliminarRegistro = async (coleccion, id) => {
    if (window.confirm('¿Deseas eliminar este registro?')) {
      try {
        await deleteDoc(doc(db, coleccion, id));
      } catch (error) {
        console.error("Error al eliminar: ", error);
      }
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="retro-card" style={{ padding: '30px', background: '#e0e7ff' }}>
        <h2 style={{ fontWeight: '900', marginBottom: '20px', textAlign: 'center', color: '#4338ca' }}>
          👑 PANEL DE ADMINISTRACIÓN
        </h2>

        {/* Selector de Vistas */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '25px' }}>
          <button 
            className="retro-button" 
            style={{ background: vista === 'turnos' ? '#facc15' : '#fff' }}
            onClick={() => setVista('turnos')}
          >
            📅 Agenda de Turnos ({turnos.length})
          </button>
          <button 
            className="retro-button" 
            style={{ background: vista === 'compras' ? '#facc15' : '#fff' }}
            onClick={() => setVista('compras')}
          >
            🛒 Pedidos Tienda ({compras.length})
          </button>
        </div>

        {/* VISTA TURNOS */}
        {vista === 'turnos' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {turnos.length === 0 ? <p style={{ textAlign: 'center', fontWeight: 'bold' }}>Sin turnos registrados.</p> : turnos.map((t) => (
              <div key={t.id} style={{ background: '#fff', border: '3px solid #121019', borderRadius: '12px', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h4 style={{ fontWeight: '900' }}>👤 {t.cliente}</h4>
                  <p style={{ fontWeight: '600' }}>💅 Servicio: {t.servicio}</p>
                  <p style={{ fontWeight: '600' }}>📅 Fecha: {t.fecha} - {t.hora} hs</p>
                  <span style={{ display: 'inline-block', marginTop: '5px', padding: '3px 8px', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.8rem', border: '2px solid #121019', background: t.estado === 'confirmado' ? '#86efac' : '#fef08a' }}>
                    {t.estado ? t.estado.toUpperCase() : 'PENDIENTE'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="retro-button" style={{ background: '#4ade80', padding: '5px 10px', fontSize: '0.8rem' }} onClick={() => cambiarEstado('turnos', t.id, 'confirmado')}>Confirmar</button>
                  <button className="retro-button" style={{ background: '#ef4444', color: '#fff', padding: '5px 10px', fontSize: '0.8rem' }} onClick={() => eliminarRegistro('turnos', t.id)}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* VISTA COMPRAS */}
        {vista === 'compras' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {compras.length === 0 ? <p style={{ textAlign: 'center', fontWeight: 'bold' }}>Sin compras registradas.</p> : compras.map((c) => (
              <div key={c.id} style={{ background: '#fff', border: '3px solid #121019', borderRadius: '12px', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h4 style={{ fontWeight: '900' }}>🛒 Cliente: {c.usuario}</h4>
                  <p style={{ fontWeight: '600', color: '#4338ca' }}>Total: ${c.total ? c.total.toLocaleString() : 0} ARS</p>
                  <div style={{ fontSize: '0.85rem', marginTop: '5px' }}>
                    <strong>Productos:</strong>
                    <ul style={{ paddingLeft: '20px' }}>
                      {c.productos && c.productos.map((p, idx) => (
                        <li key={idx}>{p.nombre} x{p.cantidad} (${p.precio})</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="retro-button" style={{ background: '#4ade80', padding: '5px 10px', fontSize: '0.8rem' }} onClick={() => cambiarEstado('compras', c.id, 'entregado')}>Entregado</button>
                  <button className="retro-button" style={{ background: '#ef4444', color: '#fff', padding: '5px 10px', fontSize: '0.8rem' }} onClick={() => eliminarRegistro('compras', c.id)}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}