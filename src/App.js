import React, { useState } from 'react';
import './App.css';
import BarraNavegacion from './components/BarraNavegacion';
import inicioHero from './components/inicioHero';
import SeccionTurnos from './components/SeccionTurnos';
import SeccionTienda from './components/SeccionTienda';
import SeccionPerfil from './components/SeccionPerfil';

function App() {
  const [pestanaActiva, setPestanaActiva] = useState('inicio');
  const [puntos, setPuntos] = useState(750000); 
  const [contadorCarrito, setContadorCarrito] = useState(2);

  return (
    <div className="App">
      <BarraNavegacion 
        pestanaActiva={pestanaActiva} 
        setPestanaActiva={setPestanaActiva} 
        puntos={puntos} 
        contadorCarrito={contadorCarrito} 
      />
      
      <div style={{ padding: '20px' }}>
        {pestanaActiva === 'inicio' && <inicioHero setPestanaActiva={setPestanaActiva} />}
        {pestanaActiva === 'turnos' && <SeccionTurnos setPuntos={setPuntos} />}
        {pestanaActiva === 'tienda' && <SeccionTienda setContadorCarrito={setContadorCarrito} />}
        {pestanaActiva === 'perfil' && <SeccionPerfil puntos={puntos} />}
      </div>
    </div>
  );
}

export default App;