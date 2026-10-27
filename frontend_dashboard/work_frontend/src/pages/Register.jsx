import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

function Register() {
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [correo, setCorreo] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [telefono, setTelefono] = useState("");
    const [rol, setRol] = useState("3"); // 3: Cliente, 2: Vendedor, 1: Administrador
    const [error, setError] = useState(null);
    const [cargando, setCargando] = useState(false);

    const { registrar } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setCargando(true);

        try {
            await registrar({
                nombre_usuario: nombre,
                apellido_usuario: apellido,
                correo_usuario: correo,
                contraseña_usuario: contraseña,
                telefono_usuario: telefono || undefined,
                fk_usuario_id_rol: Number(rol),
            });
            navigate("/dashboard");
        } catch (err) {
            setError(err.mensaje || err.response?.data?.mensaje || "Error al registrar la cuenta.");
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="home">
            <header className="home__bar">
                <div className="home__bar-actions">
                    <button
                        className="home__login-btn"
                        onClick={() => navigate("/?login=true")}
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
                <div className="login-panel" style={{ width: "360px", maxWidth: "90%" }}>
                    <div className="login-panel__wordmark">
                        <span>Herencia de Papá</span>
                    </div>

                    <div className="login-panel__header">
                        <h2 className="login-panel__title">Crear Cuenta</h2>
                        <p className="login-panel__subtitle">Completa tus datos para registrarte</p>
                    </div>

                    <form className="login-panel__form" onSubmit={handleSubmit}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                            <input
                                type="text"
                                className="login-panel__input"
                                placeholder="Nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                className="login-panel__input"
                                placeholder="Apellido"
                                value={apellido}
                                onChange={(e) => setApellido(e.target.value)}
                                required
                            />
                        </div>

                        <input
                            type="email"
                            className="login-panel__input"
                            placeholder="Correo electrónico"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            required
                        />

                        <input
                            type="password"
                            className="login-panel__input"
                            placeholder="Contraseña (mín. 6 caracteres)"
                            value={contraseña}
                            onChange={(e) => setContraseña(e.target.value)}
                            required
                            minLength={6}
                        />

                        <input
                            type="tel"
                            className="login-panel__input"
                            placeholder="Teléfono (opcional)"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                        />

                        <select
                            className="login-panel__select"
                            value={rol}
                            onChange={(e) => setRol(e.target.value)}
                            required
                        >
                            <option value="3">Cliente</option>
                            <option value="2">Vendedor</option>
                            <option value="1">Administrador</option>
                        </select>

                        {error && <p className="login-panel__error">{error}</p>}

                        <button
                            type="submit"
                            className="login-panel__submit"
                            disabled={cargando}
                        >
                            {cargando ? (
                                <Loader2 className="login-panel__spinner animate-spin" size={20} />
                            ) : (
                                "Registrarse"
                            )}
                        </button>

                        <button
                            type="button"
                            className="login-panel__back"
                            onClick={() => navigate("/?login=true")}
                        >
                            ¿Ya tienes cuenta? Inicia sesión
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default Register;
