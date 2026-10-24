import React, { useState, useEffect } from 'react';
import { db } from '../firebase/configuracionFirebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';

export default function SeccionTurnos({ usuarioActivo, datosUsuario, setPuntos }) {
  const [servicio, setServicio] = useState('Nail Art Kapping');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('14:00');
  const [turnos, setTurnos] = useState([]);
  const [cargando, setCargando] = useState(false);

  // Escuchar turnos agendados desde Firestore
  useEffect(() => {
    const q = query(collection(db, 'turnos'), orderBy('creadoEn', 'desc'));
    const desuscribir = onSnapshot(q, (snapshot) => {
      const listaTurnos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTurnos(listaTurnos);
    });

    return () => desuscribir();
  }, []);

  const esClientaFiel = datosUsuario?.esClientaFiel || (datosUsuario?.mesesSeguidos >= 7);

  const agendarTurno = async (e) => {
    e.preventDefault();
    if (!fecha || !hora) {
      alert('Por favor selecciona una fecha y horario.');
      return;
    }

    setCargando(true);
    try {
      await addDoc(collection(db, 'turnos'), {
        cliente: usuarioActivo ? usuarioActivo.email : 'Cliente Invitado',
        servicio,
        fecha,
        hora,
        estado: 'pendiente',
        esClientaFiel,
        creadoEn: serverTimestamp()
      });

      // Sumar puntos por agendar
      if (setPuntos) {
        setPuntos(prev => prev + 100);
      }

      alert('¡Turno reservado con éxito! 🐾✨ Ganaste +100 puntos VIP.');
      setFecha('');
    } catch (error) {
      console.error('Error al agendar turno:', error);
      alert('Hubo un error al guardar tu turno.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div className="retro-card" style={{ padding: '30px', background: '#fbcfe8', marginBottom: '25px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#be185d', marginBottom: '10px' }}>
          📅 AGENDA TU TURNO 🐾
        </h2>
        <p style={{ fontWeight: '700', color: '#4338ca' }}>
          Elige tu servicio y reserva tu horario en tiempo real.
        </p>
      </div>

      {/* Cartel Informativo de Clienta Fiel */}
      {esClientaFiel ? (
        <div style={{ background: '#fef08a', border: '3px solid #121019', borderRadius: '12px', padding: '15px', marginBottom: '25px', fontWeight: 'bold', color: '#854d0e', textAlign: 'center' }}>
          👑 <strong>¡BENEFICIO CLIENTA FIEL ACTIVO!</strong> Tienes acceso a la agenda del próximo mes 1 semana antes que el público general.
        </div>
      ) : (
        <div style={{ background: '#e0e7ff', border: '3px solid #121019', borderRadius: '12px', padding: '15px', marginBottom: '25px', fontWeight: 'bold', color: '#3730a3', textAlign: 'center' }}>
          ℹ️ La agenda del próximo mes se abre 7 días antes solo para <strong>Clientas Fieles 👑</strong>. ¡Suma 7 meses seguidos o activa tu membresía desde tu Perfil!
        </div>
      )}

      {/* Formulario de Reserva */}
      <div className="retro-card" style={{ padding: '25px', background: '#fff', marginBottom: '30px' }}>
        <form onSubmit={agendarTurno} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '800', marginBottom: '5px' }}>Selecciona el Servicio:</label>
            <select 
              value={servicio} 
              onChange={e => setServicio(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '3px solid #121019', fontWeight: 'bold' }}
            >
              <option value="Nail Art Kapping">Nail Art Kapping Gel ($12.000 ARS)</option>
              <option value="Esmaltado Semipermanente">Esmaltado Semipermanente ($9.000 ARS)</option>
              <option value="Set Press-On Custom">Set Press-On Custom ($15.000 ARS)</option>
              <option value="Service & Mantenimiento">Service & Mantenimiento ($8.000 ARS)</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '800', marginBottom: '5px' }}>Fecha:</label>
              <input 
                type="date" 
                value={fecha} 
                onChange={e => setFecha(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '3px solid #121019', fontWeight: 'bold' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: '800', marginBottom: '5px' }}>Horario:</label>
              <select 
                value={hora} 
                onChange={e => setHora(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '3px solid #121019', fontWeight: 'bold' }}
              >
                <option value="10:00">10:00 hs</option>
                <option value="12:00">12:00 hs</option>
                <option value="14:00">14:00 hs</option>
                <option value="16:00">16:00 hs</option>
                <option value="18:00">18:00 hs</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            className="retro-button" 
            style={{ background: '#4ade80', fontSize: '1.1rem', padding: '12px' }}
            disabled={cargando}
          >
            {cargando ? 'Agendando...' : '✨ CONFIRMAR RESERVA (+100 Pts)'}
          </button>
        </form>
      </div>

      {/* Lista de Turnos Agendados */}
      <h3 style={{ fontWeight: '900', color: '#4338ca', marginBottom: '15px', textAlign: 'center' }}>
        📋 PRÓXIMOS TURNOS CONFIRMADOS
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {turnos.length === 0 ? (
          <p style={{ textAlign: 'center', fontWeight: 'bold', color: '#6b7280' }}>No hay turnos registrados aún. 🐾</p>
        ) : (
          turnos.map(t => (
            <div key={t.id} className="retro-card" style={{ padding: '15px 20px', background: '#bae6fd', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h4 style={{ fontWeight: '900', fontSize: '1rem' }}>💅 {t.servicio}</h4>
                <p style={{ fontWeight: '700', fontSize: '0.85rem', color: '#0f172a' }}>👤 {t.cliente}</p>
                <p style={{ fontWeight: '800', fontSize: '0.85rem', color: '#be185d' }}>📅 {t.fecha} - {t.hora} hs</p>
              </div>
              {t.esClientaFiel && (
                <span style={{ background: '#fef08a', border: '2px solid #121019', padding: '4px 10px', borderRadius: '15px', fontWeight: '900', fontSize: '0.8rem' }}>
                  👑 Clienta Fiel
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}