import { useCallback, useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEnvelope, faFileInvoiceDollar, faMoneyBillWave, faPen, faPhone, faTrash } from "@fortawesome/free-solid-svg-icons"
import { faWhatsapp as faWhatsappMarca } from "@fortawesome/free-brands-svg-icons"
import clientAxios from "../../config/clientAxios"
import useDocumentoAdmin from "../../hooks/useDocumentoAdmin"
import useProyectos from "../../hooks/useProyectos"
import Boton from "../../components/Boton"
import ConfirmDialog from "../../components/ConfirmDialog"
import EncabezadoAdmin from "../../components/EncabezadoAdmin"
import EstadoVacio from "../../components/admin/EstadoVacio"
import BadgeSitio from "../../components/admin/BadgeSitio"
import { formatoCOP } from "../../helpers/dinero"
import { fechaCompleta } from "../../helpers/fechas"

// WhatsApp necesita el número con indicativo y sin símbolos; si viene sin indicativo se asume Colombia
const enlaceWhatsapp = telefono => {
  const digitos = String(telefono).replace(/\D/g, '')
  return `https://wa.me/${digitos.length === 10 ? `57${digitos}` : digitos}`
}

const Dato = ({ etiqueta, children }) => children ? (
  <div>
    <dt className="text-xs font-medium text-subtle">{etiqueta}</dt>
    <dd className="mt-0.5 text-sm text-fg">{children}</dd>
  </div>
) : null

const Cifra = ({ etiqueta, valor, destacado }) => (
  <div className="tarjeta p-4">
    <p className="text-xs font-medium text-subtle">{etiqueta}</p>
    <p className={`mt-1 text-xl font-semibold tabular-nums ${destacado ? 'text-neon' : 'text-fg'}`}>{formatoCOP(valor)}</p>
  </div>
)

