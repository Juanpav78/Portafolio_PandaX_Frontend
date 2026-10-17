import { useEffect } from 'react'
import { Link, NavLink } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRightFromBracket, faArrowUpRightFromSquare, faCalendarDays, faGlobe, faLayerGroup, faListCheck, faPlus, faXmark,
} from '@fortawesome/free-solid-svg-icons'
import useAuth from '../hooks/useAuth'
import useProyectos from '../hooks/useProyectos'
import usePlanes from '../hooks/usePlanes'
import Logo from '../assets/PandaX_White.svg'

const claseEnlace = ({ isActive }) =>
  `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all
   ${isActive
    ? 'bg-neon/10 text-fg shadow-[inset_2px_0_0_var(--color-neon)]'
    : 'text-muted hover:bg-white/5 hover:text-fg'}`

// Barra lateral del admin. En escritorio es fija; en móvil es un cajón que se desliza desde
// la izquierda. Es el mismo elemento en ambos casos (sólo cambia el transform), así no se
// duplica el menú en el DOM.
const Sidebar = ({ abierto, onCerrar }) => {
  const { auth, cerrarSesion } = useAuth()
  const { proyectos } = useProyectos()
  const { planes } = usePlanes()
  // El contador del planificador muestra sólo lo que sigue abierto, no el histórico completado
  const activos = planes.filter(p => p.estado !== 'completado').length

  useEffect(() => {
    if (!abierto) return
    const alPulsar = e => e.key === 'Escape' && onCerrar()
    window.addEventListener('keydown', alPulsar)
    return () => window.removeEventListener('keydown', alPulsar)
  }, [abierto, onCerrar])

  return (
    <>
      <AnimatePresence>
        {abierto && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onCerrar}
            className="fixed inset-0 z-40 bg-ink-950/70 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        aria-label="Navegación del panel"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/5 bg-ink-900/95 backdrop-blur-xl
          transition-transform duration-300 ease-out lg:translate-x-0 ${abierto ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-18 items-center justify-between px-5">
          <Link to="/admin" onClick={onCerrar} className="flex items-center gap-2">
            <img src={Logo} alt="" className="w-9" />
            <span className="font-display text-xl text-fg">PandaX<span className="neon-text">{"/>"}</span></span>
            <span className="rounded-md border border-neon/30 bg-neon/10 px-1.5 py-0.5 font-mono text-[0.65rem] text-neon">ADMIN</span>
          </Link>
          <button onClick={onCerrar} aria-label="Cerrar menú" className="btn btn-subtle btn-icon lg:hidden">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 font-mono text-[0.68rem] tracking-widest text-subtle uppercase">Contenido</p>
          {/* end: sin él, "/admin" también quedaría activo en /admin/create y /admin/edit/... */}
          <NavLink to="/admin" end onClick={onCerrar} className={claseEnlace}>
            <FontAwesomeIcon icon={faLayerGroup} className="w-4" />
            Proyectos
            <span className="ml-auto rounded-full bg-white/5 px-2 py-0.5 font-mono text-xs text-muted">{proyectos.length}</span>
          </NavLink>
          <NavLink to="/admin/create" onClick={onCerrar} className={claseEnlace}>
            <FontAwesomeIcon icon={faPlus} className="w-4" />
            Nuevo proyecto
          </NavLink>

          <p className="mt-6 mb-2 px-3 font-mono text-[0.68rem] tracking-widest text-subtle uppercase">Planificación</p>
          <NavLink to="/admin/planes" onClick={onCerrar} className={claseEnlace}>
            <FontAwesomeIcon icon={faListCheck} className="w-4" />
            Planificador
            {activos > 0 && <span className="ml-auto rounded-full bg-neon/15 px-2 py-0.5 font-mono text-xs text-neon">{activos}</span>}
          </NavLink>
          <NavLink to="/admin/calendario" onClick={onCerrar} className={claseEnlace}>
            <FontAwesomeIcon icon={faCalendarDays} className="w-4" />
            Calendario
          </NavLink>

          <p className="mt-6 mb-2 px-3 font-mono text-[0.68rem] tracking-widest text-subtle uppercase">Sitio público</p>
          <a href="/" target="_blank" rel="noopener" className={claseEnlace({ isActive: false })}>
            <FontAwesomeIcon icon={faGlobe} className="w-4" />
            Ver portafolio
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="ml-auto text-xs opacity-0 transition-opacity group-hover:opacity-60" />
          </a>
        </nav>

        <div className="border-t border-white/5 p-3">
          <div className="flex items-center gap-3 rounded-xl p-2">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-linear-to-br from-neon to-neon-pink font-bold text-ink-950">
              {auth.nombre?.[0]?.toUpperCase() ?? '?'}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-fg">{auth.nombre}</p>
              <p className="truncate text-xs text-subtle">{auth.email}</p>
            </div>
            <button onClick={cerrarSesion} aria-label="Cerrar sesión" title="Cerrar sesión"
              className="btn btn-subtle btn-icon hover:text-danger">
              <FontAwesomeIcon icon={faArrowRightFromBracket} />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
