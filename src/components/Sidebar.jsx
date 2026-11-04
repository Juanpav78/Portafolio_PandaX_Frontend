import { useEffect } from 'react'
import { Link, useLocation } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRightFromBracket, faArrowUpRightFromSquare, faBriefcase, faCalendarDays, faChartPie, faEnvelope,
  faFileInvoiceDollar, faGear, faLayerGroup, faListCheck, faMoneyBillWave, faQuoteLeft, faTags, faUser, faUsers, faXmark,
} from '@fortawesome/free-solid-svg-icons'
import useAuth from '../hooks/useAuth'
import useProyectos from '../hooks/useProyectos'
import usePlanes from '../hooks/usePlanes'
import useListaAdmin from '../hooks/useListaAdmin'
import LogoNegro from '../assets/PandaX_Black.svg'
import LogoBlanco from '../assets/PandaX_White.svg'

const URL_CODE = import.meta.env.VITE_CODE_URL

// Un enlace está activo si coincide la ruta y también el filtro de sitio: así "Servicios"
// (todos) y "PandaX Code → Servicios y precios" (?sitio=code) no se marcan a la vez.
const useActivo = () => {
  const { pathname, search } = useLocation()
  const sitioActual = new URLSearchParams(search).get('sitio') ?? ''
  return (to, exacto = false) => {
    const [ruta, query = ''] = to.split('?')
    const sitio = new URLSearchParams(query).get('sitio') ?? ''
    const coincideRuta = exacto ? pathname === ruta : pathname === ruta || pathname.startsWith(`${ruta}/`)
    return coincideRuta && sitio === sitioActual
  }
}

const Grupo = ({ titulo, children }) => (
  <div className="mt-5 first:mt-0">
    {titulo && <p className="mb-1 px-3 text-[0.68rem] font-semibold tracking-wider text-subtle uppercase">{titulo}</p>}
    <div className="flex flex-col gap-0.5">{children}</div>
  </div>
)

