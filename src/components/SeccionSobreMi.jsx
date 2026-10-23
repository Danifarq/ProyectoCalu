import React from 'react';

export default function SeccionSobreMi({ setPestanaActiva }) {
  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      {/* Tarjeta Principal de Presentación */}
      <div className="retro-card" style={{ padding: '35px', background: '#fbcfe8', marginBottom: '30px', textAlign: 'center' }}>
        <div style={{ 
          width: '130px', 
          height: '130px', 
          margin: '0 auto 20px auto', 
          borderRadius: '50%', 
          border: '4px solid #121019', 
          background: '#fff', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          fontSize: '3.5rem',
          boxShadow: '4px 4px 0px #121019' 
        }}>
          🐱✨
        </div>

        <h2 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#be185d', marginBottom: '10px' }}>
          ¡HOLA! SOY LA CREADORA DE GATITOS NAILS 🐾
        </h2>
        <p style={{ fontSize: '1.1rem', fontWeight: '800', color: '#4338ca', marginBottom: '20px' }}>
          Nail Artist & Apasionada del diseño, el color y los michis.
        </p>
        <p style={{ fontSize: '1rem', fontWeight: '600', color: '#1e1b4b', lineHeight: '1.6', maxWidth: '650px', margin: '0 auto' }}>
          Gatitos Nails nació de la fusión entre dos grandes pasiones: la estética retro-maximalista llena de colores vibrantes y el amor infinito por los gatitos. Mi objetivo es que cada visita sea una experiencia única donde tus manos se conviertan en un lienzo lleno de personalidad y brillo.
        </p>
      </div>

      {/* Valores / Pilares del Estudio */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="retro-card" style={{ padding: '20px', background: '#bae6fd', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🎨</div>
          <h3 style={{ fontWeight: '900', color: '#0369a1', marginBottom: '8px' }}>Diseño Custom</h3>
          <p style={{ fontWeight: '600', fontSize: '0.9rem', color: '#0f172a' }}>
            Cada set de uñas se realiza de forma personalizada adaptándome a tu estilo y preferencias únicas.
          </p>
        </div>

        <div className="retro-card" style={{ padding: '20px', background: '#fef08a', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>💎</div>
          <h3 style={{ fontWeight: '900', color: '#a16207', marginBottom: '8px' }}>Productos Premium</h3>
          <p style={{ fontWeight: '600', fontSize: '0.9rem', color: '#0f172a' }}>
            Uso insumos de máxima calidad que garantizan la salud, resistencia y brillo duradero de tus uñas.
          </p>
        </div>

        <div className="retro-card" style={{ padding: '20px', background: '#c084fc', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🐾</div>
          <h3 style={{ fontWeight: '900', color: '#581c87', marginBottom: '8px' }}>Espacio Pet Friendly</h3>
          <p style={{ fontWeight: '600', fontSize: '0.9rem', color: '#0f172a' }}>
            Un ambiente relajado, divertido y seguro diseñado para disfrutar de tu momento de autocuidado.
          </p>
        </div>
      </div>

      {/* Llamado a la acción para sacar turno */}
      <div className="retro-card" style={{ padding: '25px', background: '#4ade80', textAlign: 'center' }}>
        <h3 style={{ fontWeight: '900', fontSize: '1.4rem', marginBottom: '10px', color: '#064e3b' }}>
          ¿LISTA PARA INSPIRARTE Y LUCIR TUS UÑAS SOÑADAS? ✨
        </h3>
        <p style={{ fontWeight: '700', marginBottom: '15px', color: '#14532d' }}>
          Reserva tu turno en línea o explora el catálogo de la tienda VIP.
        </p>
        <button 
          className="retro-button" 
          style={{ background: '#fff', fontSize: '1rem', padding: '10px 20px' }}
          onClick={() => setPestanaActiva('turnos')}
        >
          📅 SACAR UN TURNO AHORA
        </button>
      </div>
    </div>
  );
}