import React, { useState } from 'react';
import './App.css';
import BarraNavegacion from './componentes/BarraNavegacion';
import InicioHero from './componentes/InicioHero';
import SeccionTurnos from './componentes/SeccionTurnos';
import SeccionTienda from './componentes/SeccionTienda';
import SeccionPerfil from './componentes/SeccionPerfil';

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
        {pestanaActiva === 'inicio' && <InicioHero setPestanaActiva={setPestanaActiva} />}
        {pestanaActiva === 'turnos' && <SeccionTurnos setPuntos={setPuntos} />}
        {pestanaActiva === 'tienda' && <SeccionTienda setContadorCarrito={setContadorCarrito} />}
        {pestanaActiva === 'perfil' && <SeccionPerfil puntos={puntos} />}
      </div>
    </div>
  );
}

export default App;