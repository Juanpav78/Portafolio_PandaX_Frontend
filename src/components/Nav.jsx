import { Link, useLocation, useNavigate } from "react-router"
import { SECCIONES } from "../helpers/secciones"
import useIdioma from "../hooks/useIdioma"

// Enlaces a secciones de la home. Si ya estamos en "/", se hace scroll directo y se actualiza el
// hash con replaceState (sin crear entradas en el historial por cada click). Desde otra página se
// navega a "/#id" y es IndexLayout quien hace el scroll cuando la home termina de montarse.
const Nav = ({ activa, onNavegar, className = '', claseEnlace = '' }) => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { t } = useIdioma()

  const irA = (e, id) => {
    e.preventDefault()
    onNavegar?.()
    if (pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      history.replaceState(null, '', id === 'home' ? '/' : `#${id}`)
    } else {
      navigate(id === 'home' ? '/' : `/#${id}`)
    }
  }

  return (
    <nav aria-label={t('nav.main')} className={className}>
      {SECCIONES.map(({ id, clave }) => (
        <Link
          key={id}
          to={id === 'home' ? '/' : `/#${id}`}
          onClick={e => irA(e, id)}
          aria-current={activa === id ? 'true' : undefined}
          className={`relative font-semibold transition-colors hover:text-fg
            ${activa === id ? '' : 'text-muted'} ${claseEnlace}`}
        >
          {t(clave)}
          {/* Subrayado neón del enlace activo */}
          <span className={`absolute -bottom-1.5 left-0 h-0.5 rounded-full bg-linear-to-r from-neon to-neon-pink
            shadow-[0_0_10px_var(--color-neon)] transition-all duration-300 ${activa === id ? 'w-full' : 'w-0'}`} />
        </Link>
      ))}
      <Link
        to="/proyectos"
        onClick={onNavegar}
        aria-current={pathname === '/proyectos' ? 'page' : undefined}
        className={`font-semibold transition-colors hover:text-fg ${pathname === '/proyectos' ? 'text-neon-soft' : 'text-muted'} ${claseEnlace}`}
      >
        {t('nav.allWork')}
      </Link>
    </nav>
  )
}

export default Nav
