import { useState, useEffect, createContext, useCallback } from "react";
import clientAxios from "../config/clientAxios";

const AuthContext = createContext();

const AuthProvider = ({children}) => {
  const [auth , setAuth] = useState({})
  // Empieza en true: hasta no validar el token guardado no sabemos si hay sesión, y el
  // AdminLayout debe esperar en vez de redirigir al login por error en cada recarga.
  const [ cargando, setCargando] = useState(true)

  useEffect(()=>{
    const autenticarUsuario = async ()=>{
      const token = localStorage.getItem('token')
      if(!token){
        setCargando(false)
        return
      }

      try {
        // El interceptor de clientAxios añade el token guardado a la petición
        const {data} = await clientAxios('/usuarios/perfil')
        setAuth(data)
      } catch {
        // Token caducado (30 días) o inválido: se descarta para no reintentarlo en cada visita
        localStorage.removeItem('token')
      } finally{
        setCargando(false)
      }
    }
    autenticarUsuario();
  }, [])

  const cerrarSesion = useCallback(()=>{
    localStorage.removeItem('token')
    setAuth({})
  }, [])

  return (
    <AuthContext.Provider
    value={{
      auth,
      setAuth,
      cargando,
      cerrarSesion
    }}>
        {children}
    </AuthContext.Provider>
  )
}

export{
    AuthProvider
}

export default AuthContext
