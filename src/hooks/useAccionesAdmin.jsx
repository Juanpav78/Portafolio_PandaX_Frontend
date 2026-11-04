import { useCallback } from "react"
import clientAxios from "../config/clientAxios"
import useProyectos from "./useProyectos"

const mensajeError = (error, porDefecto) => error.response?.data?.msg ?? porDefecto

// Acciones repetidas en los listados del admin (servicios, testimonios, mensajes) sobre una
// lista cargada con useListaAdmin. Los avisos usan el toast global del layout.
const useAccionesAdmin = (ruta, setItems) => {
  const { mostrarAlerta } = useProyectos()

  // Optimista: el interruptor cambia al instante y vuelve atrás si el servidor falla
  const alternarPublicado = useCallback(async (item, publicado) => {
    setItems(items => items.map(i => i._id === item._id ? { ...i, publicado } : i))
    try {
      await clientAxios.patch(`${ruta}/${item._id}/publicado`, { publicado })
      mostrarAlerta(publicado ? 'Publicado: ya se ve en las webs elegidas' : 'Oculto: ya no se muestra en las webs', false)
    } catch (error) {
      setItems(items => items.map(i => i._id === item._id ? { ...i, publicado: !publicado } : i))
      mostrarAlerta(mensajeError(error, 'No se pudo cambiar la visibilidad'))
    }
  }, [ruta, setItems, mostrarAlerta])

  // Lanza el error para que el diálogo de confirmación siga abierto y se pueda reintentar
  const eliminar = useCallback(async item => {
    try {
      const { data } = await clientAxios.delete(`${ruta}/${item._id}`)
      setItems(items => items.filter(i => i._id !== item._id))
      mostrarAlerta(data.msg ?? 'Eliminado', false)
    } catch (error) {
      mostrarAlerta(mensajeError(error, 'No se pudo eliminar'))
      throw error
    }
  }, [ruta, setItems, mostrarAlerta])

  return { alternarPublicado, eliminar, mostrarAlerta }
}

export default useAccionesAdmin
