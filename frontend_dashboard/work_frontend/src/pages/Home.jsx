import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

function Home() {
    const [mostrarLogin, setMostrarLogin] = useState(false);
    const [modoRecuperar, setModoRecuperar] = useState(false);
    const [correo_usuario, setCorreo] = useState("");
    const [contraseña_usuario, setContraseña] = useState("");
    const [correoRecuperar, setCorreoRecuperar] = useState("");
    const [cargandoRecuperar, setCargandoRecuperar] = useState(false);
    const [mensajeExitoRecuperar, setMensajeExitoRecuperar] = useState("");
    const [error, setError] = useState(null);
    const [cargando, setCargando] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get("login") === "true") {
            setMostrarLogin(true);
            setModoRecuperar(false);
        }
    }, [location.search]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setCargando(true);

        try {
            await login(correo_usuario, contraseña_usuario);
            navigate("/dashboard");
        } catch (err) {
            setError(err.mensaje);
        } finally {
            setCargando(false);
        }
    };

    const handleRecuperarSubmit = (e) => {
        e.preventDefault();
        if (!correoRecuperar.trim()) return;
        setMensajeExitoRecuperar("");
        setCargandoRecuperar(true);

        setTimeout(() => {
            setCargandoRecuperar(false);
            setMensajeExitoRecuperar("el codigo a sido enviado correctamente");
        }, 1500);
    };

    const handleAbrirRecuperar = () => {
        setModoRecuperar(true);
        setError(null);
        setMensajeExitoRecuperar("");
    };

    const handleVolverALogin = () => {
        setModoRecuperar(false);
        setMensajeExitoRecuperar("");
        setCorreoRecuperar("");
        setError(null);
    };

    const handleCerrarLogin = () => {
        setMostrarLogin(false);
        setModoRecuperar(false);
        setMensajeExitoRecuperar("");
        setCorreoRecuperar("");
        setError(null);
    };

    return (
        <div className="home">
            <header className="home__bar">
                <div className="home__bar-actions">
                    <button
                        className="home__login-btn"
                        onClick={() => {
                            setModoRecuperar(false);
                            setMostrarLogin(true);
                        }}
                    >
                        Login
                    </button>
                    <button
                        className="home__register-btn"
                        onClick={() => navigate("/register")}
                    >
                        ¡registrate aqui!
                    </button>
                </div>
            </header>

            <main className="home__content">
                {!mostrarLogin ? (
                    <div className="brand">
                        <div className="brand__box">
                            <h1 className="brand__title">Herencia de Papá</h1>
                        </div>
                        <p className="brand__slogan">Est. 2010</p>
                    </div>
                ) : modoRecuperar ? (
                    <div className="login-panel">
                        <div className="login-panel__wordmark">
                            <span>Herencia de Papá</span>
                        </div>

                        <div className="login-panel__header">
                            <h2 className="login-panel__title">Recuperar contraseña</h2>
                            <p className="login-panel__subtitle">Ingresa tu correo para recibir el código de verificación</p>
                        </div>

                        <form className="login-panel__form" onSubmit={handleRecuperarSubmit}>
                            <input
                                type="email"
                                className="login-panel__input"
                                placeholder="correo electrónico"
                                value={correoRecuperar}
                                onChange={(e) => {
                                    setCorreoRecuperar(e.target.value);
                                    if (mensajeExitoRecuperar) setMensajeExitoRecuperar("");
                                }}
                                required
                            />

                            {mensajeExitoRecuperar && (
                                <p className="login-panel__success">
                                    {mensajeExitoRecuperar}
                                </p>
                            )}

                            <button
                                type="submit"
                                className="login-panel__submit"
                                disabled={cargandoRecuperar}
                            >
                                {cargandoRecuperar ? (
                                    <Loader2 className="login-panel__spinner animate-spin" size={20} />
                                ) : (
                                    "enviar codigo de verificacion"
                                )}
                            </button>

                            <button
                                type="button"
                                className="login-panel__back"
                                onClick={handleVolverALogin}
                            >
                                Volver
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="login-panel">
                        <div className="login-panel__wordmark">
                            <span>Herencia de Papá</span>
                        </div>

                        <form className="login-panel__form" onSubmit={handleSubmit}>
                            <input
                                type="email"
                                className="login-panel__input"
                                placeholder="usuario"
                                value={correo_usuario}
                                onChange={(e) => setCorreo(e.target.value)}
                                required
                            />

                            <input
                                type="password"
                                className="login-panel__input"
                                placeholder="contraseña"
                                value={contraseña_usuario}
                                onChange={(e) => setContraseña(e.target.value)}
                                required
                            />

                            {error && <p className="login-panel__error">{error}</p>}

                            <button
                                type="submit"
                                className="login-panel__submit"
                                disabled={cargando}
                            >
                                {cargando ? "Ingresando..." : "Ingresar"}
                            </button>

                            <button
                                type="button"
                                className="login-panel__forgot"
                                onClick={handleAbrirRecuperar}
                            >
                                recuperar contraseña
                            </button>

                            <button
                                type="button"
                                className="login-panel__forgot"
                                onClick={() => navigate("/register")}
                                style={{ marginTop: "-6px" }}
                            >
                                ¿No tienes cuenta? ¡registrate aqui!
                            </button>

                            <button
                                type="button"
                                className="login-panel__back"
                                onClick={handleCerrarLogin}
                            >
                                Volver
                            </button>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Home;
