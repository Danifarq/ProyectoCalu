import React, { useState, useEffect } from 'react';
import { db } from '../firebase/configuracionFirebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export default function PanelAdmin() {
  const [turnos, setTurnos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Escuchar la colección 'turnos' de Firestore en tiempo real
  useEffect(() => {
    const q = query(collection(db, 'turnos'), orderBy('creadoEn', 'desc'));
    
    const desuscribir = onSnapshot(q, (snapshot) => {
      const listaTurnos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTurnos(listaTurnos);
      setCargando(false);
    }, (error) => {
      console.error("Error al obtener turnos: ", error);
      setCargando(false);
    });

    return () => desuscribir();
  }, []);

  // Cambiar estado del turno (ej: Confirmar o Cancelar)
  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      const turnoRef = doc(db, 'turnos', id);
      await updateDoc(turnoRef, { estado: nuevoEstado });
    } catch (error) {
      console.error("Error al actualizar el estado: ", error);
    }
  };

  // Eliminar un turno de Firestore
  const eliminarTurno = async (id) => {
    if (window.confirm('¿Segura que deseas eliminar este turno?')) {
      try {
        await deleteDoc(doc(db, 'turnos', id));
      } catch (error) {
        console.error("Error al eliminar turno: ", error);
      }
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="retro-card" style={{ padding: '30px', background: '#e0e7ff' }}>
        <h2 style={{ fontWeight: '900', marginBottom: '20px', textAlign: 'center', color: '#4338ca' }}>
          👑 PANEL DE ADMINISTRACIÓN DE TURNOS
        </h2>

        {cargando ? (
          <p style={{ textAlign: 'center', fontWeight: 'bold' }}>Cargando agenda de turnos...</p>
        ) : turnos.length === 0 ? (
          <p style={{ textAlign: 'center', fontWeight: 'bold', color: '#6b7280' }}>
            No hay turnos registrados todavía. 🐾
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {turnos.map((turno) => (
              <div 
                key={turno.id} 
                style={{
                  background: '#ffffff',
                  border: '3px solid #121019',
                  borderRadius: '12px',
                  padding: '15px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}
              >
                <div>
                  <h4 style={{ fontWeight: '900', fontSize: '1.1rem', color: '#1e1b4b' }}>
                    👤 {turno.cliente || 'Cliente sin nombre'}
                  </h4>
                  <p style={{ fontWeight: '600', color: '#374151', margin: '4px 0' }}>
                    💅 <strong>Servicio:</strong> {turno.servicio}
                  </p>
                  <p style={{ fontWeight: '600', color: '#374151' }}>
                    📅 <strong>Fecha/Hora:</strong> {turno.fecha} a las {turno.hora} hs
                  </p>
                  <span style={{
                    display: 'inline-block',
                    marginTop: '8px',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontWeight: '800',
                    fontSize: '0.85rem',
                    border: '2px solid #121019',
                    background: turno.estado === 'confirmado' ? '#86efac' : turno.estado === 'cancelado' ? '#fca5a5' : '#fef08a'
                  }}>
                    Estado: {turno.estado ? turno.estado.toUpperCase() : 'PENDIENTE'}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button 
                    className="retro-button" 
                    style={{ background: '#4ade80', fontSize: '0.85rem', padding: '6px 12px' }}
                    onClick={() => cambiarEstado(turno.id, 'confirmado')}
                  >
                    Confirmar
                  </button>
                  <button 
                    className="retro-button" 
                    style={{ background: '#f87171', fontSize: '0.85rem', padding: '6px 12px' }}
                    onClick={() => cambiarEstado(turno.id, 'cancelado')}
                  >
                    Cancelar
                  </button>
                  <button 
                    className="retro-button" 
                    style={{ background: '#ef4444', color: '#fff', fontSize: '0.85rem', padding: '6px 12px' }}
                    onClick={() => eliminarTurno(turno.id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}