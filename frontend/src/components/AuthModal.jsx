import React, { useState } from 'react';
import logo from '../assets/image copy.png';
import './AuthModal.css';

export default function AuthModal() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleView = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        
        {/* LOGO */}
        <div className="auth-logo-container">
          <img src={logo} alt="Herencia de Papá Logo" className="auth-logo" />
        </div>

        {/* HEADER */}
        <div className="auth-header">
          <h2 className="auth-title">
            {isLogin ? 'INICIAR SESIÓN' : 'REGISTRARSE'}
          </h2>
          <p className="auth-description">
            {isLogin
              ? 'Ingresa tu correo y contraseña para continuar.'
              : 'Completa tus datos para crear una nueva cuenta.'}
          </p>
        </div>

        {isLogin ? (
          /* FORMULARIO DE INICIO DE SESIÓN */
          <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
            <div className="auth-fields-container">
              <div className="auth-field">
                <label className="auth-label">Correo electrónico</label>
                <input
                  type="email"
                  placeholder="ejemplo@correo.com"
                  className="auth-input"
                  required
                />
              </div>

              <div className="auth-field">
                <label className="auth-label">Contraseña</label>
                <input
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  className="auth-input"
                  required
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn">
              Entrar
            </button>

            <div className="auth-footer">
              ¿No tienes una cuenta?
              <button type="button" className="auth-toggle-btn" onClick={toggleView}>
                Regístrate
              </button>
            </div>
          </form>
        ) : (
          /* FORMULARIO DE REGISTRO */
          <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
            <div className="auth-fields-container">
              <div className="auth-row">
                <div className="auth-field">
                  <label className="auth-label">Nombre</label>
                  <input
                    type="text"
                    placeholder="Juan"
                    className="auth-input"
                    required
                  />
                </div>
                <div className="auth-field">
                  <label className="auth-label">Apellido</label>
                  <input
                    type="text"
                    placeholder="Pérez"
                    className="auth-input"
                    required
                  />
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label">Correo electrónico</label>
                <input
                  type="email"
                  placeholder="ejemplo@correo.com"
                  className="auth-input"
                  required
                />
              </div>

              <div className="auth-field">
                <label className="auth-label">Contraseña</label>
                <input
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  className="auth-input"
                  required
                />
              </div>

              <div className="auth-field">
                <label className="auth-label">Teléfono (Opcional)</label>
                <input
                  type="tel"
                  placeholder="3001234567"
                  className="auth-input"
                />
              </div>

              <div className="auth-field">
                <label className="auth-label">Rol de Usuario</label>
                <select className="auth-select" required>
                  <option value="1">Administrador</option>
                  <option value="2">Vendedor</option>
                  <option value="3">Cliente</option>
                </select>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn">
              Crear Cuenta
            </button>

            <div className="auth-footer">
              ¿Ya tienes una cuenta?
              <button type="button" className="auth-toggle-btn" onClick={toggleView}>
                Inicia sesión
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
export { AuthModal };
