import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronLeft, faChevronRight, faXmark } from "@fortawesome/free-solid-svg-icons"
import DetalleProyecto from "./DetalleProyecto"
import useBloquearScroll from "../hooks/useBloquearScroll"
import useIdioma from "../hooks/useIdioma"

// Modal de detalle con navegación entre proyectos.
// Teclado: Esc cierra, ← / → cambian de proyecto. Al abrir se enfoca el botón de cerrar y al
// cerrar se devuelve el foco a la tarjeta que lo abrió, para que quien navega con teclado no
// pierda su posición en la página.
const ModalProyectos = ({ proyectos, indice, onCerrar, onCambiar }) => {
  const abierto = indice !== null
  const proyecto = abierto ? proyectos[indice] : null
  const cerrarRef = useRef(null)
  const { t } = useIdioma()
  useBloquearScroll(abierto)

  useEffect(() => {
    if (!abierto) return
    const origen = document.activeElement
    cerrarRef.current?.focus()
    return () => origen?.focus?.()
  }, [abierto])

  useEffect(() => {
    if (!abierto) return
    const alPulsar = e => {
      if (e.key === 'Escape') onCerrar()
      if (e.key === 'ArrowRight') onCambiar(1)
      if (e.key === 'ArrowLeft') onCambiar(-1)
    }
    window.addEventListener('keydown', alPulsar)
    return () => window.removeEventListener('keydown', alPulsar)
  }, [abierto, onCerrar, onCambiar])

  const varios = proyectos.length > 1

  return createPortal(
    <AnimatePresence>
      {proyecto && (
        <motion.div
          className="fixed inset-0 z-80 overflow-y-auto bg-ink-950/80 backdrop-blur-md"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onCerrar}
        >
          <div className="flex min-h-full items-center justify-center p-4 sm:p-8">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-proyecto-titulo"
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={e => e.stopPropagation()}
              className="glass neon-border relative w-full max-w-3xl rounded-3xl p-5 shadow-2xl sm:p-8"
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                {varios
                  ? <span className="font-mono text-xs text-subtle">{String(indice + 1).padStart(2, '0')} / {String(proyectos.length).padStart(2, '0')}</span>
                  : <span />}
                <div className="flex items-center gap-1">
                  {varios && (
                    <>
                      <button onClick={() => onCambiar(-1)} aria-label={t('modal.prev')}
                        className="btn btn-subtle btn-icon"><FontAwesomeIcon icon={faChevronLeft} /></button>
                      <button onClick={() => onCambiar(1)} aria-label={t('modal.next')}
                        className="btn btn-subtle btn-icon"><FontAwesomeIcon icon={faChevronRight} /></button>
                    </>
                  )}
                  <button ref={cerrarRef} onClick={onCerrar} aria-label={t('modal.close')}
                    className="btn btn-subtle btn-icon text-lg"><FontAwesomeIcon icon={faXmark} /></button>
                </div>
              </div>

              {/* key por id: al cambiar de proyecto el contenido entra con su propia animación */}
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={proyecto._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <DetalleProyecto proyecto={proyecto} idTitulo="modal-proyecto-titulo" />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default ModalProyectos
