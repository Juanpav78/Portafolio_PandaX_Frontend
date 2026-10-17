import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"
import Boton from "./Boton"
import useBloquearScroll from "../hooks/useBloquearScroll"

// Reemplaza window.confirm(): mismo flujo (confirmar/cancelar) pero con el estilo del sitio
// y un estado de carga mientras se ejecuta la acción, para evitar dobles clicks.
// El foco inicial va a "Cancelar": si el usuario pulsa Enter por inercia, no borra nada.
const ConfirmDialog = ({
  abierto, titulo, mensaje, textoConfirmar = 'Eliminar',
  cargando = false, onConfirmar, onCancelar,
}) => {
  const cancelarRef = useRef(null)
  useBloquearScroll(abierto)

  useEffect(() => {
    if (!abierto) return
    cancelarRef.current?.focus()
    const alPulsar = e => { if (e.key === 'Escape' && !cargando) onCancelar() }
    window.addEventListener('keydown', alPulsar)
    return () => window.removeEventListener('keydown', alPulsar)
  }, [abierto, cargando, onCancelar])

  return createPortal(
    <AnimatePresence>
      {abierto && (
        <motion.div
          className="fixed inset-0 z-90 grid place-items-center bg-ink-950/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={() => !cargando && onCancelar()}
        >
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-titulo"
            aria-describedby="confirm-mensaje"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            onClick={e => e.stopPropagation()}
            className="glass w-full max-w-md rounded-2xl p-6 shadow-2xl"
          >
            <div className="mb-4 grid size-12 place-items-center rounded-xl bg-danger/10 text-xl text-danger">
              <FontAwesomeIcon icon={faTriangleExclamation} />
            </div>
            <h2 id="confirm-titulo" className="text-xl font-bold text-fg">{titulo}</h2>
            <p id="confirm-mensaje" className="mt-2 text-muted">{mensaje}</p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Boton ref={cancelarRef} variant="ghost" onClick={onCancelar} disabled={cargando}>
                Cancelar
              </Boton>
              <Boton variant="danger" onClick={onConfirmar} loading={cargando}>
                {textoConfirmar}
              </Boton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default ConfirmDialog
