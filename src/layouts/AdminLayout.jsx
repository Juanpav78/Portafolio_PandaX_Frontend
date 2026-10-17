import { useCallback, useEffect, useState } from "react"
import { Outlet, Navigate } from "react-router"
import useAuth from "../hooks/useAuth"
import useProyectos from "../hooks/useProyectos"
import HeaderAdmin from "../components/HeaderAdmin"
import Sidebar from "../components/Sidebar"
import Loading from "../components/Loading"
import Alert from "../components/Alert"
import { PlanesProvider } from "../context/PlanesProvider"

const AdminLayout = () => {
  const {auth, cargando} = useAuth();
  const {obtenerProyectos, alerta, cerrarAlerta} = useProyectos();
  // Sólo afecta a pantallas pequeñas: en escritorio el sidebar siempre está visible
  const [menuAbierto, setMenuAbierto] = useState(false)
  const cerrarMenu = useCallback(() => setMenuAbierto(false), [])

  useEffect(()=>{
    obtenerProyectos()
  },[obtenerProyectos])

  // Mientras se valida el token guardado no se sabe si hay sesión: redirigir ya mandaría al
  // login a un admin legítimo en cada recarga de página.
  if(cargando) return <Loading mensaje="Verificando sesión" />
  if(!auth._id) return <Navigate to="/login" replace />

  return (
    <PlanesProvider>
    <div className="min-h-screen lg:pl-72">
      <div className="bg-escena" />
      <Sidebar abierto={menuAbierto} onCerrar={cerrarMenu} />
      <div className="flex min-h-screen flex-col">
        <HeaderAdmin onAbrirMenu={() => setMenuAbierto(true)} />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-10">
          <Outlet />
        </main>
      </div>
      {/* Toast global del admin: lo alimenta ProyectosProvider, así sigue visible aunque la
          acción (crear, editar, eliminar) navegue a otra página justo después */}
      <Alert isError={alerta.error} msg={alerta.msg} onClose={cerrarAlerta} />
    </div>
    </PlanesProvider>
  )
}

export default AdminLayout
