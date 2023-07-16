import axios from "axios";
import { useState, useEffect, createContext } from "react";

const AuthContext = createContext();

const AuthProvider = ({children}) => {
  const [auth , setAuth] = useState({})
  const [ cargando, setCargando] = useState(true)


  useEffect(()=>{
    const autenticarUsuario = async ()=>{
      const token = localStorage.getItem('token')
      if(!token){
        setCargando(false)
        return
      }

      const config={
        headers: {
          "Content-Type" : "application/json",
          Authorization: `Bearer ${token}`
        }
      }

      try {
        const url = `${import.meta.env.VITE_BACKEND_URL}/api/usuarios/perfil`
        const {data} = await axios(url, config)
        setAuth(data)

      } catch (error) {
        console.log(error)
      } finally{
        setCargando(false)
      }
    }
    autenticarUsuario();
    
    
  }, [])
  return (
    <AuthContext.Provider
    value={{
      auth,
      setAuth,
      cargando
    }}>
        {children}
    </AuthContext.Provider>
  )
}

export{
    AuthProvider
}

export default AuthContext