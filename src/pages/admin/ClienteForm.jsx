import { useState } from "react"
import { useNavigate, useParams } from "react-router"
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons"
import clientAxios from "../../config/clientAxios"
import useDocumentoAdmin from "../../hooks/useDocumentoAdmin"
import useProyectos from "../../hooks/useProyectos"
import Boton from "../../components/Boton"
import Campo from "../../components/Campo"
import EncabezadoAdmin from "../../components/EncabezadoAdmin"
import EstadoVacio from "../../components/admin/EstadoVacio"

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const Formulario = ({ inicial }) => {
  const navigate = useNavigate()
  const { mostrarAlerta } = useProyectos()
  const editando = Boolean(inicial)
  const [datos, setDatos] = useState({
    name: inicial?.name ?? '',
    company: inicial?.company ?? '',
    email: inicial?.email ?? '',
    phone: inicial?.phone ?? '',
    taxId: inicial?.taxId ?? '',
    notes: inicial?.notes ?? '',
  })
  const [errores, setErrores] = useState({})
  const [enviando, setEnviando] = useState(false)

  const cambiar = e => setDatos(d => ({ ...d, [e.target.name]: e.target.value }))

  const enviar = async ev => {
    ev.preventDefault()
    const e = {}
    if (!datos.name.trim()) e.name = 'El nombre es obligatorio'
    if (datos.email && !EMAIL_VALIDO.test(datos.email)) e.email = 'El correo no es válido'
    setErrores(e)
    if (Object.keys(e).length) return document.getElementById(Object.keys(e)[0])?.focus()

    setEnviando(true)
    try {
      const { data } = editando
        ? await clientAxios.put(`/admin/clients/${inicial._id}`, datos)
        : await clientAxios.post('/admin/clients', datos)
      mostrarAlerta(editando ? 'Cliente actualizado' : 'Cliente creado', false)
      navigate(`/admin/clientes/${data._id}`)
    } catch (error) {
      mostrarAlerta(error.response?.data?.msg ?? 'No se pudo guardar el cliente')
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={enviar} noValidate className="tarjeta flex max-w-3xl flex-col gap-5 p-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <Campo label="Nombre" id="name" value={datos.name} onChange={cambiar} error={errores.name} placeholder="Laura Gómez" />
        <Campo label="Empresa (opcional)" id="company" value={datos.company} onChange={cambiar} placeholder="Café Andino SAS" />
        <Campo label="Correo (opcional)" id="email" type="email" value={datos.email} onChange={cambiar} error={errores.email} placeholder="laura@empresa.com" />
        <Campo label="Teléfono / WhatsApp (opcional)" id="phone" type="tel" value={datos.phone} onChange={cambiar} placeholder="300 123 4567" />
        <Campo label="Cédula o NIT (opcional)" id="taxId" value={datos.taxId} onChange={cambiar} placeholder="900123456-7"
          hint="Aparece en las cotizaciones." />
      </div>
      <Campo as="textarea" label="Notas (opcional)" id="notes" rows={4} value={datos.notes} onChange={cambiar} className="resize-y"
        placeholder="Qué necesita, cómo llegó, acuerdos…" />
      <div className="flex gap-3">
        <Boton to={editando ? `/admin/clientes/${inicial._id}` : '/admin/clientes'} variant="ghost">Cancelar</Boton>
        <Boton type="submit" loading={enviando} icon={faFloppyDisk}>{editando ? 'Guardar cambios' : 'Crear cliente'}</Boton>
      </div>
    </form>
  )
}

const ClienteForm = () => {
  const { id } = useParams()
  const { doc, cargando, error } = useDocumentoAdmin(id ? `/admin/clients/${id}` : null)
  const cliente = doc?.cliente

  return (
    <>
      <EncabezadoAdmin etiqueta="Clientes" titulo={id ? (cliente?.name ?? 'Editar cliente') : 'Nuevo cliente'}
        volver={id ? { to: `/admin/clientes/${id}`, texto: cliente?.name ?? 'Cliente' } : { to: '/admin/clientes', texto: 'Clientes' }} />
      {cargando && <div className="skeleton h-80 max-w-3xl rounded-xl" />}
      {error && <EstadoVacio titulo="No se encontró el cliente" texto={error}><Boton to="/admin/clientes" variant="ghost">Volver</Boton></EstadoVacio>}
      {!cargando && !error && <Formulario key={cliente?._id ?? 'nuevo'} inicial={cliente} />}
    </>
  )
}

export default ClienteForm
