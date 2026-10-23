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
  const [contadorCarrito, setContadorCarrito] = useState(2);
  const [usuarioActivo, setUsuarioActivo] = useState(null);

  // Escuchar si hay una usuaria logueada al cargar la app
  useEffect(() => {
    const desuscribir = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUsuarioActivo(user);
        // Cargar sus puntos desde Firestore
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
      />
      
      <main style={{ padding: '30px 20px', flex: 1 }}>
        {/* Componente de Login arriba para que se pueda autenticar fácil */}
        <SeccionAutenticacion 
          usuarioActivo={usuarioActivo} 
          setUsuarioActivo={setUsuarioActivo} 
          setPuntos={setPuntos} 
        />

        {pestanaActiva === 'inicio' && <InicioHero setPestanaActiva={setPestanaActiva} />}
        {pestanaActiva === 'turnos' && <SeccionTurnos setPuntos={setPuntos} usuarioActivo={usuarioActivo} />}
        {pestanaActiva === 'tienda' && <SeccionTienda setContadorCarrito={setContadorCarrito} />}
        {pestanaActiva === 'perfil' && <SeccionPerfil puntos={puntos} usuarioActivo={usuarioActivo} />}
        {pestanaActiva === 'admin' && <PanelAdmin />}
      </main>
    </div>
  );
}

export default App;