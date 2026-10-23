import React from 'react';

export default function BarraNavegacion({ pestanaActiva, setPestanaActiva, puntos, contadorCarrito, onAbrirCarrito }) {
  return (
    <nav style={{ 
      display: 'flex', 
      justify: 'space-between', 
      alignItems: 'center', 
      padding: '15px 30px', 
      background: '#fff', 
      borderBottom: '4px solid #121019' 
    }}>
      <h1 
        style={{ fontWeight: '900', cursor: 'pointer', color: '#be185d' }} 
        onClick={() => setPestanaActiva('inicio')}
      >
        🐾 GATITOS NAILS
      </h1>

      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
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