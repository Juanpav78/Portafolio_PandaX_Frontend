import { motion } from "framer-motion"
import { Link } from "react-router"
import Logo from "../assets/PandaX_White.svg"

// Contenedor común de login, registro y recuperación de contraseña. Centraliza el layout
// para que las páginas sólo se ocupen de su formulario y su lógica.
const AuthCard = ({ titulo, subtitulo, children, pie }) => {
  return (
    <main className="grid min-h-[calc(100vh-5rem)] place-items-center px-4 pt-28 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="glass neon-border neon-glow w-full max-w-md rounded-3xl p-8 sm:p-10"
      >
        <Link to="/" className="mx-auto mb-6 block w-fit" aria-label="Volver al inicio">
          <img src={Logo} alt="" className="w-14 drop-shadow-[0_0_14px_rgba(255,106,61,0.6)]" />
        </Link>
        <h1 className="text-center font-display text-3xl text-fg">{titulo}</h1>
        {subtitulo && <p className="mt-2 text-center text-muted">{subtitulo}</p>}
        <div className="mt-8">{children}</div>
        {pie && <div className="mt-6 border-t border-white/5 pt-6 text-center text-sm text-muted">{pie}</div>}
      </motion.div>
    </main>
  )
}

export default AuthCard
