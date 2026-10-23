import React from 'react';

export default function BarraNavegacion({ pestanaActiva, setPestanaActiva, puntos, contadorCarrito }) {
  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px', background: '#ffe4e6', borderBottom: '4px solid #121019', position: 'sticky', top: 0, zIndex: 1000 }}>
      <h2 style={{ fontWeight: '900', color: '#e11d48', cursor: 'pointer' }} onClick={() => setPestanaActiva('inicio')}>
        🐾 GATITOS NAILS
      </h2>
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        <button className="retro-button" onClick={() => setPestanaActiva('inicio')}>🏠 Inicio</button>
        <button className="retro-button" onClick={() => setPestanaActiva('turnos')}>📅 Turnos</button>
        <button className="retro-button" onClick={() => setPestanaActiva('tienda')}>🛍️ Tienda</button>
        <button className="retro-button" onClick={() => setPestanaActiva('perfil')} style={{ background: '#f43f5e', color: 'white' }}>
          💎 {puntos.toLocaleString()} Pts
        </button>
        <button className="retro-button" onClick={() => setPestanaActiva('admin')} style={{ background: '#c084fc' }}>
  👑 Admin
</button>
        <div style={{ background: '#facc15', border: '3px solid #121019', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', cursor: 'pointer' }}>
          🛒 {contadorCarrito}
        </div>
      </div>
    </nav>
  );
}