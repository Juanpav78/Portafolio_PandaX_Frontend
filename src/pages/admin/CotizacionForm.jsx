import { useState } from "react"
import { Link, useNavigate, useParams, useSearchParams } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFloppyDisk, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons"
import clientAxios from "../../config/clientAxios"
import useDocumentoAdmin from "../../hooks/useDocumentoAdmin"
import useListaAdmin from "../../hooks/useListaAdmin"
import useProyectos from "../../hooks/useProyectos"
import Boton from "../../components/Boton"
import Campo from "../../components/Campo"
import EncabezadoAdmin from "../../components/EncabezadoAdmin"
import EstadoVacio from "../../components/admin/EstadoVacio"
import { ESTADOS_COTIZACION, NOTAS_POR_DEFECTO, aFechaInput, codigoCotizacion, totalLineas } from "../../helpers/cotizaciones"
import { formatoCOP } from "../../helpers/dinero"

const lineaVacia = () => ({ id: crypto.randomUUID(), description: '', quantity: 1, unitPrice: 0 })

// 15 días, igual que el backend cuando no se indica fecha
const fechaPorDefecto = () => aFechaInput(new Date(Date.now() + 15 * 864e5))

const Formulario = ({ inicial }) => {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { mostrarAlerta } = useProyectos()
  const editando = Boolean(inicial)
  const { items: clientes } = useListaAdmin('/admin/clients')
  const { items: servicios } = useListaAdmin('/admin/services')

  const [datos, setDatos] = useState({
    client: inicial?.client?._id ?? inicial?.client ?? params.get('cliente') ?? '',
    title: inicial?.title ?? '',
    validUntil: inicial ? aFechaInput(inicial.validUntil) : fechaPorDefecto(),
    estado: inicial?.estado ?? 'borrador',
    notes: inicial?.notes ?? NOTAS_POR_DEFECTO,
  })
  // Cada línea lleva un id local sólo para que React las distinga al agregar y quitar
  const [lineas, setLineas] = useState(() => inicial?.items?.length
    ? inicial.items.map(i => ({ ...i, id: crypto.randomUUID() }))
    : [lineaVacia()])
  const [errores, setErrores] = useState({})
  const [enviando, setEnviando] = useState(false)

  const cambiar = e => setDatos(d => ({ ...d, [e.target.name]: e.target.value }))
  const cambiarLinea = (id, campo, valor) => setLineas(ls => ls.map(l => l.id === id ? { ...l, [campo]: valor } : l))
  const quitarLinea = id => setLineas(ls => ls.length > 1 ? ls.filter(l => l.id !== id) : [lineaVacia()])

  // Agregar desde el catálogo copia nombre, descripción corta y precio "desde" (editables después)
  const agregarServicio = e => {
    const servicio = servicios.find(s => s._id === e.target.value)
    e.target.value = ''
    if (!servicio) return
    const nueva = { id: crypto.randomUUID(), description: servicio.title, quantity: 1, unitPrice: servicio.priceFrom ?? 0, service: servicio._id }
    // Si la única línea está vacía se reemplaza en vez de dejarla colgando
    setLineas(ls => ls.length === 1 && !ls[0].description && !Number(ls[0].unitPrice) ? [nueva] : [...ls, nueva])
    if (!datos.title) setDatos(d => ({ ...d, title: servicio.title }))
  }

  const total = totalLineas(lineas)

  const enviar = async ev => {
    ev.preventDefault()
    const e = {}
    if (!datos.client) e.client = 'Elige el cliente'
    if (!datos.title.trim()) e.title = 'Escribe un título'
    if (lineas.some(l => !l.description.trim())) e.lineas = 'Todas las líneas necesitan una descripción'
    else if (lineas.some(l => !(Number(l.quantity) > 0) || Number(l.unitPrice) < 0)) e.lineas = 'Revisa cantidades y precios'
    setErrores(e)
    if (Object.keys(e).length) return document.getElementById(Object.keys(e)[0])?.focus()

    setEnviando(true)
    const cuerpo = {
      ...datos,
      items: lineas.map(({ description, quantity, unitPrice, service }) => ({ description, quantity: Number(quantity), unitPrice: Number(unitPrice), service })),
    }
    try {
      const { data } = editando
        ? await clientAxios.put(`/admin/quotes/${inicial._id}`, cuerpo)
        : await clientAxios.post('/admin/quotes', cuerpo)
      mostrarAlerta(editando ? 'Cotización actualizada' : `Cotización ${codigoCotizacion(data.numero)} creada`, false)
      navigate(`/admin/cotizaciones/${data._id}`)
    } catch (error) {
      mostrarAlerta(error.response?.data?.msg ?? 'No se pudo guardar la cotización')
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={enviar} noValidate className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="flex flex-col gap-6">
        <section className="tarjeta flex flex-col gap-5 p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <Campo as="select" label="Cliente" id="client" value={datos.client} onChange={cambiar} error={errores.client}
              extra={<Link to="/admin/clientes/nuevo" className="text-xs font-medium text-neon hover:underline">+ Nuevo cliente</Link>}>
              <option value="">Elige un cliente…</option>
              {clientes.map(c => <option key={c._id} value={c._id}>{c.name}{c.company ? ` · ${c.company}` : ''}</option>)}
            </Campo>
            <Campo label="Título" id="title" value={datos.title} onChange={cambiar} error={errores.title} placeholder="Tienda online para Café Andino" />
          </div>
        </section>

        <section className="tarjeta overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-600 px-5 py-3.5">
            <h2 className="font-semibold text-fg">Líneas</h2>
            <div className="flex flex-wrap gap-2">
              <select aria-label="Agregar desde el catálogo" className="field w-auto py-1.5 text-sm" defaultValue="" onChange={agregarServicio}>
                <option value="">+ Desde el catálogo…</option>
                {servicios.map(s => <option key={s._id} value={s._id}>{s.title}{typeof s.priceFrom === 'number' ? ` · ${formatoCOP(s.priceFrom)}` : ''}</option>)}
              </select>
              <Boton variant="ghost" size="sm" icon={faPlus} onClick={() => setLineas(ls => [...ls, lineaVacia()])}>Línea libre</Boton>
            </div>
          </div>

          <div id="lineas" tabIndex={-1} className="divide-y divide-ink-600">
            {/* Encabezados sólo en pantallas anchas; en celular cada campo lleva su etiqueta */}
            <div className="hidden grid-cols-[minmax(0,1fr)_5rem_9rem_8rem_2.5rem] gap-3 px-5 py-2 text-[0.72rem] font-semibold tracking-wide text-subtle uppercase md:grid">
              <span>Descripción</span><span>Cant.</span><span>Valor unitario</span><span className="text-right">Subtotal</span><span />
            </div>
            {lineas.map((l, i) => (
              <div key={l.id} className="grid grid-cols-2 gap-3 px-5 py-3 md:grid-cols-[minmax(0,1fr)_5rem_9rem_8rem_2.5rem] md:items-center">
                <label className="col-span-2 md:col-span-1">
                  <span className="mb-1 block text-xs text-subtle md:sr-only">Descripción línea {i + 1}</span>
                  <input className="field py-2 text-sm" value={l.description} placeholder="Diseño y desarrollo de…"
                    onChange={e => cambiarLinea(l.id, 'description', e.target.value)} />
                </label>
                <label>
                  <span className="mb-1 block text-xs text-subtle md:sr-only">Cantidad</span>
                  <input className="field py-2 text-sm tabular-nums" type="number" min="1" step="1" value={l.quantity}
                    onChange={e => cambiarLinea(l.id, 'quantity', e.target.value)} />
                </label>
                <label>
                  <span className="mb-1 block text-xs text-subtle md:sr-only">Valor unitario (COP)</span>
                  <input className="field py-2 text-sm tabular-nums" type="number" min="0" step="1000" value={l.unitPrice}
                    onChange={e => cambiarLinea(l.id, 'unitPrice', e.target.value)} />
                </label>
                <p className="self-center text-sm font-medium tabular-nums text-fg md:text-right">{formatoCOP((Number(l.quantity) || 0) * (Number(l.unitPrice) || 0))}</p>
                <button type="button" onClick={() => quitarLinea(l.id)} aria-label={`Quitar línea ${i + 1}`}
                  className="btn btn-subtle btn-icon justify-self-end hover:text-danger"><FontAwesomeIcon icon={faTrash} /></button>
              </div>
            ))}
          </div>
          {errores.lineas && <p className="px-5 pb-3 text-xs font-semibold text-danger">{errores.lineas}</p>}
          <div className="flex items-center justify-end gap-6 border-t border-ink-600 bg-ink-700/50 px-5 py-4">
            <span className="text-sm text-muted">Total (sin IVA)</span>
            <span className="text-xl font-semibold tabular-nums text-fg">{formatoCOP(total)}</span>
          </div>
        </section>

        <section className="tarjeta p-6">
          <Campo as="textarea" label="Notas y condiciones" id="notes" rows={4} value={datos.notes} onChange={cambiar} className="resize-y"
            hint="Aparecen al final de la cotización impresa." />
        </section>
      </div>

      <aside className="flex flex-col gap-6 lg:sticky lg:top-22 lg:self-start">
        <section className="tarjeta flex flex-col gap-5 p-6">
          <Campo as="select" label="Estado" id="estado" value={datos.estado} onChange={cambiar}>
            {ESTADOS_COTIZACION.filter(e => !e.automatico).map(e => <option key={e.valor} value={e.valor}>{e.texto}</option>)}
          </Campo>
          <Campo label="Válida hasta" id="validUntil" type="date" value={datos.validUntil} onChange={cambiar}
            hint="Si pasa esta fecha y sigue «enviada», se marca como vencida." />
        </section>
        <div className="flex gap-3">
          <Boton to={editando ? `/admin/cotizaciones/${inicial._id}` : '/admin/cotizaciones'} variant="ghost">Cancelar</Boton>
          <Boton type="submit" loading={enviando} icon={faFloppyDisk} className="flex-1">{editando ? 'Guardar cambios' : 'Crear cotización'}</Boton>
        </div>
      </aside>
    </form>
  )
}

const CotizacionForm = () => {
  const { id } = useParams()
  const { doc, cargando, error } = useDocumentoAdmin(id ? `/admin/quotes/${id}` : null)

  return (
    <>
      <EncabezadoAdmin etiqueta="Cotizaciones" titulo={id ? `Editar ${codigoCotizacion(doc?.numero)}` : 'Nueva cotización'}
        volver={id ? { to: `/admin/cotizaciones/${id}`, texto: codigoCotizacion(doc?.numero) } : { to: '/admin/cotizaciones', texto: 'Cotizaciones' }} />
      {cargando && <div className="skeleton h-96 rounded-xl" />}
      {error && <EstadoVacio titulo="No se encontró la cotización" texto={error}><Boton to="/admin/cotizaciones" variant="ghost">Volver</Boton></EstadoVacio>}
      {!cargando && !error && <Formulario key={doc?._id ?? 'nueva'} inicial={doc} />}
    </>
  )
}

export default CotizacionForm