const Enlace = ({ to, icono, children, contador, sitio, pronto, exacto, onClick }) => {
  const activo = useActivo()(to, exacto)
  return (
    <Link to={to} onClick={onClick} aria-current={activo ? 'page' : undefined}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors
        ${activo ? 'bg-ink-700 font-semibold text-fg' : 'text-muted hover:bg-white/5 hover:text-fg'}`}>
      {sitio
        ? <span className="badge-sitio size-4 justify-center p-0 before:size-1.5" data-sitio={sitio} aria-hidden />
        : <FontAwesomeIcon icon={icono} className="w-4 text-[0.85rem] opacity-80" />}
      <span className="truncate">{children}</span>
      {pronto && <span className="ml-auto rounded bg-ink-700 px-1.5 py-0.5 text-[0.65rem] font-medium text-subtle">Pronto</span>}
      {!pronto && contador > 0 && <span className="ml-auto rounded-full bg-ink-700 px-2 py-0.5 text-xs font-medium text-muted">{contador}</span>}
    </Link>
  )
}

const Externo = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer"
    className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-white/5 hover:text-fg">
    <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="w-4 text-[0.8rem] opacity-70" />
    {children}
  </a>
)

// Barra lateral del admin. En escritorio es fija; en móvil es un cajón que se desliza desde la
// izquierda (el mismo elemento, sólo cambia el transform, para no duplicar el menú en el DOM).
// Separa lo compartido de lo propio de cada web: el mismo contenido puede vivir en ambas.
const Sidebar = ({ abierto, onCerrar, tema }) => {
  const { auth, cerrarSesion } = useAuth()
  const { proyectos } = useProyectos()
  const { planes } = usePlanes()
  const { pathname } = useLocation()
  // Se vuelve a pedir al cambiar de página: así el contador de mensajes nuevos baja en cuanto
  // se leen, sin tener que compartir estado con la pantalla de mensajes.
  const { items: resumen } = useListaAdmin('/admin/resumen', { p: pathname })
  const nuevos = resumen?.mensajesNuevos ?? 0
  const activos = planes.filter(p => p.estado !== 'completado').length

  useEffect(() => {
    if (!abierto) return
    const alPulsar = e => e.key === 'Escape' && onCerrar()
    window.addEventListener('keydown', alPulsar)
    return () => window.removeEventListener('keydown', alPulsar)
  }, [abierto, onCerrar])

  const enlace = props => <Enlace onClick={onCerrar} {...props} />

  return (
    <>
      <AnimatePresence>
        {abierto && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onCerrar}
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        aria-label="Navegación del panel"
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-ink-600 bg-ink-900
          transition-transform duration-300 ease-out lg:translate-x-0 ${abierto ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-16 items-center justify-between border-b border-ink-600 px-4">
          <Link to="/admin" onClick={onCerrar} className="flex items-center gap-2.5">
            <img src={tema === 'oscuro' ? LogoBlanco : LogoNegro} alt="" className="w-7" />
            <span className="font-semibold text-fg">PandaX</span>
            <span className="rounded border border-ink-600 px-1.5 py-0.5 text-[0.65rem] font-medium text-subtle">Admin</span>
          </Link>
          <button onClick={onCerrar} aria-label="Cerrar menú" className="btn btn-subtle btn-icon lg:hidden">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col overflow-y-auto px-3 py-4">
          <Grupo>
            {enlace({ to: '/admin', exacto: true, icono: faChartPie, children: 'Panel' })}
          </Grupo>

          <Grupo titulo="Contenido compartido">
            {enlace({ to: '/admin/proyectos', icono: faLayerGroup, contador: proyectos.length, children: 'Proyectos' })}
            {enlace({ to: '/admin/servicios', icono: faTags, children: 'Servicios' })}
            {enlace({ to: '/admin/testimonios', icono: faQuoteLeft, children: 'Testimonios' })}
            {enlace({ to: '/admin/mensajes', icono: faEnvelope, contador: nuevos, children: 'Mensajes' })}
          </Grupo>

          <Grupo titulo="PandaX Code">
            {enlace({ to: '/admin/servicios?sitio=code', sitio: 'code', children: 'Servicios y precios' })}
            {enlace({ to: '/admin/proyectos?sitio=code', sitio: 'code', children: 'Proyectos de clientes' })}
            {enlace({ to: '/admin/mensajes?sitio=code', sitio: 'code', contador: resumen?.mensajesNuevosPorSitio?.code, children: 'Mensajes de contacto' })}
            {URL_CODE && <Externo href={URL_CODE}>Ver PandaX Code</Externo>}
          </Grupo>

          <Grupo titulo="Portafolio">
            {enlace({ to: '/admin/proyectos?sitio=portafolio', sitio: 'portafolio', children: 'Proyectos' })}
            {enlace({ to: '/admin/mensajes?sitio=portafolio', sitio: 'portafolio', contador: resumen?.mensajesNuevosPorSitio?.portafolio, children: 'Mensajes' })}
            {enlace({ to: '/admin/proximamente/sobre-mi', icono: faUser, pronto: true, children: 'Sobre mí' })}
            <Externo href="/">Ver portafolio</Externo>
          </Grupo>

          <Grupo titulo="Planificación">
            {enlace({ to: '/admin/planes', icono: faListCheck, contador: activos, children: 'Planificador' })}
            {enlace({ to: '/admin/calendario', icono: faCalendarDays, children: 'Calendario' })}
          </Grupo>

          <Grupo titulo="Negocio">
            {enlace({ to: '/admin/proximamente/clientes', icono: faUsers, pronto: true, children: 'Clientes' })}
            {enlace({ to: '/admin/proximamente/cotizaciones', icono: faFileInvoiceDollar, pronto: true, children: 'Cotizaciones' })}
            {enlace({ to: '/admin/proximamente/pagos', icono: faMoneyBillWave, pronto: true, children: 'Pagos' })}
          </Grupo>

          <Grupo titulo="Configuración">
            {enlace({ to: '/admin/configuracion', icono: faGear, children: 'Cuenta y preferencias' })}
          </Grupo>
        </nav>

        <div className="border-t border-ink-600 p-3">
          <div className="flex items-center gap-3 rounded-lg p-1.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ink-700 text-sm font-semibold text-fg">
              {auth.nombre?.[0]?.toUpperCase() ?? <FontAwesomeIcon icon={faBriefcase} />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-fg">{auth.nombre}</p>
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
