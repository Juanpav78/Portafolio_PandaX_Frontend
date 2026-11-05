import { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate, useSearchParams } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faMagnifyingGlass, faMoon, faPlus, faSun } from "@fortawesome/free-solid-svg-icons"
import Boton from "./Boton"

const LISTADO = '/admin/proyectos'

// Acción principal según la sección: en cada listado lo habitual es crear un elemento de ese tipo
const ACCIONES = [
  { prefijo: '/admin/planes', to: '/admin/planes/nuevo', texto: 'Nueva idea' },
  { prefijo: '/admin/calendario', to: '/admin/planes/nuevo', texto: 'Nueva idea' },
  { prefijo: '/admin/servicios', to: '/admin/servicios/nuevo', texto: 'Nuevo servicio' },
  { prefijo: '/admin/testimonios', to: '/admin/testimonios/nuevo', texto: 'Nuevo testimonio' },
  { prefijo: '/admin/proyectos', to: '/admin/create', texto: 'Nuevo proyecto' },
  { prefijo: '/admin/clientes', to: '/admin/clientes/nuevo', texto: 'Nuevo cliente' },
  { prefijo: '/admin/cotizaciones', to: '/admin/cotizaciones/nueva', texto: 'Nueva cotización' },
]

const HeaderAdmin = ({ onAbrirMenu, tema, setTema }) => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const inputRef = useRef(null)
  const enListado = pathname.replace(/\/$/, '') === LISTADO
  // Texto escrito fuera del listado de proyectos antes de pulsar Enter
  const [borrador, setBorrador] = useState('')
  const accion = ACCIONES.find(a => pathname.startsWith(a.prefijo))
  // Si el listado está filtrado por sitio, lo nuevo se crea ya marcado para ese sitio
  const sitio = params.get('sitio')
  const destino = accion && (sitio ? `${accion.to}?sitio=${sitio}` : accion.to)

  // En el listado la búsqueda filtra en vivo escribiendo en ?q= (la URL es la fuente de verdad,
  // así "Limpiar filtros" también vacía este input). En otras páginas se espera a Enter para no
  // sacar al usuario de un formulario a mitad de edición.
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
    navigate(borrador ? `${LISTADO}?q=${encodeURIComponent(borrador)}` : LISTADO)
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

  const oscuro = tema === 'oscuro'

  return (
    <header className="sticky top-0 z-30 border-b border-ink-600 bg-ink-950/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button onClick={onAbrirMenu} aria-label="Abrir menú" className="btn btn-ghost btn-icon lg:hidden">
          <FontAwesomeIcon icon={faBars} className="w-4" />
        </button>

        <form role="search" onSubmit={enviar} className="relative max-w-sm flex-1">
          <label htmlFor="buscar-admin" className="sr-only">Buscar proyectos</label>
          <FontAwesomeIcon icon={faMagnifyingGlass} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sm text-subtle" />
          <input
            ref={inputRef}
            id="buscar-admin"
            type="search"
            value={valor}
            onChange={cambiar}
            placeholder="Buscar proyectos…"
            className="field py-2 pr-9 pl-10 text-sm"
          />
          <kbd className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 rounded border border-ink-600 px-1.5 text-xs text-subtle sm:block">/</kbd>
        </form>

        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => setTema(oscuro ? 'claro' : 'oscuro')} className="btn btn-subtle btn-icon"
            aria-label={oscuro ? 'Usar modo claro' : 'Usar modo oscuro'} title={oscuro ? 'Modo claro' : 'Modo oscuro'}>
            <FontAwesomeIcon icon={oscuro ? faSun : faMoon} />
          </button>
          {accion && pathname !== accion.to && (
            <Boton to={destino} size="sm" icon={faPlus}>
              <span className="hidden sm:inline">{accion.texto}</span>
            </Boton>
          )}
        </div>
      </div>
    </header>
  )
}

export default HeaderAdmin
