import axios from "axios"

const clientAxios = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`
})

// Adjunta el token de sesión a todas las peticiones si existe. Así ningún contexto tiene que
// armar la cabecera Authorization a mano; las rutas públicas del backend simplemente la ignoran.
clientAxios.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

export default clientAxios
