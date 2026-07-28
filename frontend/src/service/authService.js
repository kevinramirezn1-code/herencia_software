import axiosClient from "./axiosClient";

const authService = {
    login: (credenciales) => axiosClient.post("/auth/login", credenciales),
    registrar: (datosUsuario) => axiosClient.post("/auth/register", datosUsuario),
};

export default authService;