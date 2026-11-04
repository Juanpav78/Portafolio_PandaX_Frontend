import { Link } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight, faEnvelope, faInbox, faLayerGroup, faPlus, faQuoteLeft, faTags } from "@fortawesome/free-solid-svg-icons"
import useAuth from "../../hooks/useAuth"
import useListaAdmin from "../../hooks/useListaAdmin"
import Boton from "../../components/Boton"
import BadgeSitio from "../../components/admin/BadgeSitio"
import EstadoVacio from "../../components/admin/EstadoVacio"
import EtiquetaEstado from "../../components/admin/EtiquetaEstado"
import { SITIOS } from "../../helpers/sitios"
import { fechaRelativa } from "../../helpers/fechas"

// Tarjeta de métrica: total y desglose por sitio con sus badges
const Metrica = ({ titulo, icono, to, total, porSitio, destacado }) => (
  <Link to={to} className="tarjeta group flex flex-col gap-3 p-5 transition-colors hover:border-white/20">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-muted">{titulo}</p>
      <FontAwesomeIcon icon={icono} className="text-subtle" />
    </div>
    <p className={`text-3xl font-semibold tracking-tight ${destacado ? 'text-neon' : 'text-fg'}`}>{total}</p>
    {porSitio && (
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {SITIOS.map(s => (
          <span key={s.valor} className="inline-flex items-center gap-1.5 text-xs text-muted">
            <BadgeSitio sitio={s.valor} /> {porSitio[s.valor] ?? 0}
          </span>
        ))}
      </div>
    )}
  </Link>
)

const Panel = () => {
  const { auth } = useAuth()
  const { items: r, cargando, error, recargar } = useListaAdmin('/admin/resumen')
  const listo = !cargando && !Array.isArray(r)

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-fg">Hola{auth.nombre ? `, ${auth.nombre.split(' ')[0]}` : ''}</h1>
          <p className="mt-1 text-sm text-muted">Resumen de PandaX Code y tu portafolio.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Boton to="/admin/create" size="sm" icon={faPlus}>Nuevo proyecto</Boton>
          <Boton to="/admin/servicios/nuevo" size="sm" variant="ghost" icon={faPlus}>Nuevo servicio</Boton>
        </div>
      </div>

      {error && (
        <EstadoVacio titulo="No se pudo cargar el resumen" texto={error}>
          <Boton variant="ghost" onClick={recargar}>Reintentar</Boton>
        </EstadoVacio>
      )}

      {!error && (
        <section aria-label="Métricas" className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {!listo
            ? Array.from({ length: 4 }, (_, i) => <div key={i} className="skeleton h-32 rounded-xl" />)
            : <>
              <Metrica titulo="Mensajes nuevos" icono={faEnvelope} to="/admin/mensajes?estado=nuevo"
                total={r.mensajesNuevos} porSitio={r.mensajesNuevosPorSitio} destacado={r.mensajesNuevos > 0} />
              <Metrica titulo="Proyectos" icono={faLayerGroup} to="/admin/proyectos" total={r.proyectos.total} porSitio={r.proyectos} />
              <Metrica titulo="Servicios" icono={faTags} to="/admin/servicios"
                total={r.servicios.total} porSitio={r.servicios} />
              <Metrica titulo="Testimonios" icono={faQuoteLeft} to="/admin/testimonios"
                total={r.testimonios.total} porSitio={r.testimonios} />
            </>}
        </section>
      )}

      {listo && (
        <section className="tarjeta overflow-hidden">
          <div className="flex items-center justify-between border-b border-ink-600 px-5 py-3.5">
            <h2 className="font-semibold text-fg">Últimos mensajes</h2>
            <Link to="/admin/mensajes" className="inline-flex items-center gap-1.5 text-sm font-medium text-neon hover:underline">
              Ver todos <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
            </Link>
          </div>
          {r.ultimosMensajes.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
              <FontAwesomeIcon icon={faInbox} className="text-2xl text-subtle" />
              <p className="text-sm text-muted">Aún no llegan mensajes desde los formularios de contacto.</p>
            </div>
          ) : (
            <ul className="divide-y divide-ink-600">
              {r.ultimosMensajes.map(m => (
                <li key={m._id}>
                  <Link to={`/admin/mensajes/${m._id}`} className="flex flex-col gap-1 px-5 py-3.5 transition-colors hover:bg-white/3 sm:flex-row sm:items-center sm:gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-2 truncate text-sm">
                        <span className={`truncate ${m.estado === 'nuevo' ? 'font-semibold text-fg' : 'text-fg'}`}>{m.name}</span>
                        <span className="truncate text-subtle">{m.email}</span>
                      </p>
                      <p className="truncate text-sm text-muted">{m.message}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <BadgeSitio sitio={m.site} />
                      <EtiquetaEstado estado={m.estado} />
                      <span className="w-20 text-right text-xs text-subtle">{fechaRelativa(m.createdAt)}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </>
  )
}

export default Panel
