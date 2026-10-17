import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleCheck, faCircleExclamation, faXmark } from "@fortawesome/free-solid-svg-icons"

// Toast flotante. Debe renderizarse siempre (con msg vacío cuando no hay alerta) para que
// AnimatePresence pueda animar también la salida.
// Va en un portal dentro de <body> para que ningún contenedor con overflow o transform lo
// recorte, y usa role="alert"/"status" para que los lectores de pantalla lo anuncien sin
// mover el foco del usuario.
const Alert = ({ isError = false, msg = "", onClose }) => {
  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 top-4 z-100 flex justify-center px-4 sm:justify-end">
      <AnimatePresence>
        {msg && (
          <motion.div
            key={msg}
            role={isError ? 'alert' : 'status'}
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className={`glass pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl p-4 shadow-2xl
              ${isError ? 'shadow-danger/20' : 'shadow-success/10'}`}
          >
            <FontAwesomeIcon
              icon={isError ? faCircleExclamation : faCircleCheck}
              className={`mt-0.5 text-lg ${isError ? 'text-danger' : 'text-success'}`}
            />
            <p className="flex-1 text-sm font-semibold text-fg">{msg}</p>
            {onClose && (
              <button onClick={onClose} aria-label="Cerrar aviso" className="text-muted transition-colors hover:text-fg">
                <FontAwesomeIcon icon={faXmark} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>,
    document.body
  )
}

export default Alert
