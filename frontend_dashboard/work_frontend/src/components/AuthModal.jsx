import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/image copy.png';
import './AuthModal.css';

export default function AuthModal({ onCerrar }) {
  const [isLogin, setIsLogin] = useState(true);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const { login, registrar } = useAuth();
  const navigate = useNavigate();

  // Estados de Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");

  // Estados de Registro
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPass, setRegPass] = useState("");
  const [telefono, setTelefono] = useState("");
  const [rol, setRol] = useState("1");

  const toggleView = () => {
    setIsLogin(!isLogin);
    setError(null);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setCargando(true);
    try {
      await login(loginEmail, loginPass);
      if (onCerrar) onCerrar();
      navigate("/dashboard");
    } catch (err) {
      setError(err.mensaje || "Credenciales incorrectas.");
    } finally {
      setCargando(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setCargando(true);
    try {
      await registrar({
        nombre_usuario: nombre,
        apellido_usuario: apellido,
        correo_usuario: regEmail,
        contraseña_usuario: regPass,
        telefono_usuario: telefono,
        fk_usuario_id_rol: Number(rol),
      });
      if (onCerrar) onCerrar();
      navigate("/dashboard");
    } catch (err) {
      setError(err.mensaje || "Error al registrar la cuenta.");
    } finally {
      setCargando(false);
    }
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

        {error && (
          <div style={{ color: "#ef4444", fontSize: "12px", marginBottom: "12px", textAlign: "center" }}>
            {error}
          </div>
        )}

        {isLogin ? (
          /* FORMULARIO DE INICIO DE SESIÓN */
          <form className="auth-form" onSubmit={handleLoginSubmit}>
            <div className="auth-fields-container">
              <div className="auth-field">
                <label className="auth-label">Correo electrónico</label>
                <input
                  type="email"
                  placeholder="ejemplo@correo.com"
                  className="auth-input"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>

              <div className="auth-field">
                <label className="auth-label">Contraseña</label>
                <input
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  className="auth-input"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={cargando}>
              {cargando ? "Ingresando..." : "Entrar"}
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
          <form className="auth-form" onSubmit={handleRegisterSubmit}>
            <div className="auth-fields-container">
              <div className="auth-row">
                <div className="auth-field">
                  <label className="auth-label">Nombre</label>
                  <input
                    type="text"
                    placeholder="Juan"
                    className="auth-input"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>
                <div className="auth-field">
                  <label className="auth-label">Apellido</label>
                  <input
                    type="text"
                    placeholder="Pérez"
                    className="auth-input"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
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
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                />
              </div>

              <div className="auth-field">
                <label className="auth-label">Contraseña</label>
                <input
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  className="auth-input"
                  value={regPass}
                  onChange={(e) => setRegPass(e.target.value)}
                  required
                />
              </div>

              <div className="auth-field">
                <label className="auth-label">Teléfono (Opcional)</label>
                <input
                  type="tel"
                  placeholder="3001234567"
                  className="auth-input"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
              </div>

              <div className="auth-field">
                <label className="auth-label">Rol de Usuario</label>
                <select
                  className="auth-select"
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                  required
                >
                  <option value="1">Administrador</option>
                  <option value="2">Vendedor</option>
                  <option value="3">Cliente</option>
                </select>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={cargando}>
              {cargando ? "Creando Cuenta..." : "Crear Cuenta"}
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
