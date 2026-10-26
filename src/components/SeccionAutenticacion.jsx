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
        // Crear nueva cuenta
        await createUserWithEmailAndPassword(auth, email, password);
        triggerToast('¡Cuenta creada e inicio de sesión exitoso! 🎉');
      } else {
        // Iniciar sesión
        await signInWithEmailAndPassword(auth, email, password);
        triggerToast('¡Inicio de sesión exitoso! ⚡');
      }
      // Al ser exitoso, el observador 'onAuthStateChanged' de App.js se activa solo y te da acceso al sitio.
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

      {/* Stickers Decorativos */}
      <svg className="retro-sticker flower-1" viewBox="0 0 100 100">
        <path fill="#FF007A" stroke="#181124" strokeWidth="4" d="M50 20 C40 5, 20 20, 35 35 C20 40, 5 60, 20 75 C35 90, 50 75, 50 75 C50 75, 65 90, 80 75 C95 60, 80 40, 65 35 C80 20, 60 5, 50 20 Z"/>
        <circle cx="50" cy="50" r="14" fill="#FFD200" stroke="#181124" strokeWidth="4"/>
      </svg>

      <svg className="retro-sticker smiley-1" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" fill="#FFD200" stroke="#181124" strokeWidth="5"/>
        <circle cx="35" cy="40" r="5" fill="#181124"/>
        <circle cx="65" cy="40" r="5" fill="#181124"/>
        <path d="M 30 60 Q 50 80 70 60" fill="none" stroke="#181124" strokeWidth="5" strokeLinecap="round"/>
      </svg>

      <svg className="retro-sticker sun-1" viewBox="0 0 100 100">
        <g fill="#FF6B00" stroke="#181124" strokeWidth="4">
          <circle cx="50" cy="50" r="24" fill="#FFD200"/>
          <path d="M50 10 L50 20 M50 80 L50 90 M10 50 L20 50 M80 50 L90 50 M22 22 L29 29 M71 71 L78 78 M22 78 L29 71 M71 29 L78 22" strokeWidth="5" strokeLinecap="round"/>
        </g>
      </svg>

      {/* Card del Login / Registro */}
      <main className="login-container">
        <div className="login-card">
          <div className="card-badge">★ {esRegistro ? 'Regístrate' : 'Welcome'} ★</div>

          <h1 className="login-title">{esRegistro ? 'REGISTRO' : 'LOGIN'}</h1>

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
                  onClick={() => setShowPassword(!showPassword)}
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