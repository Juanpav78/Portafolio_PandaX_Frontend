import { useEffect } from "react"
import { useLocation } from "react-router"
import { motion } from "framer-motion"
import { faArrowLeft, faHouse, faLayerGroup } from "@fortawesome/free-solid-svg-icons"
import Boton from "../components/Boton"
import PandaPerdido from "../components/PandaPerdido"
import useIdioma from "../hooks/useIdioma"

// Página 404. Se usa en el sitio público y dentro del admin (`admin` cambia los destinos de
// los botones para no sacar al administrador del panel).
const NoEncontrada = ({ admin = false }) => {
  const { pathname } = useLocation()
  const { t } = useIdioma()

  // Título de pestaña propio: quien tenga varias pestañas abiertas ve de un vistazo que esta
  // falló. Se restaura el anterior al salir para no dejarlo "pegado" en otras páginas.
  useEffect(() => {
    const anterior = document.title
    document.title = '404 · PandaX'
    return () => { document.title = anterior }
  }, [])

  return (
    <main className={`grid place-items-center px-4 ${admin ? 'py-8' : 'min-h-svh pt-28 pb-16'}`}>
      <div className="grid w-full max-w-5xl items-center gap-8 md:grid-cols-2">
        <div className="relative mx-auto w-full max-w-sm">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 120, damping: 14 }}
            className="relative"
          >
            <PandaPerdido className="w-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center md:text-left"
        >
          {/* El número va aquí y no detrás del panda: detrás quedaba tapado y se leía "4 4" */}
          <p aria-hidden className="neon-text animate-flicker font-display text-8xl leading-none select-none sm:text-9xl">404</p>
          <p className="mt-4 font-mono text-sm text-neon">{t('notFound.label')}</p>
          <h1 className="mt-2 font-display text-4xl text-fg sm:text-5xl">
            {t('notFound.title')} <span className="neon-text">{t('notFound.highlight')}</span>
          </h1>
          <p className="mt-4 text-lg text-muted">{t('notFound.text')}</p>
          {/* Se muestra la ruta pedida para que se note si fue un error al escribir el enlace */}
          <p className="mt-4 inline-block max-w-full truncate rounded-lg border border-white/10 bg-white/3 px-3 py-1.5 font-mono text-sm text-subtle">
            {pathname}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
            {admin ? (
              <Boton to="/admin" icon={faLayerGroup}>Volver al panel</Boton>
            ) : (
              <>
                <Boton to="/" icon={faHouse}>{t('notFound.home')}</Boton>
                <Boton to="/proyectos" variant="ghost">{t('notFound.projects')}</Boton>
              </>
            )}
            {/* Sólo si hay historial dentro del sitio; si se llegó por un enlace externo,
                "atrás" sacaría al visitante de la web */}
            {window.history.state?.idx > 0 && (
              <Boton variant="subtle" icon={faArrowLeft} onClick={() => window.history.back()}>{t('notFound.back')}</Boton>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  )
}

export default NoEncontrada
