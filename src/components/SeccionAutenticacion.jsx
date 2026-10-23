import React, { useState } from 'react';
import { auth, db } from '../firebase/configuracionFirebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function SeccionAutenticacion({ usuarioActivo, setUsuarioActivo, setPuntos }) {
  const [esRegistro, setEsRegistro] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  // Manejar Registro o Inicio de Sesión
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      if (esRegistro) {
        // Registrar nuevo usuario
        const credencial = await createUserWithEmailAndPassword(auth, email, password);
        const user = credencial.user;

        // Crear su documento inicial en Firestore con 0 puntos o un bono de bienvenida
        await setDoc(doc(db, 'usuarios', user.uid), {
          email: user.email,
          puntos: 500, // Bono de bienvenida por registrarse
          nivel: 'Gato Bronce'
        });

        setUsuarioActivo(user);
        setPuntos(500);
      } else {
        // Iniciar sesión
        const credencial = await signInWithEmailAndPassword(auth, email, password);
        const user = credencial.user;

        // Buscar sus puntos en Firestore
        const docRef = doc(db, 'usuarios', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPuntos(docSnap.data().puntos || 0);
        }

        setUsuarioActivo(user);
      }
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error. Verifica tus datos o contraseña (mínimo 6 caracteres).');
    } finally {
      setCargando(false);
    }
  };

  // Cerrar sesión
  const cerrarSesion = async () => {
    await signOut(auth);
    setUsuarioActivo(null);
  };

  if (usuarioActivo) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>👤 Conectada como: {usuarioActivo.email}</p>
        <button className="retro-button" style={{ background: '#f87171' }} onClick={cerrarSesion}>
          🚪 Cerrar Sesión
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '400px', margin: '20px auto', padding: '25px', background: '#fbcfe8', border: '4px solid #121019', borderRadius: '15px', boxShadow: '5px 5px 0px #121019' }}>
      <h3 style={{ textAlign: 'center', fontWeight: '900', marginBottom: '15px', color: '#be185d' }}>
        {esRegistro ? '✨ CREAR CUENTA VIP' : '🐾 INICIAR SESIÓN'}
      </h3>

      {error && <p style={{ color: '#b91c1c', fontSize: '0.9rem', marginBottom: '10px', fontWeight: 'bold' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: '800', marginBottom: '5px' }}>Correo Electrónico:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '3px solid #121019', fontWeight: 'bold' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: '800', marginBottom: '5px' }}>Contraseña:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '3px solid #121019', fontWeight: 'bold' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={cargando}
          className="retro-button" 
          style={{ width: '100%', background: '#38bdf8', marginBottom: '10px' }}
        >
          {cargando ? 'Procesando...' : esRegistro ? 'Registrarse y ganar +500 Pts' : 'Entrar'}
        </button>
      </form>

      <p 
        style={{ textAlign: 'center', cursor: 'pointer', fontWeight: '800', fontSize: '0.9rem', color: '#4338ca', marginTop: '10px' }}
        onClick={() => setEsRegistro(!esRegistro)}
      >
        {esRegistro ? '¿Ya tienes cuenta? Inicia sesión aquí' : '¿No tienes cuenta? Regístrate gratis'}
      </p>
    </div>
  );
}