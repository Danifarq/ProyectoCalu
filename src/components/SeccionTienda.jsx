import React, { useState } from 'react';
import { db } from '../firebase/configuracionFirebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function SeccionTienda({ setContadorCarrito, mostrarModalCarrito, setMostrarModalCarrito, usuarioActivo }) {
  const productos = [
    { id: 1, nombre: 'Kit Uñas Neón Completas', categoria: 'Kits', precio: 12000, puntos: 200, color: '#f472b6' },
    { id: 2, nombre: 'Esmalte Cat Eye Mágico', categoria: 'Esmaltes', precio: 8500, puntos: 150, color: '#38bdf8' },
    { id: 3, nombre: 'Set Press-On Custom Gatitos', categoria: 'Press-On', precio: 15000, puntos: 300, color: '#facc15' },
    { id: 4, nombre: 'Top Coat Glitter Holo', categoria: 'Esmaltes', precio: 6500, puntos: 100, color: '#c084fc' },
    { id: 5, nombre: 'Kit Kapping Gel Pro', categoria: 'Kits', precio: 18000, puntos: 350, color: '#4ade80' },
    { id: 6, nombre: 'Set Press-On Pastel Dream', categoria: 'Press-On', precio: 14000, puntos: 280, color: '#fb923c' }
  ];

  const [carrito, setCarrito] = useState([]);
  const [cargandoCompra, setCargandoCompra] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');

  // Filtrar productos por categoría y texto de búsqueda
  const productosFiltrados = productos.filter(prod => {
    const coincideCategoria = categoriaSeleccionada === 'Todos' || prod.categoria === categoriaSeleccionada;
    const coincideBusqueda = prod.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });

  const agregarAlCarrito = (producto) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.id === producto.id);
      if (existe) {
        return prev.map(item => item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item);
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
    setContadorCarrito(prev => prev + 1);
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(prev => {
      const itemEncontrado = prev.find(item => item.id === id);
      if (itemEncontrado.cantidad > 1) {
        return prev.map(item => item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item);
      }
      return prev.filter(item => item.id !== id);
    });
    setContadorCarrito(prev => Math.max(0, prev - 1));
  };

  const totalPesos = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  const finalizarCompra = async () => {
    if (carrito.length === 0) return;
    setCargandoCompra(true);
    try {
      await addDoc(collection(db, 'compras'), {
        usuario: usuarioActivo ? usuarioActivo.email : 'Cliente Invitado',
        productos: carrito.map(item => ({ nombre: item.nombre, cantidad: item.cantidad, precio: item.precio })),
        total: totalPesos,
        estado: 'pendiente',
        creadoEn: serverTimestamp()
      });

      alert('¡Compra registrada con éxito en Firestore! 🐾✨ Te contactaremos para coordinar el envío.');
      setCarrito([]);
      setContadorCarrito(0);
      setMostrarModalCarrito(false);
    } catch (error) {
      console.error('Error al guardar la compra: ', error);
      alert('Hubo un error al procesar la compra.');
    } finally {
      setCargandoCompra(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <h2 style={{ fontWeight: '900', color: '#db2777' }}>🛍️ TIENDA ONLINE</h2>
        <button 
          className="retro-button" 
          style={{ background: '#facc15', display: 'flex', alignItems: 'center', gap: '8px' }}
          onClick={() => setMostrarModalCarrito(true)}
        >
          🛒 Ver Carrito ({carrito.reduce((acc, item) => acc + item.cantidad, 0)})
        </button>
      </div>

      {/* Controles de Búsqueda y Filtros */}
      <div className="retro-card" style={{ padding: '20px', background: '#fef08a', marginBottom: '25px' }}>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <input 
            type="text" 
            placeholder="🔍 Buscar producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ padding: '10px 15px', borderRadius: '10px', border: '3px solid #121019', fontWeight: 'bold', minWidth: '220px', flex: 1 }}
          />

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['Todos', 'Kits', 'Esmaltes', 'Press-On'].map((cat) => (
              <button 
                key={cat}
                className="retro-button"
                style={{ background: categoriaSeleccionada === cat ? '#f472b6' : '#fff', fontSize: '0.85rem', padding: '8px 14px' }}
                onClick={() => setCategoriaSeleccionada(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grilla de Productos Filtrados */}
      {productosFiltrados.length === 0 ? (
        <p style={{ textAlign: 'center', fontWeight: 'bold', padding: '30px' }}>No encontramos productos con esa búsqueda. 🐾</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          {productosFiltrados.map((prod) => (
            <div key={prod.id} className="retro-card" style={{ padding: '20px', background: prod.color, textAlign: 'center' }}>
              <div style={{ background: '#fff', height: '100px', borderRadius: '10px', border: '3px solid #121019', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginBottom: '15px' }}>
                💅 {prod.categoria}
              </div>
              <h3 style={{ fontWeight: '900', marginBottom: '8px', fontSize: '1.1rem' }}>{prod.nombre}</h3>
              <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>${prod.precio.toLocaleString()} ARS</p>
              <p style={{ fontWeight: '600', fontSize: '0.85rem', marginBottom: '15px', color: '#4338ca' }}>O canjea por {prod.puntos} Pts</p>
              
              <button 
                className="retro-button" 
                style={{ background: '#fff', width: '100%', fontSize: '0.9rem' }} 
                onClick={() => agregarAlCarrito(prod)}
              >
                + Agregar al Carrito
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal del Carrito */}
      {mostrarModalCarrito && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
          <div className="retro-card" style={{ background: '#fff', padding: '30px', width: '90%', maxWidth: '500px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontWeight: '900', color: '#1e1b4b' }}>🛒 Tu Carrito de Compras</h3>
              <button onClick={() => setMostrarModalCarrito(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
            </div>

            {carrito.length === 0 ? (
              <p style={{ textAlign: 'center', fontWeight: 'bold', padding: '20px', color: '#6b7280' }}>Tu carrito está vacío 🐾</p>
            ) : (
              <div>
                {carrito.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '10px', borderBottom: '2px dashed #cbd5e1' }}>
                    <div>
                      <h4 style={{ fontWeight: '800', fontSize: '1rem' }}>{item.nombre}</h4>
                      <p style={{ fontSize: '0.9rem', color: '#475569' }}>${item.precio.toLocaleString()} x {item.cantidad}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button className="retro-button" style={{ padding: '2px 8px', background: '#fca5a5' }} onClick={() => eliminarDelCarrito(item.id)}>-</button>
                      <span style={{ fontWeight: 'bold' }}>{item.cantidad}</span>
                      <button className="retro-button" style={{ padding: '2px 8px', background: '#86efac' }} onClick={() => agregarAlCarrito(item)}>+</button>
                    </div>
                  </div>
                ))}

                <div style={{ marginTop: '20px', borderTop: '3px solid #121019', paddingTop: '15px' }}>
                  <h3 style={{ fontWeight: '900', textAlign: 'right', marginBottom: '15px' }}>
                    Total: ${totalPesos.toLocaleString()} ARS
                  </h3>
                  <button 
                    className="retro-button" 
                    style={{ width: '100%', background: '#4ade80', fontSize: '1.1rem', padding: '12px' }}
                    onClick={finalizarCompra}
                    disabled={cargandoCompra}
                  >
                    {cargandoCompra ? 'Guardando...' : '✨ FINALIZAR COMPRA'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}