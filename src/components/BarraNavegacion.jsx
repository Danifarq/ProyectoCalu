import React from 'react';

export default function BarraNavegacion({ pestanaActiva, setPestanaActiva, puntos, contadorCarrito, onAbrirCarrito }) {
  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '15px 30px', 
      background: '#fff', 
      borderBottom: '4px solid #121019',
      flexWrap: 'wrap',
      gap: '10px'
    }}>
      <h1 
        style={{ fontWeight: '900', cursor: 'pointer', color: '#be185d', margin: 0 }} 
        onClick={() => setPestanaActiva('inicio')}
      >
        🐾 GATITOS NAILS
      </h1>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <button 
          className="retro-button" 
          style={{ background: pestanaActiva === 'inicio' ? '#facc15' : '#fff' }} 
          onClick={() => setPestanaActiva('inicio')}
        >
          🏠 Inicio
        </button>
        <button 
          className="retro-button" 
          style={{ background: pestanaActiva === 'turnos' ? '#facc15' : '#fff' }} 
          onClick={() => setPestanaActiva('turnos')}
        >
          📅 Turnos
        </button>
        <button 
          className="retro-button" 
          style={{ background: pestanaActiva === 'tienda' ? '#facc15' : '#fff' }} 
          onClick={() => setPestanaActiva('tienda')}
        >
          🛍️ Tienda
        </button>
        <button 
          className="retro-button" 
          style={{ background: pestanaActiva === 'perfil' ? '#facc15' : '#fff' }} 
          onClick={() => setPestanaActiva('perfil')}
        >
          💎 {puntos.toLocaleString()} Pts
        </button>
<button 
  className="retro-button" 
  style={{ background: pestanaActiva === 'armatucombo' ? '#facc15' : '#fff' }} 
  onClick={() => setPestanaActiva('armatucombo')}
>
  🎨 Arma tu Combo
</button>
        {/* Botón de Panel de Administración */}
        <button 
          className="retro-button" 
          style={{ background: pestanaActiva === 'admin' ? '#facc15' : '#c084fc' }} 
          onClick={() => setPestanaActiva('admin')}
        >
          👑 Admin
        </button>
<button 
  className="retro-button" 
  style={{ background: pestanaActiva === 'sobremi' ? '#facc15' : '#fff' }} 
  onClick={() => setPestanaActiva('sobremi')}
>
  🐱 Sobre Mí
</button>
        {/* Ícono interactivo del carrito arriba a la derecha */}
        <button 
          className="retro-button" 
          onClick={onAbrirCarrito}
          style={{ 
            background: '#facc15', 
            borderRadius: '50%', 
            width: '45px', 
            height: '45px', 
            padding: 0, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '1rem'
          }}
          title="Ver Carrito"
        >
          🛒 {contadorCarrito}
        </button>
      </div>
    </nav>
  );
}