const ClienteDetalle = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { mostrarAlerta } = useProyectos()
  const { doc, cargando, error } = useDocumentoAdmin(`/admin/clients/${id}`)
  const [confirmar, setConfirmar] = useState(false)
  const [eliminando, setEliminando] = useState(false)
  const cancelar = useCallback(() => setConfirmar(false), [])

  const eliminar = async () => {
    setEliminando(true)
    try {
      await clientAxios.delete(`/admin/clients/${id}`)
      mostrarAlerta('Cliente eliminado', false)
      navigate('/admin/clientes')
    } catch (err) {
      mostrarAlerta(err.response?.data?.msg ?? 'No se pudo eliminar el cliente')
      setEliminando(false)
      setConfirmar(false)
    }
  }

  if (cargando) return <><EncabezadoAdmin etiqueta="Clientes" titulo="Cliente" volver={{ to: '/admin/clientes', texto: 'Clientes' }} /><div className="skeleton h-96 rounded-xl" /></>
  if (error || !doc) return <EstadoVacio titulo="No se encontró el cliente" texto={error}><Boton to="/admin/clientes" variant="ghost">Volver</Boton></EstadoVacio>

  const { cliente, cotizaciones, pagos, cuenta } = doc

  return (
    <>
      <EncabezadoAdmin etiqueta="Cliente" titulo={cliente.name} volver={{ to: '/admin/clientes', texto: 'Clientes' }}>
        <Boton to={`/admin/clientes/${id}/editar`} variant="ghost" size="sm" icon={faPen}>Editar</Boton>
        <Boton variant="ghost" size="sm" icon={faTrash} className="hover:text-danger" onClick={() => setConfirmar(true)}>Eliminar</Boton>
      </EncabezadoAdmin>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="flex flex-col gap-6">
          <section className="grid gap-3 sm:grid-cols-3" aria-label="Estado de cuenta">
            <Cifra etiqueta="Cotizaciones aceptadas" valor={cuenta.aceptado} />
            <Cifra etiqueta="Pagado" valor={cuenta.pagado} />
            <Cifra etiqueta="Saldo pendiente" valor={cuenta.saldo} destacado={cuenta.saldo > 0} />
          </section>

          <section className="tarjeta">
            <h2 className="border-b border-ink-600 px-5 py-3.5 font-semibold text-fg">Cotizaciones</h2>
            {cotizaciones.length === 0
              ? <p className="flex items-center gap-2 px-5 py-6 text-sm text-muted"><FontAwesomeIcon icon={faFileInvoiceDollar} /> Aún no hay cotizaciones para este cliente.</p>
              : (
                <ul className="divide-y divide-ink-600">
                  {cotizaciones.map(q => (
                    <li key={q._id} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
                      <span className="min-w-0 truncate text-fg">{q.title}</span>
                      <span className="shrink-0 text-xs text-subtle capitalize">{q.estado}</span>
                      <span className="shrink-0 tabular-nums">{formatoCOP(q.total)}</span>
                    </li>
                  ))}
                </ul>
              )}
          </section>

          <section className="tarjeta">
            <h2 className="border-b border-ink-600 px-5 py-3.5 font-semibold text-fg">Pagos</h2>
            {pagos.length === 0
              ? <p className="flex items-center gap-2 px-5 py-6 text-sm text-muted"><FontAwesomeIcon icon={faMoneyBillWave} /> Aún no hay pagos registrados.</p>
              : (
                <ul className="divide-y divide-ink-600">
                  {pagos.map(p => (
                    <li key={p._id} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
                      <span className="text-muted">{fechaCompleta(p.date)}</span>
                      <span className="text-xs text-subtle capitalize">{p.method} · {p.estado}</span>
                      <span className="tabular-nums text-fg">{formatoCOP(p.amount)}</span>
                    </li>
                  ))}
                </ul>
              )}
          </section>
        </div>

        {/* En celular el contacto va primero: es lo que más se consulta desde el teléfono */}
        <aside className="order-first flex flex-col gap-4 lg:order-none">
          <section className="tarjeta flex flex-col gap-4 p-5">
            <dl className="flex flex-col gap-4">
              <Dato etiqueta="Empresa">{cliente.company}</Dato>
              <Dato etiqueta="Correo">{cliente.email && <a href={`mailto:${cliente.email}`} className="text-neon hover:underline">{cliente.email}</a>}</Dato>
              <Dato etiqueta="Teléfono">{cliente.phone}</Dato>
              <Dato etiqueta="Cédula o NIT">{cliente.taxId}</Dato>
              <Dato etiqueta="Cliente desde">{fechaCompleta(cliente.createdAt)}</Dato>
              {cliente.origin && (
                <Dato etiqueta="Llegó por">
                  <Link to={`/admin/mensajes/${cliente.origin._id}`} className="inline-flex items-center gap-2 text-neon hover:underline">
                    Formulario de contacto <BadgeSitio sitio={cliente.origin.site} />
                  </Link>
                </Dato>
              )}
            </dl>
            <div className="flex flex-wrap gap-2">
              {cliente.phone && <Boton href={enlaceWhatsapp(cliente.phone)} size="sm" icon={faWhatsappMarca}>WhatsApp</Boton>}
              {cliente.phone && <Boton href={`tel:${cliente.phone}`} variant="ghost" size="sm" icon={faPhone}>Llamar</Boton>}
              {cliente.email && <Boton href={`mailto:${cliente.email}`} variant="ghost" size="sm" icon={faEnvelope}>Correo</Boton>}
            </div>
          </section>
          {cliente.notes && (
            <section className="tarjeta p-5">
              <h2 className="text-xs font-medium text-subtle">Notas</h2>
              <p className="mt-1 text-sm whitespace-pre-line text-fg">{cliente.notes}</p>
            </section>
          )}
        </aside>
      </div>

      <ConfirmDialog
        abierto={confirmar}
        titulo="¿Eliminar cliente?"
        mensaje={<>Se eliminará <strong className="text-fg">{cliente.name}</strong>. Sólo es posible si no tiene cotizaciones ni pagos.</>}
        cargando={eliminando}
        onConfirmar={eliminar}
        onCancelar={cancelar}
      />
    </>
  )
}

export default ClienteDetalle
