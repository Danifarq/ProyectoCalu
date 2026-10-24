import React, { useState } from 'react';
import { db } from '../firebase/configuracionFirebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function SeccionArmaTuServicio({ usuarioActivo, setPestanaActiva }) {
  // Lista de estilos disponibles por uña
  const opcionesDiseno = [
    { id: 'liso', nombre: 'Color Liso', precio: 500, emoji: '🎨' },
    { id: 'glitter', nombre: 'Glitter / Holo', precio: 800, emoji: '✨' },
    { id: 'cateye', nombre: 'Cat Eye Mágico', precio: 1000, emoji: '👁️' },
    { id: 'gatito', nombre: 'Dibujo Gatito 3D', precio: 1500, emoji: '🐱' },
    { id: 'francesita', nombre: 'Francesita Pastel', precio: 700, emoji: '🎀' }
  ];

  // Bebidas y Snacks de cortesía
  const opcionesBebidas = ['☕ Café helado con crema', '🍵 Té Matcha Boba', '🧃 Jugo natural de Frutilla/Menta', '🥤 Gaseosa Neón'];
  const opcionesSnacks = ['🍪 Galletitas con forma de Gatito', 'Donuts Glaseadas Rosa 🍩', '🍿 Pororó Dulce', '🍬 Caramelos Aciditos'];

  const dedos = ['Pulgar', 'Índice', 'Mayor', 'Anular', 'Meñique'];

  // Estados para la configuración uña por uña
  const [manoIzquierda, setManoIzquierda] = useState({ Pulgar: 'liso', Índice: 'liso', Mayor: 'liso', Anular: 'liso', Meñique: 'liso' });
  const [manoDerecha, setManoDerecha] = useState({ Pulgar: 'liso', Índice: 'liso', Mayor: 'liso', Anular: 'liso', Meñique: 'liso' });

  // Estados para Bebida y Snack
  const [bebidaElegida, setBebidaElegida] = useState(opcionesBebidas[0]);
  const [snackElegido, setSnackElegido] = useState(opcionesSnacks[0]);
  const [cargando, setCargando] = useState(false);

  const cambiarDisenoUna = (mano, dedo, estiloId) => {
    if (mano === 'izq') {
      setManoIzquierda(prev => ({ ...prev, [dedo]: estiloId }));
    } else {
      setManoDerecha(prev => ({ ...prev, [dedo]: estiloId }));
    }
  };

  // Calcular precio total estimado
  const calcularTotal = () => {
    const baseServicio = 8000; // Servicio base de manicuría / kapping
    const extraIzq = Object.values(manoIzquierda).reduce((acc, estiloId) => {
      const obj = opcionesDiseno.find(o => o.id === estiloId);
      return acc + (obj ? obj.precio : 0);
    }, 0);
    const extraDer = Object.values(manoDerecha).reduce((acc, estiloId) => {
      const obj = opcionesDiseno.find(o => o.id === estiloId);
      return acc + (obj ? obj.precio : 0);
    }, 0);

    return baseServicio + extraIzq + extraDer;
  };

  const guardarConfiguracion = async () => {
    setCargando(true);
    try {
      await addDoc(collection(db, 'servicios_personalizados'), {
        usuario: usuarioActivo ? usuarioActivo.email : 'Cliente Invitado',
        manoIzquierda,
        manoDerecha,
        bebida: bebidaElegida,
        snack: snackElegido,
        totalEstimado: calcularTotal(),
        creadoEn: serverTimestamp()
      });

      alert('¡Tu combo de uñas y snack personalizado quedó guardado! 🐾✨ Vamos a la sección de Turnos para elegir fecha.');
      setPestanaActiva('turnos');
    } catch (error) {
      console.error('Error al guardar personalización: ', error);
      alert('Ocurrió un error al guardar tu diseño.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="retro-card" style={{ padding: '30px', background: '#fbcfe8', marginBottom: '30px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#be185d', marginBottom: '10px' }}>
          ✨ ARMA TU SERVICIO NAILED & SNACK 🐾
        </h2>
        <p style={{ fontWeight: '700', color: '#4338ca' }}>
          Diseña uña por uña y elige tu menú de cortesía para disfrutar durante el turno.
        </p>
      </div>

      {/* SECCIÓN UÑA POR UÑA */}
      <div className="retro-card" style={{ padding: '25px', background: '#fff', marginBottom: '25px' }}>
        <h3 style={{ fontWeight: '900', color: '#be185d', marginBottom: '20px', textAlign: 'center' }}>
          💅 1. SELECCIONA EL DISEÑO UÑA POR UÑA
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' }}>
          {/* Mano Izquierda */}
          <div style={{ background: '#fef08a', padding: '15px', borderRadius: '12px', border: '3px solid #121019' }}>
            <h4 style={{ fontWeight: '900', textAlign: 'center', marginBottom: '15px' }}>🤚 Mano Izquierda</h4>
            {dedos.map(dedo => (
              <div key={`izq-${dedo}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontWeight: '800', width: '70px' }}>{dedo}:</span>
                <select 
                  value={manoIzquierda[dedo]} 
                  onChange={(e) => cambiarDisenoUna('izq', dedo, e.target.value)}
                  style={{ padding: '6px', borderRadius: '6px', border: '2px solid #121019', fontWeight: 'bold', flex: 1 }}
                >
                  {opcionesDiseno.map(op => (
                    <option key={op.id} value={op.id}>
                      {op.emoji} {op.nombre} (+${op.precio})
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {/* Mano Derecha */}
          <div style={{ background: '#bae6fd', padding: '15px', borderRadius: '12px', border: '3px solid #121019' }}>
            <h4 style={{ fontWeight: '900', textAlign: 'center', marginBottom: '15px' }}>🖐️ Mano Derecha</h4>
            {dedos.map(dedo => (
              <div key={`der-${dedo}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontWeight: '800', width: '70px' }}>{dedo}:</span>
                <select 
                  value={manoDerecha[dedo]} 
                  onChange={(e) => cambiarDisenoUna('der', dedo, e.target.value)}
                  style={{ padding: '6px', borderRadius: '6px', border: '2px solid #121019', fontWeight: 'bold', flex: 1 }}
                >
                  {opcionesDiseno.map(op => (
                    <option key={op.id} value={op.id}>
                      {op.emoji} {op.nombre} (+${op.precio})
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECCIÓN BEBIDA Y SNACK */}
      <div className="retro-card" style={{ padding: '25px', background: '#c084fc', marginBottom: '25px' }}>
        <h3 style={{ fontWeight: '900', color: '#fff', marginBottom: '20px', textAlign: 'center' }}>
          ☕ 2. MENÚ DE CORTESÍA PARA TU TURNO
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '900', color: '#fff', marginBottom: '8px' }}>🥤 Elige tu bebida:</label>
            <select 
              value={bebidaElegida} 
              onChange={e => setBebidaElegida(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '3px solid #121019', fontWeight: 'bold' }}
            >
              {opcionesBebidas.map((b, i) => <option key={i} value={b}>{b}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: '900', color: '#fff', marginBottom: '8px' }}>🍪 Elige tu snack:</label>
            <select 
              value={snackElegido} 
              onChange={e => setSnackElegido(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '3px solid #121019', fontWeight: 'bold' }}
            >
              {opcionesSnacks.map((s, i) => <option key={i} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* RESUMEN Y TOTAL */}
      <div className="retro-card" style={{ padding: '25px', background: '#4ade80', textAlign: 'center' }}>
        <h3 style={{ fontWeight: '900', fontSize: '1.5rem', marginBottom: '10px' }}>
          Total Estimado: ${calcularTotal().toLocaleString()} ARS
        </h3>
        <p style={{ fontWeight: '700', marginBottom: '15px' }}>
          Incluye manicuría base + diseño por uña + cortesía de bebida ({bebidaElegida.split(' ')[0]}) y snack.
        </p>
        <button 
          className="retro-button" 
          style={{ background: '#fff', fontSize: '1.1rem', padding: '12px 25px' }}
          onClick={guardarConfiguracion}
          disabled={cargando}
        >
          {cargando ? 'Guardando...' : '✨ GUARDAR DISEÑO Y PEDIR TURNO'}
        </button>
      </div>
    </div>
  );
}