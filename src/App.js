import React, { useState } from 'react';
import './App.css';
import BarraNavegacion from './components/BarraNavegacion';
import InicioHero from './components/InicioHero';
import SeccionTurnos from './components/SeccionTurnos';
import SeccionTienda from './components/SeccionTienda';
import SeccionPerfil from './components/SeccionPerfil';
import PanelAdmin from './components/PanelAdmin';
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
      
      <main style={{ padding: '30px 20px', flex: 1 }}>
        {pestanaActiva === 'inicio' && <InicioHero setPestanaActiva={setPestanaActiva} />}
        {pestanaActiva === 'turnos' && <SeccionTurnos setPuntos={setPuntos} />}
        {pestanaActiva === 'tienda' && <SeccionTienda setContadorCarrito={setContadorCarrito} />}
        {pestanaActiva === 'perfil' && <SeccionPerfil puntos={puntos} />}
        {pestanaActiva === 'admin' && <PanelAdmin />}
      </main>
    </div>
  );
}

export default App;