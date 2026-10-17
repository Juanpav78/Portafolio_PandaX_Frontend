import { createContext, useCallback, useEffect, useRef, useState } from "react"
import clientAxios from "../config/clientAxios"
import useProyectos from "../hooks/useProyectos"

const PlanesContext = createContext()

const mensajeError = (error, porDefecto) => error.response?.data?.msg ?? porDefecto

// Estado del planificador. Se monta dentro del AdminLayout (no en App) porque sólo el panel lo
// usa: el sitio público ni descarga este código ni pide /planes, que además requiere sesión.
const PlanesProvider = ({ children }) => {
  const { mostrarAlerta } = useProyectos()
  const [planes, setPlanes] = useState([])
  const [cargando, setCargando] = useState(true)
  // Copia sincronizada del estado para poder leer el valor previo dentro de los callbacks
  // sin añadir `planes` a sus dependencias (lo que los recrearía en cada cambio).
  const planesRef = useRef(planes)
  useEffect(() => { planesRef.current = planes }, [planes])

  useEffect(() => {
    clientAxios('/planes')
      .then(({ data }) => setPlanes(data.planes))
      .catch(error => mostrarAlerta(mensajeError(error, 'No se pudieron cargar los planes')))
      .finally(() => setCargando(false))
  }, [mostrarAlerta])

  const reemplazar = plan => setPlanes(actuales => actuales.map(p => (p._id === plan._id ? plan : p)))

  // Actualización optimista: el cambio se ve al instante (mover una tarjeta, marcar una tarea)
  // y si el servidor falla se restaura el plan como estaba y se avisa. Sin esto cada click
  // esperaría la ida y vuelta al backend, que en Render puede tardar.
  const optimista = useCallback(async (id, aplicar, peticion, mensajeFallo) => {
    const anterior = planesRef.current.find(p => p._id === id)
    if (!anterior) return
    reemplazar(aplicar(anterior))
    try {
      const { data } = await peticion()
      reemplazar(data)
      return data
    } catch (error) {
      reemplazar(anterior)
      mostrarAlerta(mensajeError(error, mensajeFallo))
      throw error
    }
  }, [mostrarAlerta])

  const crearPlan = useCallback(async datos => {
    try {
      const { data } = await clientAxios.post('/planes', datos)
      setPlanes(actuales => [...actuales, data])
      mostrarAlerta('Plan creado', false)
      return data
    } catch (error) {
      throw new Error(mensajeError(error, 'No se pudo crear el plan'), { cause: error })
    }
  }, [mostrarAlerta])

  const actualizarPlan = useCallback((id, cambios) => optimista(
    id,
    plan => ({ ...plan, ...cambios }),
    () => clientAxios.put(`/planes/${id}`, cambios),
    'No se pudo actualizar el plan'
  ), [optimista])

  const eliminarPlan = useCallback(async id => {
    try {
      const { data } = await clientAxios.delete(`/planes/${id}`)
      setPlanes(actuales => actuales.filter(p => p._id !== id))
      mostrarAlerta(data.msg, false)
    } catch (error) {
      mostrarAlerta(mensajeError(error, 'No se pudo eliminar el plan'))
      throw error
    }
  }, [mostrarAlerta])

  // Agregar no es optimista: la tarea necesita el _id que asigna MongoDB para poder
  // editarla o borrarla después.
  const agregarTarea = useCallback(async (id, tarea) => {
    try {
      const { data } = await clientAxios.post(`/planes/${id}/tareas`, tarea)
      reemplazar(data)
    } catch (error) {
      mostrarAlerta(mensajeError(error, 'No se pudo añadir la tarea'))
      throw error
    }
  }, [mostrarAlerta])

  const actualizarTarea = useCallback((id, tareaId, cambios) => optimista(
    id,
    plan => ({ ...plan, tareas: plan.tareas.map(t => (t._id === tareaId ? { ...t, ...cambios } : t)) }),
    () => clientAxios.put(`/planes/${id}/tareas/${tareaId}`, cambios),
    'No se pudo actualizar la tarea'
  ), [optimista])

  const eliminarTarea = useCallback((id, tareaId) => optimista(
    id,
    plan => ({ ...plan, tareas: plan.tareas.filter(t => t._id !== tareaId) }),
    () => clientAxios.delete(`/planes/${id}/tareas/${tareaId}`),
    'No se pudo eliminar la tarea'
  ), [optimista])

  return (
    <PlanesContext.Provider value={{
      planes, cargando,
      crearPlan, actualizarPlan, eliminarPlan,
      agregarTarea, actualizarTarea, eliminarTarea,
    }}>
      {children}
    </PlanesContext.Provider>
  )
}

export { PlanesProvider }

export default PlanesContext
