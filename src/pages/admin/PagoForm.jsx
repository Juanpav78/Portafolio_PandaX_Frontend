import { useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router"
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons"
import clientAxios from "../../config/clientAxios"
import useDocumentoAdmin from "../../hooks/useDocumentoAdmin"
import useListaAdmin from "../../hooks/useListaAdmin"
import useProyectos from "../../hooks/useProyectos"
import Boton from "../../components/Boton"
import Campo from "../../components/Campo"
import EncabezadoAdmin from "../../components/EncabezadoAdmin"
import EstadoVacio from "../../components/admin/EstadoVacio"
import { ESTADOS_PAGO, METODOS_PAGO, fechaInputBogota, hoyBogota } from "../../helpers/pagos"
import { codigoCotizacion } from "../../helpers/cotizaciones"
import { formatoCOP } from "../../helpers/dinero"

const Formulario = ({ inicial }) => {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { mostrarAlerta } = useProyectos()
  const editando = Boolean(inicial)

  const [datos, setDatos] = useState({
    client: inicial?.client ?? params.get('cliente') ?? '',
    quote: inicial?.quote ?? params.get('cotizacion') ?? '',
    amount: inicial?.amount ?? '',
    date: inicial ? fechaInputBogota(inicial.date) : hoyBogota(),
    method: inicial?.method ?? 'transferencia',
    estado: inicial?.estado ?? 'pagado',
    notes: inicial?.notes ?? '',
  })
  const [errores, setErrores] = useState({})
  const [enviando, setEnviando] = useState(false)

  const { items: clientes } = useListaAdmin('/admin/clients')
  // Sólo las cotizaciones del cliente elegido: un pago no puede cubrir la de otro cliente
  const { items: cotizaciones } = useListaAdmin('/admin/quotes', datos.client ? { client: datos.client } : { client: 'ninguno' })
  const cotizacion = cotizaciones.find(q => q._id === datos.quote)

  // Mientras no se escriba un monto, se propone el saldo de la cotización elegida. Se deriva
  // (no se copia al estado) porque la lista de cotizaciones llega después de montar el formulario,
  // por ejemplo al venir desde «Registrar pago» de una cotización.
  const [montoTocado, setMontoTocado] = useState(editando)
  const monto = montoTocado || datos.amount !== '' ? datos.amount : (cotizacion?.saldo || '')

  const cambiar = e => setDatos(d => ({ ...d, [e.target.name]: e.target.value }))
  const cambiarMonto = e => { setMontoTocado(true); cambiar(e) }
  const cambiarCliente = e => setDatos(d => ({ ...d, client: e.target.value, quote: '' }))
  const cambiarCotizacion = e => setDatos(d => ({ ...d, quote: e.target.value }))

  const enviar = async ev => {
    ev.preventDefault()
    const e = {}
    if (!datos.client) e.client = 'Elige el cliente'
    if (!(Number(monto) > 0)) e.amount = 'Escribe un monto mayor que 0'
    if (!datos.date) e.date = 'Elige la fecha'
    setErrores(e)
    if (Object.keys(e).length) return document.getElementById(Object.keys(e)[0])?.focus()

    setEnviando(true)
    try {
      const cuerpo = { ...datos, amount: Number(monto) }
      if (editando) await clientAxios.put(`/admin/payments/${inicial._id}`, cuerpo)
      else await clientAxios.post('/admin/payments', cuerpo)
      mostrarAlerta(editando ? 'Pago actualizado' : 'Pago registrado', false)
      // Vuelve a donde tiene sentido ver el efecto del pago
      navigate(datos.quote ? `/admin/cotizaciones/${datos.quote}` : `/admin/clientes/${datos.client}`)
    } catch (error) {
      mostrarAlerta(error.response?.data?.msg ?? 'No se pudo guardar el pago')
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={enviar} noValidate className="tarjeta flex max-w-3xl flex-col gap-5 p-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <Campo as="select" label="Cliente" id="client" value={datos.client} onChange={cambiarCliente} error={errores.client}>
          <option value="">Elige un cliente…</option>
          {clientes.map(c => <option key={c._id} value={c._id}>{c.name}{c.company ? ` · ${c.company}` : ''}</option>)}
        </Campo>
        <Campo as="select" label="Cotización (opcional)" id="quote" value={datos.quote} onChange={cambiarCotizacion} disabled={!datos.client}
          hint={cotizacion ? `Total ${formatoCOP(cotizacion.total)} · saldo ${formatoCOP(cotizacion.saldo)}` : 'Liga el pago a una cotización para llevar su saldo.'}>
          <option value="">Sin cotización</option>
          {cotizaciones.map(q => <option key={q._id} value={q._id}>{codigoCotizacion(q.numero)} · {q.title}</option>)}
        </Campo>
        <Campo label="Monto (COP)" id="amount" type="number" min="1" step="1000" value={monto} onChange={cambiarMonto} error={errores.amount} placeholder="500000"
          hint={monto ? formatoCOP(monto) : undefined} />
        <Campo label="Fecha" id="date" type="date" value={datos.date} onChange={cambiar} error={errores.date} max={hoyBogota()} />
        <Campo as="select" label="Método" id="method" value={datos.method} onChange={cambiar}>
          {METODOS_PAGO.map(m => <option key={m.valor} value={m.valor}>{m.texto}</option>)}
        </Campo>
        <Campo as="select" label="Estado" id="estado" value={datos.estado} onChange={cambiar}
          hint="«Pendiente» sirve para anotar un abono acordado que aún no llega.">
          {ESTADOS_PAGO.map(e => <option key={e.valor} value={e.valor}>{e.texto}</option>)}
        </Campo>
      </div>
      <Campo as="textarea" label="Notas (opcional)" id="notes" rows={3} value={datos.notes} onChange={cambiar} className="resize-y"
        placeholder="Referencia de la transferencia, primer abono del 50 %…" />
      <div className="flex gap-3">
        <Boton to="/admin/pagos" variant="ghost">Cancelar</Boton>
        <Boton type="submit" loading={enviando} icon={faFloppyDisk}>{editando ? 'Guardar cambios' : 'Registrar pago'}</Boton>
      </div>
    </form>
  )
}

const PagoForm = () => {
  const { id } = useParams()
  const { doc, cargando, error } = useDocumentoAdmin(id ? `/admin/payments/${id}` : null)

  return (
    <>
      <EncabezadoAdmin etiqueta="Pagos" titulo={id ? 'Editar pago' : 'Registrar pago'} volver={{ to: '/admin/pagos', texto: 'Pagos' }} />
      {cargando && <div className="skeleton h-80 max-w-3xl rounded-xl" />}
      {error && <EstadoVacio titulo="No se encontró el pago" texto={error}><Boton to="/admin/pagos" variant="ghost">Volver</Boton></EstadoVacio>}
      {!cargando && !error && <Formulario key={doc?._id ?? 'nuevo'} inicial={doc} />}
    </>
  )
}

export default PagoForm
