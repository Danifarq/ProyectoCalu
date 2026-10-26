import React, { useState, useEffect } from 'react';
import './App.css';
import BarraNavegacion from './components/BarraNavegacion';
import InicioHero from './components/InicioHero';
import SeccionTurnos from './components/SeccionTurnos';
import SeccionTienda from './components/SeccionTienda';
import SeccionPerfil from './components/SeccionPerfil';
import PanelAdmin from './components/PanelAdmin';
import SeccionAutenticacion from './components/SeccionAutenticacion';
import SeccionSobreMi from './components/SeccionSobreMi';
import SeccionArmaTuServicio from './components/SeccionArmaTuServicio';
import SeccionResenas from './components/SeccionResenas';
import DecoracionGatitos from './components/DecoracionGatitos';

import bannerSplash from './assets/bannerdespazable.jpeg';

import { auth, db } from './firebase/configuracionFirebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

function App() {
  const [pestanaActiva, setPestanaActiva] = useState('inicio');
  const [puntos, setPuntos] = useState(150);
  const [contadorCarrito, setContadorCarrito] = useState(0);
  const [mostrarModalCarrito, setMostrarModalCarrito] = useState(false);
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const [datosUsuario, setDatosUsuario] = useState({ esClientaFiel: false, mesesSeguidos: 0 });
  const [cargandoAuth, setCargandoAuth] = useState(true);

  // Estados para gestionar el SplashScreen
  const [mostrarSplash, setMostrarSplash] = useState(true);
  const [fadingSplash, setFadingSplash] = useState(false);

  // Efecto para ocultar el splash screen
  useEffect(() => {
    const timerFade = setTimeout(() => {
      setFadingSplash(true);
    }, 2500);

    const timerRemove = setTimeout(() => {
      setMostrarSplash(false);
    }, 3000);

    return () => {
      clearTimeout(timerFade);
      clearTimeout(timerRemove);
    };
  }, []);

  // Escuchar estado de autenticación en Firebase
  useEffect(() => {
    const desuscribir = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUsuarioActivo(user);
        try {
          const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.puntos !== undefined) setPuntos(data.puntos);
            setDatosUsuario(data);
          }
        } catch (error) {
          console.error("Error al traer datos de usuario:", error);
        }
      } else {
        setUsuarioActivo(null);
        setDatosUsuario({ esClientaFiel: false, mesesSeguidos: 0 });
      }
      setCargandoAuth(false);
    });

    return () => desuscribir();
  }, []);

  // 1. PANTALLA DE AUTENTICACIÓN OBLIGATORIA (Si no está logueado)
  if (!usuarioActivo && !cargandoAuth) {
    return (
      <div className="App" style={{ minHeight: '100vh', position: 'relative' }}>
        {/* Splash Screen si aún está activo */}
        {mostrarSplash && (
          <div className={`splash-overlay ${fadingSplash ? 'fade-out' : ''}`}>
            <img src={bannerSplash} alt="Magic Bling Splash" className="splash-image" />
          </div>
        )}

        {/* Muestra únicamente la sección de autenticación */}
        <SeccionAutenticacion usuarioActivo={usuarioActivo} />
      </div>
    );
  }

  // 2. APLICACIÓN COMPLETA (Solo accesible con sesión iniciada)
  return (
    <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      {/* Pantalla de bienvenida (Splash Screen) */}
      {mostrarSplash && (
        <div className={`splash-overlay ${fadingSplash ? 'fade-out' : ''}`}>
          <img src={bannerSplash} alt="Magic Bling Splash" className="splash-image" />
        </div>
      )}

      <DecoracionGatitos />

      {/* Barra superior de navegación */}
      <BarraNavegacion 
        pestanaActiva={pestanaActiva} 
        setPestanaActiva={setPestanaActiva} 
        puntos={puntos}
        contadorCarrito={contadorCarrito}
        usuarioActivo={usuarioActivo}
        onAbrirCarrito={() => {
          setPestanaActiva('tienda');
          setMostrarModalCarrito(true);
        }}
      />

      {/* Contenido principal según la pestaña seleccionada */}
      <main style={{ flex: 1, padding: '30px 20px', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
        {pestanaActiva === 'inicio' && <InicioHero setPestanaActiva={setPestanaActiva} />}
        
        {pestanaActiva === 'turnos' && (
          <SeccionTurnos 
            usuarioActivo={usuarioActivo} 
            datosUsuario={datosUsuario}
            setPuntos={setPuntos}
          />
        )}

        {pestanaActiva === 'tienda' && (
          <SeccionTienda 
            setContadorCarrito={setContadorCarrito} 
            mostrarModalCarrito={mostrarModalCarrito}
            setMostrarModalCarrito={setMostrarModalCarrito}
            usuarioActivo={usuarioActivo}
          />
        )}

        {pestanaActiva === 'perfil' && (
          <SeccionPerfil 
            puntos={puntos} 
            setPuntos={setPuntos} 
            usuarioActivo={usuarioActivo}
            datosUsuario={datosUsuario}
            setDatosUsuario={setDatosUsuario}
          />
        )}

        {pestanaActiva === 'auth' && <SeccionAutenticacion usuarioActivo={usuarioActivo} />}
        {pestanaActiva === 'admin' && <PanelAdmin />}
        {pestanaActiva === 'sobremi' && <SeccionSobreMi setPestanaActiva={setPestanaActiva} />}
        {pestanaActiva === 'armatucombo' && <SeccionArmaTuServicio usuarioActivo={usuarioActivo} setPestanaActiva={setPestanaActiva} />}
        {pestanaActiva === 'resenas' && <SeccionResenas usuarioActivo={usuarioActivo} />}
      </main>
    </div>
  );
}

export default App;