import React from 'react';

export default function SeccionTienda({ setContadorCarrito }) {
  const productos = [
    { id: 1, nombre: 'Kits Uñas Neón', puntos: 200, color: '#f472b6' },
    { id: 2, nombre: 'Esmaltes Cat Eye', puntos: 150, color: '#38bdf8' },
    { id: 3, nombre: 'Set Uñas Press-On', puntos: 150, color: '#facc15' },
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ fontWeight: '900', textAlign: 'center', marginBottom: '20px', color: '#db2777' }}>🛍️ TIENDA ONLINE</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        {productos.map((prod) => (
          <div key={prod.id} className="retro-card" style={{ padding: '20px', background: prod.color, textAlign: 'center' }}>
            <div style={{ background: '#fff', height: '120px', borderRadius: '10px', border: '3px solid #121019', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginBottom: '15px' }}>
              Imagen Producto
            </div>
            <h3 style={{ fontWeight: '900', marginBottom: '10px' }}>{prod.nombre}</h3>
            <p style={{ fontWeight: 'bold', marginBottom: '15px' }}>Valor: {prod.puntos} Pts / Comprar</p>
            <button className="retro-button" style={{ background: '#fff', width: '100%' }} onClick={() => setContadorCarrito(prev => prev + 1)}>
              🛒 Agregar al Carrito
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}