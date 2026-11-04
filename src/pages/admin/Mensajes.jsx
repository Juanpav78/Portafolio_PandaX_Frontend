import { useMemo } from "react"
import { Link, useSearchParams } from "react-router"
import { faInbox } from "@fortawesome/free-solid-svg-icons"
import useListaAdmin from "../../hooks/useListaAdmin"
import useSitioFiltro from "../../hooks/useSitioFiltro"
import Boton from "../../components/Boton"
import EncabezadoPagina from "../../components/admin/EncabezadoPagina"
import EstadoVacio from "../../components/admin/EstadoVacio"
import FiltroSitio from "../../components/admin/FiltroSitio"
import BadgeSitio from "../../components/admin/BadgeSitio"
import EtiquetaEstado from "../../components/admin/EtiquetaEstado"
import { nombreSitio } from "../../helpers/sitios"
import { ESTADOS_MENSAJE } from "../../helpers/mensajes"
import { fechaRelativa } from "../../helpers/fechas"

// "Activos" (todo menos archivados) es la vista por defecto: es la bandeja de trabajo
const FILTROS_ESTADO = [{ valor: '', texto: 'Activos' }, ...ESTADOS_MENSAJE.map(e => ({ valor: e, texto: e })), { valor: 'todos', texto: 'Todos' }]

const Mensajes = () => {
  const [params, setParams] = useSearchParams()
  const estado = params.get('estado') ?? ''
  const sitio = useSitioFiltro()
  // El estado se filtra en el servidor; el sitio aquí, para que los conteos de cada sitio salgan
  // de la misma respuesta.
  const { items, cargando, error, recargar } = useListaAdmin('/admin/messages', estado ? { estado } : {})

  const visibles = useMemo(() => sitio ? items.filter(m => m.site === sitio) : items, [items, sitio])
  const conteos = useMemo(() => ({
    total: items.length,
    code: items.filter(m => m.site === 'code').length,
    portafolio: items.filter(m => m.site === 'portafolio').length,
  }), [items])

  const elegirEstado = valor => setParams(previos => {
    const nuevos = new URLSearchParams(previos)
    if (valor) nuevos.set('estado', valor)
    else nuevos.delete('estado')
    return nuevos
  }, { replace: true })

  return (
    <>
      <EncabezadoPagina
        titulo={sitio ? `Mensajes · ${nombreSitio(sitio)}` : 'Mensajes'}
        descripcion="Lo que llega por los formularios de contacto. Al abrir un mensaje nuevo se marca como leído."
      />

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <FiltroSitio conteos={conteos} />
        <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1" role="group" aria-label="Filtrar por estado">
          {FILTROS_ESTADO.map(f => (
            <button key={f.valor || 'activos'} type="button" className="chip-filtro capitalize" aria-pressed={estado === f.valor}
              onClick={() => elegirEstado(f.valor)}>{f.texto}</button>
          ))}
        </div>
      </div>

      {error && (
        <EstadoVacio titulo="No se pudieron cargar los mensajes" texto={error}>
          <Boton variant="ghost" onClick={recargar}>Reintentar</Boton>
        </EstadoVacio>
      )}

      {!error && cargando && !items.length && <div className="skeleton h-72 rounded-xl" />}

      {!error && !cargando && !visibles.length && (
        <EstadoVacio icono={faInbox} titulo="No hay mensajes aquí"
          texto={estado || sitio ? 'Prueba con otro filtro.' : 'Cuando alguien escriba desde un formulario de contacto, aparecerá aquí.'} />
      )}

      {visibles.length > 0 && (
        <ul className="tarjeta divide-y divide-ink-600 overflow-hidden">
          {visibles.map(m => (
            <li key={m._id}>
              <Link to={`/admin/mensajes/${m._id}`}
                className="flex flex-col gap-1.5 px-4 py-3.5 transition-colors hover:bg-white/3 sm:flex-row sm:items-center sm:gap-4 sm:px-5">
                <span aria-hidden className={`hidden size-2 shrink-0 rounded-full sm:block ${m.estado === 'nuevo' ? 'bg-neon' : 'bg-transparent'}`} />
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-baseline gap-x-2 text-sm">
                    <span className={m.estado === 'nuevo' ? 'font-semibold text-fg' : 'font-medium text-fg'}>{m.name}</span>
                    <span className="truncate text-subtle">{m.email}</span>
                    {m.service && <span className="text-xs text-muted">· {m.service}</span>}
                  </p>
                  <p className="truncate text-sm text-muted">{m.message}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <BadgeSitio sitio={m.site} />
                  <EtiquetaEstado estado={m.estado} />
                  <time dateTime={m.createdAt} className="w-28 text-right text-xs whitespace-nowrap text-subtle">{fechaRelativa(m.createdAt)}</time>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

export default Mensajes
