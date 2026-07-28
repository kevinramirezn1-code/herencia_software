import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

function Home() {
    const [mostrarLogin, setMostrarLogin] = useState(false);
    const [correo_usuario, setCorreo] = useState("");
    const [contraseña_usuario, setContraseña] = useState("");
    const [error, setError] = useState(null);
    const [cargando, setCargando] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

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

    return (
        <div className="home">
            <header className="home__bar">
                {!mostrarLogin && (
                    <button
                        className="home__login-btn"
                        onClick={() => setMostrarLogin(true)}
                    >
                        Login
                    </button>
                )}
            </header>

            <main className="home__content">
                {!mostrarLogin ? (
                    <div className="brand">
                        <div className="brand__box">
                            <h1 className="brand__title">Herencia de Papá</h1>
                        </div>
                        <p className="brand__slogan">Est. 2010</p>
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
                                className="login-panel__back"
                                onClick={() => setMostrarLogin(false)}
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