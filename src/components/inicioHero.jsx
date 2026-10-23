import React from 'react';

export default function InicioHero({ setPestanaActiva }) {
  const senosInspiracion = [
    { id: 1, titulo: 'Cyber Neon Art ⚡', desc: 'Líneas neón brillantes con efectos 3D.', color: '#f472b6' },
    { id: 2, titulo: 'Gatitos Kawaii 🐱', desc: 'Caritas de gatitos pintadas a mano con relieve.', color: '#38bdf8' },
    { id: 3, titulo: 'Glitter Maximalista ✨', desc: 'Gemas, destellos y cobertura total con brillo.', color: '#facc15' }
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
      {/* Banner Principal Hero */}
      <div className="retro-card" style={{ padding: '40px 20px', background: '#fbcfe8', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#be185d', marginBottom: '15px' }}>
          NAILS: FUN & COLORFUL ART 🐾✨
        </h1>
        <p style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '25px', color: '#1e1b4b' }}>
          ¡Sacá tus garras más cute y llenas de estilo retro-maximalista!
        </p>
        <button 
          className="retro-button" 
          style={{ background: '#4ade80', fontSize: '1.2rem', padding: '12px 25px' }}
          onClick={() => setPestanaActiva('turnos')}
        >
          📅 RESERVAR MI TURNO
        </button>
      </div>

      {/* Galería de Inspiración */}
      <h2 style={{ fontWeight: '900', color: '#4338ca', marginBottom: '20px' }}>
        💖 DISEÑOS DESTACADOS DEL MES
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        {senosInspiracion.map((item) => (
          <div key={item.id} className="retro-card" style={{ padding: '25px', background: item.color, textAlign: 'left' }}>
            <div style={{ background: '#fff', height: '120px', borderRadius: '10px', border: '3px solid #121019', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', marginBottom: '15px' }}>
              💅✨
            </div>
            <h3 style={{ fontWeight: '900', fontSize: '1.2rem', marginBottom: '8px' }}>{item.titulo}</h3>
            <p style={{ fontWeight: '600', fontSize: '0.9rem', marginBottom: '15px' }}>{item.desc}</p>
            <button 
              className="retro-button" 
              style={{ background: '#fff', width: '100%', fontSize: '0.85rem' }}
              onClick={() => setPestanaActiva('turnos')}
            >
              Pedir este diseño 📅
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}