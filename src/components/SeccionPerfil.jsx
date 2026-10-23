import React from 'react';

export default function SeccionPerfil({ puntos }) {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="retro-card" style={{ padding: '30px', background: '#2e1065', color: '#fff', border: '5px solid #121019' }}>
        <h2 style={{ fontWeight: '900', textAlign: 'center', color: '#c084fc', marginBottom: '20px' }}>💎 BILLETERA & PUNTOS VIP</h2>
        
        <div style={{ background: '#4c1d95', padding: '20px', borderRadius: '15px', border: '3px solid #facc15', textAlign: 'center', marginBottom: '25px' }}>
          <p style={{ fontSize: '1rem', fontWeight: 'bold' }}>TOTAL ACUMULADO</p>
          <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#facc15' }}>{puntos.toLocaleString()} PTS</h1>
          <p style={{ fontSize: '0.9rem', color: '#e9d5ff', marginTop: '5px' }}>NIVEL GATO BRONCE ➔ PLATA</p>
        </div>

        <h3 style={{ fontWeight: 'bold', marginBottom: '10px' }}>🎁 Sistema de Canje Disponible:</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ background: '#581c87', padding: '12px', borderRadius: '10px', marginBottom: '10px', border: '2px solid #c084fc', display: 'flex', justifyContent: 'space-between' }}>
            <span>✨ 1 Turno Gratis (300 pts)</span>
            <button className="retro-button" style={{ padding: '5px 10px', background: '#facc15', fontSize: '0.8rem' }}>Canjear</button>
          </li>
          <li style={{ background: '#581c87', padding: '12px', borderRadius: '10px', border: '2px solid #c084fc', display: 'flex', justifyContent: 'space-between' }}>
            <span>💅 15% OFF en Press-On Nails (150 pts)</span>
            <button className="retro-button" style={{ padding: '5px 10px', background: '#facc15', fontSize: '0.8rem' }}>Canjear</button>
          </li>
        </ul>
      </div>
    </div>
  );
}