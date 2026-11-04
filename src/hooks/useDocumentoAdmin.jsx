import { useEffect, useState } from "react"
import clientAxios from "../config/clientAxios"

// Carga un documento del admin para editarlo (p. ej. /admin/services/:id). Con `ruta` nula
// (pantalla de "nuevo") no pide nada. Como en useListaAdmin, `cargando` se deriva de comparar
// la ruta pedida con la respondida para no escribir estado de forma síncrona en el efecto.
const useDocumentoAdmin = (ruta) => {
  const [estado, setEstado] = useState({ respondida: null, doc: null, error: '' })

  useEffect(() => {
    if (!ruta) return
    let activo = true
    clientAxios(ruta)
      .then(({ data }) => activo && setEstado({ respondida: ruta, doc: data, error: '' }))
      .catch(error => activo && setEstado({ respondida: ruta, doc: null, error: error.response?.data?.msg ?? 'No se pudo cargar' }))
    return () => { activo = false }
  }, [ruta])

  if (!ruta) return { doc: null, cargando: false, error: '' }
  return { doc: estado.doc, error: estado.error, cargando: estado.respondida !== ruta }
}

export default useDocumentoAdmin
