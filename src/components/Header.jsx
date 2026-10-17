import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser, faXmark } from "@fortawesome/free-solid-svg-icons";
import Nav from "./Nav";
import { SECCIONES } from "../helpers/secciones";
import Boton from "./Boton";
import useSeccionActiva from "../hooks/useSeccionActiva";
import useIdioma from "../hooks/useIdioma";
import SelectorIdioma from "./SelectorIdioma";
import { WHATSAPP } from "../helpers/redes";
import Logo from "../assets/PandaX_White.svg";

const IDS = SECCIONES.map(s => s.id)

const Header = () => {
  const { pathname } = useLocation();
  const [conScroll, setConScroll] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const activa = useSeccionActiva(IDS, pathname === '/')
  const { t } = useIdioma()

  // Barra de progreso de lectura: useSpring suaviza el valor para que no tiemble con la rueda
  const { scrollYProgress } = useScroll()
  const progreso = useSpring(scrollYProgress, { stiffness: 200, damping: 40 })

  // Arriba del todo el header es transparente para dejar ver el hero; al bajar se vuelve
  // "cristal" para que el texto siga siendo legible sobre cualquier contenido.
  useEffect(() => {
    const alHacerScroll = () => setConScroll(window.scrollY > 24)
    alHacerScroll()
    window.addEventListener('scroll', alHacerScroll, { passive: true })
    return () => window.removeEventListener('scroll', alHacerScroll)
  }, [])

  const solido = conScroll || menuAbierto

  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-300
      ${solido ? 'border-b border-white/5 bg-ink-950/75 backdrop-blur-xl' : 'border-b border-transparent'}`}>
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <Link to='/' className='group flex items-center gap-2' onClick={() => setMenuAbierto(false)}>
          <img className='w-11 transition-transform duration-500 group-hover:-rotate-12' src={Logo} alt="" />
          <span className='font-display text-2xl text-fg'>
            PandaX<span className="neon-text">{"/>"}</span>
          </span>
        </Link>

        <Nav activa={activa} className="hidden items-center gap-8 md:flex" />

        <div className="flex items-center gap-2">
          <SelectorIdioma className="hidden md:flex" />
          <Link to='/login' aria-label={t('nav.admin')} className="btn btn-subtle btn-icon hidden md:inline-flex">
            <FontAwesomeIcon icon={faUser} />
          </Link>
          <Boton href={WHATSAPP} size="sm" className="hidden lg:inline-flex">{t('nav.talk')}</Boton>
          <button
            onClick={() => setMenuAbierto(abierto => !abierto)}
            aria-expanded={menuAbierto}
            aria-controls="menu-movil"
            aria-label={menuAbierto ? t('nav.closeMenu') : t('nav.openMenu')}
            className="btn btn-ghost btn-icon md:hidden"
          >
            <FontAwesomeIcon icon={menuAbierto ? faXmark : faBars} className="w-4" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuAbierto && (
          <motion.div
            id="menu-movil"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/5 md:hidden"
          >
            <Nav
              activa={activa}
              onNavegar={() => setMenuAbierto(false)}
              className="flex flex-col gap-1 px-4 py-4"
              claseEnlace="py-3 text-lg w-fit"
            />
            <div className="flex flex-wrap items-center gap-3 px-4 pb-6">
              <Boton href={WHATSAPP} className="flex-1">{t('nav.talk')}</Boton>
              <Boton to="/login" variant="ghost" icon={faUser} onClick={() => setMenuAbierto(false)}>{t('nav.admin')}</Boton>
              <SelectorIdioma className="movil" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        style={{ scaleX: progreso }}
        className="absolute inset-x-0 bottom-0 h-px origin-left bg-linear-to-r from-neon-amber via-neon to-neon-pink shadow-[0_0_10px_var(--color-neon)]"
      />
    </header>
  )
}

export default Header
