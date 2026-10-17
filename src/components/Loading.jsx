import { motion } from "framer-motion"
import logo from "../assets/PandaX_White.svg"

// Pantalla de carga a pantalla completa. Sólo se usa cuando no hay nada útil que mostrar
// (validar la sesión del admin, descargar un chunk lazy); las listas usan skeletons.
const Loading = ({ mensaje = 'Cargando' }) => {
  return (
    <div role="status" className="fixed inset-0 z-50 grid place-items-center bg-ink-950">
      <div className="bg-escena" />
      <div className="flex flex-col items-center gap-6">
        <div className="anillo-neon size-24">
          <div className="grid size-full place-items-center rounded-full bg-ink-950">
            <motion.img
              src={logo}
              alt=""
              className="w-12"
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </div>
        <p className="font-mono text-sm tracking-[0.3em] text-muted uppercase">
          {mensaje}
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >...</motion.span>
        </p>
      </div>
    </div>
  )
}

export default Loading
