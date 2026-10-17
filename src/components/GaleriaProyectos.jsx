import { useCallback, useState } from "react"
import { AnimatePresence } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRotateRight, faServer } from "@fortawesome/free-solid-svg-icons"
import Card from "./Card"
import CardSkeleton from "./CardSkeleton"
import ModalProyectos from "./ModalProyectos"
import Boton from "./Boton"
import useProyectos from "../hooks/useProyectos"
import useIdioma from "../hooks/useIdioma"

// Rejilla de proyectos + un único modal compartido. Guardar aquí el índice abierto (en vez de un
// modal por tarjeta) es lo que permite pasar al anterior/siguiente desde el propio modal.
// También resuelve los estados de carga y error, para que cada página sólo decida QUÉ lista mostrar.
const GaleriaProyectos = ({ proyectos, skeletons = 6, vacio }) => {
  const { cargando, tarda, error, obtenerProyectos } = useProyectos()
  const [abierto, setAbierto] = useState(null)
  const { t } = useIdioma()

  const cerrar = useCallback(() => setAbierto(null), [])
  // Navegación circular: desde el último se vuelve al primero
  const cambiar = useCallback(paso => {
    setAbierto(actual => (actual + paso + proyectos.length) % proyectos.length)
  }, [proyectos.length])

  if (error && !proyectos.length) {
    return (
      <div className="glass mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl p-8 text-center">
        <p className="text-muted">{t('gallery.error')}</p>
        <Boton variant="ghost" icon={faRotateRight} onClick={() => obtenerProyectos({ forzar: true })}>
          {t('gallery.retry')}
        </Boton>
      </div>
    )
  }

  const mostrarSkeletons = cargando && !proyectos.length

  return (
    <>
      {mostrarSkeletons && tarda && (
        <p role="status" className="mx-auto mb-8 flex w-fit items-center gap-3 rounded-full border border-neon/20 bg-neon/5 px-4 py-2 text-sm text-neon-soft">
          <FontAwesomeIcon icon={faServer} className="animate-pulse" />
          {t('gallery.waking')}
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mostrarSkeletons
          ? Array.from({ length: skeletons }, (_, i) => <CardSkeleton key={i} />)
          : (
            // popLayout saca de inmediato del flujo a las tarjetas que salen al filtrar,
            // así las restantes se recolocan con animación en vez de esperar a que terminen.
            <AnimatePresence mode="popLayout">
              {proyectos.map((proyecto, i) => (
                <Card key={proyecto._id} proyecto={proyecto} indice={i} onAbrir={() => setAbierto(i)} />
              ))}
            </AnimatePresence>
          )}
      </div>

      {!mostrarSkeletons && !proyectos.length && vacio}

      <ModalProyectos proyectos={proyectos} indice={abierto} onCerrar={cerrar} onCambiar={cambiar} />
    </>
  )
}

export default GaleriaProyectos
