import React, { useState } from 'react';
import { auth, db } from '../firebase/configuracionFirebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function SeccionAutenticacion({ usuarioActivo }) {
  const [esRegistro, setEsRegistro] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);

  const manejarAuth = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      if (esRegistro) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'usuarios', cred.user.uid), {
          email: cred.user.email,
          puntos: 150,
          mesesSeguidos: 0,
          esClientaFiel: false
        });
        alert('¡Cuenta creada con éxito! 🐾✨');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert('¡Bienvenida de nuevo a Gatitos Nails! 💖');
      }
    } catch (error) {
      console.error(error);
      alert('Error de autenticación: ' + error.message);
    } finally {
      setCargando(false);
    }
  };

  const cerrarSesion = async () => {
    try {
      await signOut(auth);
      alert('Sesión cerrada correctamente 🐾');
    } catch (error) {
      console.error(error);
    }
  };

  if (usuarioActivo) {
    return (
      <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
        <div className="retro-card" style={{ padding: '35px', background: '#fbcfe8' }}>
          <h2 style={{ fontWeight: '900', color: '#be185d', marginBottom: '15px' }}>
            🐱 ¡HOLA, {usuarioActivo.email}!
          </h2>
          <p style={{ fontWeight: '700', marginBottom: '25px', color: '#1e1b4b' }}>
            Ya estás conectada al sistema de Gatitos Nails.
          </p>
          <button 
            className="retro-button" 
            style={{ background: '#ef4444', color: '#fff', fontSize: '1.1rem', padding: '12px 25px' }}
            onClick={cerrarSesion}
          >
            🚪 CERRAR SESIÓN
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '450px', margin: '0 auto' }}>
      <div className="retro-card" style={{ padding: '30px', background: '#fef08a' }}>
        <h2 style={{ fontWeight: '900', color: '#854d0e', marginBottom: '20px', textAlign: 'center' }}>
          {esRegistro ? '✨ REGISTRO DE CLIENTAS' : '🔑 INICIAR SESIÓN'}
        </h2>

        <form onSubmit={manejarAuth} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '800', marginBottom: '5px' }}>Correo Electrónico:</label>
            <input 
              type="email" 
              placeholder="tu@correo.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '3px solid #121019', fontWeight: 'bold' }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: '800', marginBottom: '5px' }}>Contraseña:</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '3px solid #121019', fontWeight: 'bold' }}
              required
            />
          </div>

          <button 
            type="submit" 
            className="retro-button" 
            style={{ background: '#4ade80', fontSize: '1.1rem', padding: '12px', marginTop: '10px' }}
            disabled={cargando}
          >
            {cargando ? 'Procesando...' : (esRegistro ? '✨ REGISTRARSE' : '🚀 ENTRAR')}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontWeight: 'bold', fontSize: '0.9rem' }}>
          {esRegistro ? '¿Ya tienes una cuenta?' : '¿No tienes cuenta?'} {' '}
          <span 
            style={{ color: '#be185d', cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => setEsRegistro(!esRegistro)}
          >
            {esRegistro ? 'Inicia sesión aquí' : 'Regístrate aquí'}
          </span>
        </p>
      </div>
    </div>
  );
}