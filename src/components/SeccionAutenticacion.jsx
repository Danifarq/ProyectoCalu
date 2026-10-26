import React, { useState } from 'react';
import { auth } from '../firebase/configuracionFirebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';


export default function SeccionAutenticacion() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [esRegistro, setEsRegistro] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [cargando, setCargando] = useState(false);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      if (esRegistro) {
        await createUserWithEmailAndPassword(auth, email, password);
        triggerToast('¡Cuenta creada e inicio de sesión exitoso! 🎉');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        triggerToast('¡Inicio de sesión exitoso! ⚡');
      }
    } catch (error) {
      console.error("Error de autenticación:", error);
      let mensajeError = "Ocurrió un error al ingresar";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        mensajeError = "Usuario o contraseña incorrectos ❌";
      } else if (error.code === 'auth/email-already-in-use') {
        mensajeError = "El email ya está registrado ⚠️";
      } else if (error.code === 'auth/weak-password') {
        mensajeError = "La contraseña debe tener al menos 6 caracteres 🔑";
      }
      triggerToast(mensajeError);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="auth-section-wrapper">
      {/* Fondo Mosaico */}
      <div className="bg-collage">
        <div className="tile tile-waves"></div>
        <div className="tile tile-checkers"></div>
        <div className="tile tile-sunburst"></div>
        <div className="tile tile-stripes"></div>
        <div className="tile tile-dots"></div>
        <div className="tile tile-blue-wavy"></div>
        <div className="tile tile-checkers"></div>
        <div className="tile tile-waves"></div>
        <div className="tile tile-sunburst"></div>
        <div className="tile tile-stripes"></div>
        <div className="tile tile-dots"></div>
        <div className="tile tile-blue-wavy"></div>
      </div>

     {/* Card del Login / Registro */}
      <main className="login-container">
        <div className="login-card">
         

          <div className="card-badge">★ {esRegistro ? 'Regístrate' : 'Bienvenida'} ★</div>

          <h1 className="login-title">{esRegistro ? 'REGISTRO' : 'INICIA SESIóN'}</h1>
          
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input 
                  type="email" 
                  className="retro-input" 
                  placeholder="Correo electrónico" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  className="retro-input" 
                  placeholder="Contraseña" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  autoComplete="current-password"
                />
                <button 
                  type="button" 
                  className="toggle-password" 
                  onclick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️‍🗨️' : '👁️'}
                </button>
              </div>
            </div>

            {!esRegistro && (
              <div className="forgot-link-wrapper">
                <a 
                  href="#forgot" 
                  className="forgot-link" 
                  onClick={(e) => { e.preventDefault(); triggerToast('Instrucciones enviadas a tu correo ✨'); }}
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            )}

            <button type="submit" className="btn-login" disabled={cargando}>
              {cargando ? 'Cargando...' : esRegistro ? '¡Registrarme!' : '¡Ingresar!'}
            </button>
          </form>

          <p className="signup-text" style={{ marginTop: '1.5rem' }}>
            {esRegistro ? '¿Ya tienes una cuenta?' : '¿No tienes cuenta?'} 
            <a 
              href="#toggle" 
              className="signup-link" 
              onClick={(e) => { e.preventDefault(); setEsRegistro(!esRegistro); }}
            >
              {esRegistro ? ' Inicia Sesión' : ' Regístrate'}
            </a>
          </p>
        </div>
      </main>

      {/* Toast Flotante */}
      <div className={`toast-retro ${showToast ? 'show' : ''}`}>
        {toastMessage}
      </div>
    </div>
  );
}