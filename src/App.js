import React, { useState, useEffect } from 'react';
import './App.css';
import { auth, db } from './firebase/configuracionFirebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import BarraNavegacion from './components/BarraNavegacion';
import InicioHero from './components/InicioHero';
import SeccionTurnos from './components/SeccionTurnos';
import SeccionTienda from './components/SeccionTienda';
import SeccionPerfil from './components/SeccionPerfil';
import SeccionAutenticacion from './components/SeccionAutenticacion';
import PanelAdmin from './components/PanelAdmin';

function App() {
  const [pestanaActiva, setPestanaActiva] = useState('inicio');
  const [puntos, setPuntos] = useState(0);
  const [contadorCarrito, setContadorCarrito] = useState(0);
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const [mostrarModalCarrito, setMostrarModalCarrito] = useState(false);

  // Abrir el carrito desde la barra de navegación
  const abrirCarritoDesdeNavegacion = () => {
    setPestanaActiva('tienda');
    setMostrarModalCarrito(true);
  };

  useEffect(() => {
    const desuscribir = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUsuarioActivo(user);
        const docRef = doc(db, 'usuarios', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPuntos(docSnap.data().puntos || 0);
        }
      } else {
        setUsuarioActivo(null);
        setPuntos(0);
      }
    });
    return () => desuscribir();
  }, []);

  return (
    <div className="App">
      <BarraNavegacion 
        pestanaActiva={pestanaActiva} 
        setPestanaActiva={setPestanaActiva} 
        puntos={puntos} 
        contadorCarrito={contadorCarrito} 
        onAbrirCarrito={abrirCarritoDesdeNavegacion}
      />
      
      <main style={{ padding: '30px 20px', flex: 1 }}>
        <SeccionAutenticacion 
          usuarioActivo={usuarioActivo} 
          setUsuarioActivo={setUsuarioActivo} 
          setPuntos={setPuntos} 
        />

        {pestanaActiva === 'inicio' && <InicioHero setPestanaActiva={setPestanaActiva} />}
        {pestanaActiva === 'turnos' && <SeccionTurnos setPuntos={setPuntos} usuarioActivo={usuarioActivo} />}
        {pestanaActiva === 'tienda' && (
          <SeccionTienda 
            setContadorCarrito={setContadorCarrito} 
            mostrarModalCarrito={mostrarModalCarrito}
            setMostrarModalCarrito={setMostrarModalCarrito}
          />
        )}
       {pestanaActiva === 'perfil' && (
  <SeccionPerfil 
    puntos={puntos} 
    setPuntos={setPuntos} 
    usuarioActivo={usuarioActivo} 
  />
)}
        {pestanaActiva === 'admin' && <PanelAdmin />}
      </main>
    </div>
  );
}

export default App;