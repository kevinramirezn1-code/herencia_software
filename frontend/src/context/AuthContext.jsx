import { createContext, useContext, useState, useEffect } from "react";
import authService from "../service/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        // Al cargar la app, revisa si ya hay una sesión guardada
        const usuarioGuardado = localStorage.getItem("usuario");
        const token = localStorage.getItem("token");

        if (usuarioGuardado && token) {
            setUsuario(JSON.parse(usuarioGuardado));
        }
        setCargando(false);
    }, []);

    const login = async (correo_usuario, contraseña_usuario) => {
        const respuesta = await authService.login({ correo_usuario, contraseña_usuario });

        localStorage.setItem("token", respuesta.token);
        localStorage.setItem("usuario", JSON.stringify(respuesta.data));
        setUsuario(respuesta.data);

        return respuesta;
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        setUsuario(null);
    };

    return (
        <AuthContext.Provider value={{ usuario, login, logout, cargando }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}