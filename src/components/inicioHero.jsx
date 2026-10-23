import React from 'react';

export default function InicioHero({ setPestanaActiva }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      {/* Banner Principal Estilo Retro */}
      <div className="retro-card checkerboard-bg" style={{ maxWidth: '900px', margin: '0 auto 40px auto', padding: '40px', background: '#ec4899', color: '#fff', border: '5px solid #121019' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '900', textShadow: '3px 3px 0px #121019', marginBottom: '15px' }}>
          NAILS: FUN & COLORFUL ART 🐾
        </h1>
        <p style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '30px', background: '#121019', display: 'inline-block', padding: '8px 16px', borderRadius: '10px' }}>
          ¡Saca tus garras más cute y llenas de estilo!
        </p>

        {/* Galería de Diseños de Referencia */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap', marginBottom: '30px' }}>
          {['💅 Manicuría Neón', '✨ Kapping con 3D', '🐱 Nail Art Gatitos', '💖 Press-On Custom'].map((titulo, index) => (
            <div key={index} style={{ background: '#fff', color: '#121019', padding: '15px 20px', borderRadius: '15px', border: '3px solid #121019', fontWeight: 'bold', boxShadow: '4px 4px 0px #121019' }}>
              {titulo}
            </div>
          ))}
        </div>

        {/* Botones de Acción */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <button className="retro-button" style={{ background: '#38bdf8', fontSize: '1.1rem' }} onClick={() => setPestanaActiva('turnos')}>
            ✨ RESERVAR MI TURNO
          </button>
          <button className="retro-button" style={{ background: '#facc15', fontSize: '1.1rem' }} onClick={() => setPestanaActiva('tienda')}>
            🛍️ VER DISEÑOS EN TIENDA
          </button>
        </div>
      </div>

      {/* Banner de Puntos */}
      <div className="retro-card" style={{ maxWidth: '600px', margin: '0 auto', background: '#c084fc', padding: '20px', border: '4px solid #121019' }}>
        <h3 style={{ fontWeight: '900', color: '#121019' }}>💎 ¡Programa de Puntos Gatitos VIP!</h3>
        <p style={{ fontWeight: '600', marginTop: '5px' }}>Acumulás puntos con cada turno y compra para canjear por descuentos increíbles.</p>
      </div>
    </div>
  );
}