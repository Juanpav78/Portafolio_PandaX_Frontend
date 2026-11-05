import { useCallback, useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import { faCopy, faMoneyBillWave, faPen, faPrint, faTrash } from "@fortawesome/free-solid-svg-icons"
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons"
import clientAxios from "../../config/clientAxios"
import useDocumentoAdmin from "../../hooks/useDocumentoAdmin"
import useProyectos from "../../hooks/useProyectos"
import Boton from "../../components/Boton"
import ConfirmDialog from "../../components/ConfirmDialog"
import EncabezadoAdmin from "../../components/EncabezadoAdmin"
import EstadoVacio from "../../components/admin/EstadoVacio"
import EtiquetaCotizacion from "../../components/admin/EtiquetaCotizacion"
import { EMPRESA, ESTADOS_COTIZACION, codigoCotizacion, fechaDocumento } from "../../helpers/cotizaciones"
import { formatoCOP } from "../../helpers/dinero"
import { fechaPago, textoMetodo } from "../../helpers/pagos"
import Logo from "../../assets/PandaX_Black.svg"

// Mensaje listo para enviar por WhatsApp junto con el PDF
const textoWhatsapp = (q, codigo) => [
  `Hola ${q.client?.name ?? ''}, te comparto la cotización ${codigo} de ${EMPRESA.marca}:`,
  `«${q.title}» por ${formatoCOP(q.total)}.`,
  q.validUntil ? `Es válida hasta el ${fechaDocumento(q.validUntil)}.` : '',
  'Quedo atento a tus comentarios.',
].filter(Boolean).join('\n')

const enlaceWhatsapp = (telefono, texto) => {
  const digitos = String(telefono ?? '').replace(/\D/g, '')
  const numero = digitos.length === 10 ? `57${digitos}` : digitos
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`
}

// Hoja de la cotización: es lo que se imprime (ver @media print en admin.css)
const Documento = ({ q }) => {
  const codigo = codigoCotizacion(q.numero)
  return (
    <article className="documento-cotizacion tarjeta p-6 sm:p-10">
      <header className="flex flex-col justify-between gap-6 border-b border-ink-600 pb-6 sm:flex-row">
        <div className="flex items-start gap-3">
          <img src={Logo} alt="" className="documento-logo w-12" />
          <div>
            <p className="text-lg font-semibold text-fg">{EMPRESA.marca}</p>
            <p className="text-xs text-muted">{EMPRESA.responsable} · {EMPRESA.documento}</p>
            <p className="text-xs text-muted">{EMPRESA.ciudad}</p>
            <p className="text-xs text-muted">{EMPRESA.correo} · {EMPRESA.telefono}</p>
          </div>
        </div>
        <div className="sm:text-right">
          <p className="text-xs font-semibold tracking-widest text-subtle uppercase">Cotización</p>
          <p className="font-mono text-2xl font-semibold text-fg">{codigo}</p>
          <p className="mt-1 text-xs text-muted">Fecha: {fechaDocumento(q.createdAt)}</p>
          <p className="text-xs text-muted">Válida hasta: {fechaDocumento(q.validUntil)}</p>
        </div>
      </header>

      <section className="grid gap-6 py-6 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold tracking-widest text-subtle uppercase">Para</p>
          <p className="mt-1 font-semibold text-fg">{q.client?.name ?? 'Cliente eliminado'}</p>
          {q.client?.company && <p className="text-sm text-muted">{q.client.company}</p>}
          {q.client?.taxId && <p className="text-sm text-muted">Doc.: {q.client.taxId}</p>}
          {q.client?.email && <p className="text-sm text-muted">{q.client.email}</p>}
          {q.client?.phone && <p className="text-sm text-muted">{q.client.phone}</p>}
        </div>
        <div className="sm:text-right">
          <p className="text-xs font-semibold tracking-widest text-subtle uppercase">Proyecto</p>
          <p className="mt-1 font-semibold text-fg">{q.title}</p>
        </div>
      </section>

      <table className="tabla">
        <thead>
          <tr><th>Descripción</th><th className="text-right">Cant.</th><th className="text-right">Valor unitario</th><th className="text-right">Subtotal</th></tr>
        </thead>
        <tbody>
          {q.items.map((item, i) => (
            <tr key={i}>
              <td className="text-fg">{item.description}</td>
              <td className="text-right tabular-nums text-muted">{item.quantity}</td>
              <td className="text-right tabular-nums text-muted">{formatoCOP(item.unitPrice)}</td>
              <td className="text-right tabular-nums text-fg">{formatoCOP(item.quantity * item.unitPrice)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-end">
        <div className="w-full max-w-xs border-t-2 border-fg/80 pt-3">
          <div className="flex items-baseline justify-between gap-6">
            <span className="text-sm font-semibold text-fg">Total</span>
            <span className="text-2xl font-semibold tabular-nums text-fg">{formatoCOP(q.total)}</span>
          </div>
          <p className="mt-1 text-right text-xs text-subtle">Valores en pesos colombianos · sin IVA</p>
        </div>
      </div>

      {q.notes && (
        <section className="mt-8 border-t border-ink-600 pt-5">
          <p className="text-xs font-semibold tracking-widest text-subtle uppercase">Condiciones</p>
          <p className="mt-2 text-sm whitespace-pre-line text-muted">{q.notes}</p>
        </section>
      )}
    </article>
  )
}

const CotizacionDetalle = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { mostrarAlerta } = useProyectos()
  const { doc, cargando, error } = useDocumentoAdmin(`/admin/quotes/${id}`)
  const [confirmar, setConfirmar] = useState(false)
  const cancelar = useCallback(() => setConfirmar(false), [])
  const [eliminando, setEliminando] = useState(false)
  const [guardando, setGuardando] = useState(false)
  // Cambios hechos aquí (estado, vigencia) encima del documento cargado, para reflejarlos sin recargar
  const [cambios, setCambios] = useState({})
  const q = doc ? { ...doc, ...cambios } : null

  // El título de la pestaña se usa como nombre por defecto del PDF al «Guardar como PDF»
  const tituloPdf = doc ? `${codigoCotizacion(doc.numero)} ${doc.client?.name ?? ''} - ${EMPRESA.marca}` : ''
  useEffect(() => {
    if (!tituloPdf) return
    const anterior = document.title
    document.title = tituloPdf
    return () => { document.title = anterior }
  }, [tituloPdf])

  const cambiarEstado = async estado => {
    setGuardando(true)
    try {
      const { data } = await clientAxios.patch(`/admin/quotes/${id}/estado`, { estado })
      // La respuesta no trae el cliente poblado ni los totales: se conservan los que ya había
      const vencida = data.estado === 'enviada' && data.validUntil && new Date(data.validUntil) < new Date()
      setCambios({ estado: data.estado, validUntil: data.validUntil, estadoVisible: vencida ? 'vencida' : data.estado })
      mostrarAlerta(`Cotización marcada como ${estado}`, false)
    } catch (err) {
      mostrarAlerta(err.response?.data?.msg ?? 'No se pudo cambiar el estado')
    } finally {
      setGuardando(false)
    }
  }

  const eliminar = async () => {
    setEliminando(true)
    try {
      await clientAxios.delete(`/admin/quotes/${id}`)
      mostrarAlerta('Cotización eliminada', false)
      navigate('/admin/cotizaciones')
    } catch (err) {
      mostrarAlerta(err.response?.data?.msg ?? 'No se pudo eliminar')
      setEliminando(false)
      setConfirmar(false)
    }
  }

  if (cargando || (!doc && !error)) return <div className="skeleton h-96 rounded-xl" />
  if (error) return <EstadoVacio titulo="No se encontró la cotización" texto={error}><Boton to="/admin/cotizaciones" variant="ghost">Volver</Boton></EstadoVacio>

  const codigo = codigoCotizacion(q.numero)

  return (
    <>
      <div className="no-imprimir">
        <EncabezadoAdmin etiqueta="Cotización" titulo={`${codigo} · ${q.title}`} volver={{ to: '/admin/cotizaciones', texto: 'Cotizaciones' }}>
          <Boton variant="ghost" size="sm" icon={faPen} to={`/admin/cotizaciones/${id}/editar`}>Editar</Boton>
          <Boton size="sm" icon={faPrint} onClick={() => window.print()}>Imprimir / PDF</Boton>
        </EncabezadoAdmin>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <Documento q={q} />

        <aside className="no-imprimir flex flex-col gap-4">
          <section className="tarjeta flex flex-col gap-4 p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-fg">Estado</span>
              <EtiquetaCotizacion estado={q.estadoVisible} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {ESTADOS_COTIZACION.filter(e => !e.automatico).map(e => (
                <button key={e.valor} type="button" disabled={guardando || q.estado === e.valor} onClick={() => cambiarEstado(e.valor)}
                  className="chip-filtro justify-center disabled:cursor-default" aria-pressed={q.estado === e.valor}>{e.texto}</button>
              ))}
            </div>
            {q.estadoVisible === 'vencida' && <p className="text-xs text-muted">Venció el {fechaDocumento(q.validUntil)}. Marcarla otra vez como «Enviada» le da 15 días más.</p>}
          </section>

          <section className="tarjeta flex flex-col gap-2 p-5 text-sm">
            <div className="flex justify-between"><span className="text-muted">Total</span><span className="tabular-nums text-fg">{formatoCOP(q.total)}</span></div>
            <div className="flex justify-between"><span className="text-muted">Pagado</span><span className="tabular-nums text-fg">{formatoCOP(q.pagado)}</span></div>
            <div className="flex justify-between border-t border-ink-600 pt-2 font-semibold"><span className="text-fg">Saldo</span><span className="tabular-nums text-fg">{formatoCOP(q.saldo)}</span></div>
            {q.client && (
              <Boton to={`/admin/pagos/nuevo?cliente=${q.client._id}&cotizacion=${q._id}`} size="sm" icon={faMoneyBillWave} className="mt-2">Registrar pago</Boton>
            )}
            {q.pagos?.length > 0 && (
              <ul className="mt-2 flex flex-col gap-1.5 border-t border-ink-600 pt-3">
                {q.pagos.map(p => (
                  <li key={p._id}>
                    <Link to={`/admin/pagos/${p._id}/editar`} className="flex items-center justify-between gap-2 text-xs hover:text-neon">
                      <span className="text-muted">{fechaPago(p.date)} · {textoMetodo(p.method)}</span>
                      <span className={`tabular-nums ${p.estado === 'pagado' ? 'text-fg' : 'text-subtle line-through'}`}>{formatoCOP(p.amount)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="tarjeta flex flex-col gap-2 p-5">
            {q.client?.phone && (
              <Boton href={enlaceWhatsapp(q.client.phone, textoWhatsapp(q, codigo))} variant="ghost" size="sm" icon={faWhatsapp}>Enviar mensaje por WhatsApp</Boton>
            )}
            <Boton variant="ghost" size="sm" icon={faCopy}
              onClick={() => navigator.clipboard.writeText(textoWhatsapp(q, codigo)).then(() => mostrarAlerta('Mensaje copiado', false))}>
              Copiar mensaje
            </Boton>
            {q.client && <Link to={`/admin/clientes/${q.client._id}`} className="mt-1 text-center text-sm text-neon hover:underline">Ver ficha de {q.client.name}</Link>}
            <p className="mt-1 text-xs text-subtle">Para enviar el PDF: «Imprimir / PDF» → «Guardar como PDF» y adjúntalo.</p>
          </section>

          <Boton variant="ghost" size="sm" icon={faTrash} className="hover:text-danger" onClick={() => setConfirmar(true)}>Eliminar cotización</Boton>
        </aside>
      </div>

      <ConfirmDialog
        abierto={confirmar}
        titulo="¿Eliminar cotización?"
        mensaje={<>Se eliminará <strong className="text-fg">{codigo}</strong>. Su número no se volverá a usar. Si el cliente la rechazó, es mejor marcarla como «Rechazada».</>}
        cargando={eliminando}
        onConfirmar={eliminar}
        onCancelar={cancelar}
      />
    </>
  )
}

export default CotizacionDetalle
