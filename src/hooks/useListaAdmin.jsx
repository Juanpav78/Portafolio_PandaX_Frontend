import { useCallback, useEffect, useState } from "react"
import clientAxios from "../config/clientAxios"

// Carga un listado del admin (/admin/services, /admin/messages…) y lo vuelve a pedir cuando
// cambian los parámetros. `setItems` actualiza la lista tras crear/editar/borrar sin otra
// petición. Los parámetros se comparan como texto para no recargar en cada render.
// `cargando` se deriva de comparar la petición pedida con la última respondida, en vez de
// guardarlo en el estado: así el efecto sólo escribe estado cuando llega la respuesta.
const useListaAdmin = (ruta, params = {}) => {
  const clave = JSON.stringify(params)
  const [version, setVersion] = useState(0)
  const pedida = `${ruta}|${clave}|${version}`
  const [estado, setEstado] = useState({ respondida: null, items: [], error: '' })

  useEffect(() => {
    let activo = true
    clientAxios(ruta, { params: JSON.parse(clave) })
      .then(({ data }) => activo && setEstado({ respondida: pedida, items: data, error: '' }))
      .catch(error => activo && setEstado(e => ({
        ...e, respondida: pedida, error: error.response?.data?.msg ?? 'No se pudo cargar la lista',
      })))
    return () => { activo = false }
  }, [ruta, clave, pedida])

  const recargar = useCallback(() => setVersion(v => v + 1), [])
  const setItems = useCallback(fn => setEstado(e => ({ ...e, items: typeof fn === 'function' ? fn(e.items) : fn })), [])

  return { items: estado.items, error: estado.error, cargando: estado.respondida !== pedida, recargar, setItems }
}

export default useListaAdmin
