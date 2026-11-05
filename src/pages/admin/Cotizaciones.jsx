import { useMemo } from "react"
import { Link, useSearchParams } from "react-router"
import { faFileInvoiceDollar, faPlus } from "@fortawesome/free-solid-svg-icons"
import useListaAdmin from "../../hooks/useListaAdmin"
import Boton from "../../components/Boton"
import EncabezadoPagina from "../../components/admin/EncabezadoPagina"
import EstadoVacio from "../../components/admin/EstadoVacio"
import EtiquetaCotizacion from "../../components/admin/EtiquetaCotizacion"
import { ESTADOS_COTIZACION, codigoCotizacion, fechaDocumento } from "../../helpers/cotizaciones"
import { formatoCOP } from "../../helpers/dinero"

const Cotizaciones = () => {
  const [params, setParams] = useSearchParams()
  const estado = params.get('estado') ?? ''
  // Se trae la lista completa y se filtra aquí: así los conteos de cada estado salen de la misma petición
  const { items, cargando, error, recargar } = useListaAdmin('/admin/quotes')

  const visibles = useMemo(() => estado ? items.filter(q => q.estadoVisible === estado) : items, [items, estado])
  const conteo = valor => items.filter(q => q.estadoVisible === valor).length
  const porCobrar = useMemo(() => items.filter(q => q.estado === 'aceptada').reduce((s, q) => s + q.saldo, 0), [items])

  const elegir = valor => setParams(valor ? { estado: valor } : {}, { replace: true })

  return (
    <>
      <EncabezadoPagina titulo="Cotizaciones"
        descripcion={`Propuestas para tus clientes. Por cobrar en cotizaciones aceptadas: ${formatoCOP(porCobrar)}.`} />

      <div className="-mx-1 mb-4 flex gap-2 overflow-x-auto px-1 pb-1" role="group" aria-label="Filtrar por estado">
        <button type="button" className="chip-filtro" aria-pressed={!estado} onClick={() => elegir('')}>
          Todas <span className="text-xs text-subtle">{items.length}</span>
        </button>
        {ESTADOS_COTIZACION.map(e => (
          <button key={e.valor} type="button" className="chip-filtro" aria-pressed={estado === e.valor} onClick={() => elegir(e.valor)}>
            {e.texto} <span className="text-xs text-subtle">{conteo(e.valor)}</span>
          </button>
        ))}
      </div>

      {error && (
        <EstadoVacio titulo="No se pudieron cargar las cotizaciones" texto={error}>
          <Boton variant="ghost" onClick={recargar}>Reintentar</Boton>
        </EstadoVacio>
      )}

      {!error && cargando && !items.length && <div className="skeleton h-64 rounded-xl" />}

      {!error && !cargando && !visibles.length && (
        <EstadoVacio icono={faFileInvoiceDollar} titulo={estado ? 'No hay cotizaciones en este estado' : 'Aún no hay cotizaciones'}
          texto="Crea una cotización eligiendo un cliente y los servicios de tu catálogo.">
          <Boton to="/admin/cotizaciones/nueva" icon={faPlus}>Nueva cotización</Boton>
        </EstadoVacio>
      )}

      {visibles.length > 0 && (
        <div className="tarjeta overflow-x-auto">
          <table className="tabla min-w-[48rem]">
            <thead>
              <tr><th>Número</th><th>Cliente</th><th>Título</th><th>Estado</th><th className="text-right">Total</th><th className="text-right">Saldo</th><th className="text-right">Válida hasta</th></tr>
            </thead>
            <tbody>
              {visibles.map(q => (
                <tr key={q._id}>
                  <td className="whitespace-nowrap">
                    <Link to={`/admin/cotizaciones/${q._id}`} className="font-mono text-sm font-semibold text-fg hover:text-neon">{codigoCotizacion(q.numero)}</Link>
                  </td>
                  <td>
                    {q.client
                      ? <Link to={`/admin/clientes/${q.client._id}`} className="text-fg hover:text-neon">{q.client.name}</Link>
                      : <span className="text-subtle">Cliente eliminado</span>}
                    {q.client?.company && <p className="text-xs text-subtle">{q.client.company}</p>}
                  </td>
                  <td className="max-w-56 truncate text-muted">{q.title}</td>
                  <td><EtiquetaCotizacion estado={q.estadoVisible} /></td>
                  <td className="text-right tabular-nums text-fg">{formatoCOP(q.total)}</td>
                  <td className="text-right tabular-nums text-muted">{q.estado === 'aceptada' ? formatoCOP(q.saldo) : '—'}</td>
                  <td className="text-right text-xs whitespace-nowrap text-subtle">{fechaDocumento(q.validUntil)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default Cotizaciones
