import { useCallback, useState } from "react"
import { Link, useSearchParams } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMoneyBillWave, faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons"
import useListaAdmin from "../../hooks/useListaAdmin"
import useProyectos from "../../hooks/useProyectos"
import clientAxios from "../../config/clientAxios"
import Boton from "../../components/Boton"
import ConfirmDialog from "../../components/ConfirmDialog"
import EncabezadoPagina from "../../components/admin/EncabezadoPagina"
import EstadoVacio from "../../components/admin/EstadoVacio"
import EtiquetaPago from "../../components/admin/EtiquetaPago"
import { fechaPago, mesBogota, nombreMes, textoMetodo } from "../../helpers/pagos"
import { codigoCotizacion } from "../../helpers/cotizaciones"
import { formatoCOP } from "../../helpers/dinero"

const Pagos = () => {
  const [params, setParams] = useSearchParams()
  const mes = /^\d{4}-\d{2}$/.test(params.get('mes') ?? '') ? params.get('mes') : mesBogota()
  const { items, cargando, error, recargar, setItems } = useListaAdmin('/admin/payments', { mes })
  const pagos = items?.pagos ?? []
  const { mostrarAlerta } = useProyectos()
  const [aEliminar, setAEliminar] = useState(null)
  const [eliminando, setEliminando] = useState(false)
  const cancelar = useCallback(() => setAEliminar(null), [])

  const pendientes = pagos.filter(p => p.estado === 'pendiente').reduce((s, p) => s + p.amount, 0)

  const eliminar = async () => {
    setEliminando(true)
    try {
      await clientAxios.delete(`/admin/payments/${aEliminar._id}`)
      // Se recalcula lo recibido localmente para no pedir de nuevo la lista
      setItems(actual => {
        const restantes = actual.pagos.filter(p => p._id !== aEliminar._id)
        return { pagos: restantes, recibido: restantes.filter(p => p.estado === 'pagado').reduce((s, p) => s + p.amount, 0) }
      })
      mostrarAlerta('Pago eliminado', false)
      setAEliminar(null)
    } catch (err) {
      mostrarAlerta(err.response?.data?.msg ?? 'No se pudo eliminar el pago')
    } finally {
      setEliminando(false)
    }
  }

  return (
    <>
      <EncabezadoPagina titulo="Pagos" descripcion="Abonos y pagos de tus clientes. Sólo los marcados como «Pagado» suman en lo recibido." />

      <div className="mb-4 flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-fg/90">Mes</span>
          <input type="month" className="field w-auto py-2 text-sm" value={mes} max={mesBogota()}
            onChange={e => e.target.value && setParams({ mes: e.target.value }, { replace: true })} />
        </label>
        <div className="tarjeta px-4 py-2.5">
          <p className="text-xs text-subtle">Recibido en {nombreMes(mes)}</p>
          <p className="text-lg font-semibold tabular-nums text-fg">{formatoCOP(items?.recibido)}</p>
        </div>
        {pendientes > 0 && (
          <div className="tarjeta px-4 py-2.5">
            <p className="text-xs text-subtle">Pendiente por confirmar</p>
            <p className="text-lg font-semibold tabular-nums text-neon-amber">{formatoCOP(pendientes)}</p>
          </div>
        )}
      </div>

      {error && (
        <EstadoVacio titulo="No se pudieron cargar los pagos" texto={error}>
          <Boton variant="ghost" onClick={recargar}>Reintentar</Boton>
        </EstadoVacio>
      )}

      {!error && cargando && !pagos.length && <div className="skeleton h-64 rounded-xl" />}

      {!error && !cargando && !pagos.length && (
        <EstadoVacio icono={faMoneyBillWave} titulo={`Sin pagos en ${nombreMes(mes)}`}
          texto="Registra un pago desde aquí, desde una cotización o desde la ficha del cliente.">
          <Boton to="/admin/pagos/nuevo" icon={faPlus}>Registrar pago</Boton>
        </EstadoVacio>
      )}

      {pagos.length > 0 && (
        <div className="tarjeta overflow-x-auto">
          <table className="tabla min-w-[46rem]">
            <thead>
              <tr><th>Fecha</th><th>Cliente</th><th>Cotización</th><th>Método</th><th>Estado</th><th className="text-right">Monto</th><th className="text-right">Acciones</th></tr>
            </thead>
            <tbody>
              {pagos.map(p => (
                <tr key={p._id} className={p.estado === 'reembolsado' ? 'opacity-60' : ''}>
                  <td className="whitespace-nowrap text-muted">{fechaPago(p.date)}</td>
                  <td>
                    {p.client
                      ? <Link to={`/admin/clientes/${p.client._id}`} className="text-fg hover:text-neon">{p.client.name}</Link>
                      : <span className="text-subtle">—</span>}
                  </td>
                  <td>
                    {p.quote
                      ? <Link to={`/admin/cotizaciones/${p.quote._id}`} className="font-mono text-xs text-fg hover:text-neon" title={p.quote.title}>{codigoCotizacion(p.quote.numero)}</Link>
                      : <span className="text-xs text-subtle">Sin cotización</span>}
                  </td>
                  <td className="text-muted">{textoMetodo(p.method)}</td>
                  <td><EtiquetaPago estado={p.estado} /></td>
                  <td className="text-right font-medium tabular-nums text-fg">{formatoCOP(p.amount)}</td>
                  <td>
                    <div className="flex justify-end gap-1">
                      <Link to={`/admin/pagos/${p._id}/editar`} className="btn btn-subtle btn-icon" aria-label="Editar pago" title="Editar"><FontAwesomeIcon icon={faPen} /></Link>
                      <button onClick={() => setAEliminar(p)} className="btn btn-subtle btn-icon hover:text-danger" aria-label="Eliminar pago" title="Eliminar"><FontAwesomeIcon icon={faTrash} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        abierto={Boolean(aEliminar)}
        titulo="¿Eliminar pago?"
        mensaje={<>Se eliminará el pago de <strong className="text-fg">{formatoCOP(aEliminar?.amount)}</strong> de {aEliminar?.client?.name}. Si se devolvió el dinero, es mejor marcarlo como «Reembolsado».</>}
        cargando={eliminando}
        onConfirmar={eliminar}
        onCancelar={cancelar}
      />
    </>
  )
}

export default Pagos
