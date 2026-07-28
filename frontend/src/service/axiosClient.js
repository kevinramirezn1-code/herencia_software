import axios from "axios";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Inyecta el token JWT en cada petición si existe
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Manejo centralizado de errores + logout automático si el token expira
axiosClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const status = error.response?.status;

        // Si el token expiró o es inválido, cerramos sesión automáticamente
        if (status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("usuario");
            window.location.href = "/login";
        }

        const mensaje =
            error.response?.data?.message ||
            error.response?.data?.errors?.[0]?.mensaje ||
            "Ocurrió un error inesperado. Intenta de nuevo.";

        return Promise.reject({
            mensaje,
            status,
            original: error,
        });
    }
);

export default axiosClient;