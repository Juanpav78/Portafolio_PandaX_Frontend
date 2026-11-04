import { useCallback, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { faBoxArchive, faEnvelope, faPhone, faReply, faTrash } from "@fortawesome/free-solid-svg-icons"
import clientAxios from "../../config/clientAxios"
import useDocumentoAdmin from "../../hooks/useDocumentoAdmin"
import useProyectos from "../../hooks/useProyectos"
import Boton from "../../components/Boton"
import ConfirmDialog from "../../components/ConfirmDialog"
import EncabezadoAdmin from "../../components/EncabezadoAdmin"
import EstadoVacio from "../../components/admin/EstadoVacio"
import BadgeSitio from "../../components/admin/BadgeSitio"
import EtiquetaEstado from "../../components/admin/EtiquetaEstado"
import { nombreSitio } from "../../helpers/sitios"
import { ESTADOS_MENSAJE } from "../../helpers/mensajes"
import { fechaCompleta } from "../../helpers/fechas"

const Dato = ({ etiqueta, children }) => children ? (
  <div>
    <dt className="text-xs font-medium text-subtle">{etiqueta}</dt>
    <dd className="mt-0.5 text-sm text-fg">{children}</dd>
  </div>
) : null

// El estado se guarda aparte del documento cargado: al abrirlo, el backend ya lo pasó de
// "nuevo" a "leído", y los cambios siguientes (responder, archivar) se reflejan sin recargar.
const Detalle = ({ mensaje }) => {
  const navigate = useNavigate()
  const { mostrarAlerta } = useProyectos()
  const [estado, setEstado] = useState(mensaje.estado)
  const [guardando, setGuardando] = useState(false)
  const [confirmar, setConfirmar] = useState(false)
  const [eliminando, setEliminando] = useState(false)

  const cambiarEstado = async nuevo => {
    const anterior = estado
    setEstado(nuevo)
    setGuardando(true)
    try {
      await clientAxios.patch(`/admin/messages/${mensaje._id}/estado`, { estado: nuevo })
      mostrarAlerta(`Mensaje marcado como ${nuevo}`, false)
    } catch (error) {
      setEstado(anterior)
      mostrarAlerta(error.response?.data?.msg ?? 'No se pudo cambiar el estado')
    } finally {
      setGuardando(false)
    }
  }

  const eliminar = async () => {
    setEliminando(true)
    try {
      await clientAxios.delete(`/admin/messages/${mensaje._id}`)
      mostrarAlerta('Mensaje eliminado', false)
      navigate('/admin/mensajes')
    } catch (error) {
      mostrarAlerta(error.response?.data?.msg ?? 'No se pudo eliminar')
      setEliminando(false)
    }
  }
  const cancelar = useCallback(() => setConfirmar(false), [])

  // Responder abre el correo con asunto y cita listos; se marca como respondido al hacer click
  // porque el admin no puede saber si de verdad se envió desde su cliente de correo.
  const asunto = encodeURIComponent(`Re: tu mensaje en ${nombreSitio(mensaje.site)}`)
  const cuerpo = encodeURIComponent(`Hola ${mensaje.name},\n\n\n\n---\n${mensaje.message}`)

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <article className="tarjeta p-6">
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <BadgeSitio sitio={mensaje.site} />
          <EtiquetaEstado estado={estado} />
          <time dateTime={mensaje.createdAt} className="text-xs text-subtle">{fechaCompleta(mensaje.createdAt)}</time>
        </div>
        <p className="text-sm leading-relaxed whitespace-pre-line text-fg">{mensaje.message}</p>
        <dl className="mt-6 grid gap-4 border-t border-ink-600 pt-5 sm:grid-cols-2">
          <Dato etiqueta="Correo"><a href={`mailto:${mensaje.email}`} className="text-neon hover:underline">{mensaje.email}</a></Dato>
          <Dato etiqueta="Teléfono">{mensaje.phone && <a href={`tel:${mensaje.phone}`} className="text-neon hover:underline">{mensaje.phone}</a>}</Dato>
          <Dato etiqueta="Empresa">{mensaje.company}</Dato>
          <Dato etiqueta="Servicio de interés">{mensaje.service}</Dato>
          <Dato etiqueta="Presupuesto">{mensaje.budget}</Dato>
          <Dato etiqueta="Autorizó tratamiento de datos">{mensaje.site === 'code' ? (mensaje.consent ? 'Sí' : 'No') : null}</Dato>
        </dl>
      </article>

      <aside className="flex flex-col gap-4">
        <section className="tarjeta flex flex-col gap-3 p-5">
          <Boton href={`mailto:${mensaje.email}?subject=${asunto}&body=${cuerpo}`} icon={faReply}
            onClick={() => estado !== 'respondido' && cambiarEstado('respondido')}>Responder por correo</Boton>
          {mensaje.phone && <Boton href={`tel:${mensaje.phone}`} variant="ghost" icon={faPhone}>Llamar</Boton>}
          <label htmlFor="estado" className="mt-2 text-sm font-semibold text-fg/90">Estado</label>
          <select id="estado" className="field capitalize" value={estado} disabled={guardando} onChange={e => cambiarEstado(e.target.value)}>
            {ESTADOS_MENSAJE.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </section>
        <div className="flex gap-2">
          {estado !== 'archivado' && (
            <Boton variant="ghost" icon={faBoxArchive} className="flex-1" disabled={guardando} onClick={() => cambiarEstado('archivado')}>Archivar</Boton>
          )}
          <Boton variant="ghost" icon={faTrash} className="flex-1 hover:text-danger" onClick={() => setConfirmar(true)}>Eliminar</Boton>
        </div>
      </aside>

      <ConfirmDialog
        abierto={confirmar}
        titulo="¿Eliminar mensaje?"
        mensaje={<>Se eliminará el mensaje de <strong className="text-fg">{mensaje.name}</strong>. Si sólo quieres sacarlo de la bandeja, archívalo.</>}
        cargando={eliminando}
        onConfirmar={eliminar}
        onCancelar={cancelar}
      />
    </div>
  )
}

const MensajeDetalle = () => {
  const { id } = useParams()
  const { doc, cargando, error } = useDocumentoAdmin(`/admin/messages/${id}`)

  return (
    <>
      <EncabezadoAdmin etiqueta="Mensaje" titulo={doc?.name ?? 'Mensaje'} volver={{ to: '/admin/mensajes', texto: 'Mensajes' }} />
      {cargando && <div className="skeleton h-80 rounded-xl" />}
      {error && <EstadoVacio icono={faEnvelope} titulo="No se encontró el mensaje" texto={error}><Boton to="/admin/mensajes" variant="ghost">Volver</Boton></EstadoVacio>}
      {!cargando && doc && <Detalle key={doc._id} mensaje={doc} />}
    </>
  )
}

export default MensajeDetalle
