import { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate, useSearchParams } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons"
import Boton from "./Boton"

const HeaderAdmin = ({ onAbrirMenu }) => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const inputRef = useRef(null)
  const enListado = pathname.replace(/\/$/, '') === '/admin'
  const enPlanificacion = /^\/admin\/(planes|calendario)/.test(pathname)
  // Texto escrito fuera del listado (en editar/crear) antes de pulsar Enter
  const [borrador, setBorrador] = useState('')

  // En el listado la búsqueda filtra en vivo escribiendo en ?q= (la URL es la fuente de verdad,
  // así el botón "Limpiar filtros" del listado también vacía este input). En otras páginas se
  // espera a Enter para no sacar al usuario de un formulario a mitad de edición.
  const valor = enListado ? params.get('q') ?? '' : borrador

  const cambiar = e => {
    const texto = e.target.value
    if (!enListado) return setBorrador(texto)
    setParams(previos => {
      const nuevos = new URLSearchParams(previos)
      if (texto) nuevos.set('q', texto)
      else nuevos.delete('q')
      return nuevos
    }, { replace: true })
  }

  const enviar = e => {
    e.preventDefault()
    if (enListado) return
    navigate(borrador ? `/admin?q=${encodeURIComponent(borrador)}` : '/admin')
    setBorrador('')
  }

  // Atajo "/" (como en GitHub o YouTube) para saltar al buscador desde cualquier parte del
  // panel. Se ignora si el usuario ya está escribiendo en otro campo.
  useEffect(() => {
    const alPulsar = e => {
      const escribiendo = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)
      if (e.key === '/' && !escribiendo) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', alPulsar)
    return () => window.removeEventListener('keydown', alPulsar)
  }, [])

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-ink-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-10">
        <button onClick={onAbrirMenu} aria-label="Abrir menú" className="btn btn-ghost btn-icon lg:hidden">
          <FontAwesomeIcon icon={faBars} className="w-4" />
        </button>

        <form role="search" onSubmit={enviar} className="relative max-w-md flex-1">
          <label htmlFor="buscar-admin" className="sr-only">Buscar proyectos</label>
          <FontAwesomeIcon icon={faMagnifyingGlass} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-subtle" />
          <input
            ref={inputRef}
            id="buscar-admin"
            type="search"
            value={valor}
            onChange={cambiar}
            placeholder="Buscar por nombre, tipo o tecnología…"
            className="field py-2.5 pr-10 pl-11 text-sm"
          />
          <kbd className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 rounded-md border border-white/10 px-1.5 font-mono text-xs text-subtle sm:block">/</kbd>
        </form>

        {/* La acción principal cambia según la sección: en el planificador y el calendario
            lo habitual es apuntar una idea nueva, no publicar un proyecto */}
        {enPlanificacion
          ? pathname !== '/admin/planes/nuevo' && (
            <Boton to="/admin/planes/nuevo" size="sm" icon={faPlus} className="ml-auto">
              <span className="hidden sm:inline">Nueva idea</span>
            </Boton>
          )
          : pathname !== '/admin/create' && (
            <Boton to="/admin/create" size="sm" icon={faPlus} className="ml-auto">
              <span className="hidden sm:inline">Nuevo proyecto</span>
            </Boton>
          )}
      </div>
    </header>
  )
}

export default HeaderAdmin
