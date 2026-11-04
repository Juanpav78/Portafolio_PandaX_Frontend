import { useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router"
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons"
import clientAxios from "../../config/clientAxios"
import useDocumentoAdmin from "../../hooks/useDocumentoAdmin"
import useProyectos from "../../hooks/useProyectos"
import Boton from "../../components/Boton"
import Campo from "../../components/Campo"
import EncabezadoAdmin from "../../components/EncabezadoAdmin"
import EstadoVacio from "../../components/admin/EstadoVacio"
import SelectorSitios from "../../components/admin/SelectorSitios"
import InterruptorPublicado from "../../components/admin/InterruptorPublicado"
import { esSitio } from "../../helpers/sitios"

const RUTA = '/admin/testimonials'
const MAX_TEXTO = 1000 // mismo límite que el modelo

const Formulario = ({ inicial }) => {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { mostrarAlerta } = useProyectos()
  const editando = Boolean(inicial)

  const [datos, setDatos] = useState({
    name: inicial?.name ?? '',
    role: inicial?.role ?? '',
    company: inicial?.company ?? '',
    text: inicial?.text ?? '',
  })
  const [sitios, setSitios] = useState(inicial?.sitios ?? [esSitio(params.get('sitio')) ? params.get('sitio') : 'code'])
  const [publicado, setPublicado] = useState(inicial?.publicado ?? true)
  const [errores, setErrores] = useState({})
  const [enviando, setEnviando] = useState(false)

  const cambiar = e => setDatos(d => ({ ...d, [e.target.name]: e.target.value }))

  const enviar = async ev => {
    ev.preventDefault()
    const e = {}
    if (!datos.name.trim()) e.name = 'El nombre es obligatorio'
    if (!datos.text.trim()) e.text = 'Escribe el testimonio'
    if (!sitios.length) e.sitios = 'Elige al menos un sitio'
    setErrores(e)
    if (Object.keys(e).length) return document.getElementById(Object.keys(e)[0])?.focus()

    setEnviando(true)
    const cuerpo = { ...datos, sitios, publicado }
    try {
      if (editando) await clientAxios.put(`${RUTA}/${inicial._id}`, cuerpo)
      else await clientAxios.post(RUTA, cuerpo)
      mostrarAlerta(editando ? 'Testimonio actualizado' : 'Testimonio creado', false)
      navigate(sitios.length === 1 ? `/admin/testimonios?sitio=${sitios[0]}` : '/admin/testimonios')
    } catch (error) {
      mostrarAlerta(error.response?.data?.msg ?? 'No se pudo guardar el testimonio')
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={enviar} noValidate className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <section className="tarjeta flex flex-col gap-5 p-6">
        <h2 className="font-semibold text-fg">Testimonio</h2>
        <Campo label="Nombre" id="name" value={datos.name} onChange={cambiar} error={errores.name} placeholder="Laura Gómez" />
        <div className="grid gap-5 sm:grid-cols-2">
          <Campo label="Cargo (opcional)" id="role" value={datos.role} onChange={cambiar} placeholder="Gerente" />
          <Campo label="Empresa (opcional)" id="company" value={datos.company} onChange={cambiar} placeholder="Café Andino" />
        </div>
        <Campo as="textarea" label="Texto" id="text" rows={6} maxLength={MAX_TEXTO} value={datos.text} onChange={cambiar}
          error={errores.text} className="resize-y" placeholder="Lo que dijo el cliente, tal cual."
          extra={<span className="text-xs text-subtle tabular-nums">{datos.text.length}/{MAX_TEXTO}</span>} />
      </section>

      <aside className="flex flex-col gap-6 lg:sticky lg:top-22 lg:self-start">
        <section className="tarjeta flex flex-col gap-5 p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold text-fg">Publicación</h2>
            <InterruptorPublicado publicado={publicado} onChange={setPublicado} />
          </div>
          <SelectorSitios valor={sitios} onChange={setSitios} error={errores.sitios} publicado={publicado} tipo="El testimonio" />
        </section>
        <div className="flex gap-3">
          <Boton to="/admin/testimonios" variant="ghost">Cancelar</Boton>
          <Boton type="submit" loading={enviando} icon={faFloppyDisk} className="flex-1">
            {editando ? 'Guardar cambios' : 'Crear testimonio'}
          </Boton>
        </div>
      </aside>
    </form>
  )
}

const TestimonioForm = () => {
  const { id } = useParams()
  const { doc, cargando, error } = useDocumentoAdmin(id ? `${RUTA}/${id}` : null)

  return (
    <>
      <EncabezadoAdmin etiqueta="Testimonios" titulo={id ? (doc ? `Testimonio de ${doc.name}` : 'Editar testimonio') : 'Nuevo testimonio'}
        volver={{ to: '/admin/testimonios', texto: 'Testimonios' }} />
      {cargando && <div className="skeleton h-80 rounded-xl" />}
      {error && <EstadoVacio titulo="No se encontró el testimonio" texto={error}><Boton to="/admin/testimonios" variant="ghost">Volver</Boton></EstadoVacio>}
      {!cargando && !error && <Formulario key={doc?._id ?? 'nuevo'} inicial={doc} />}
    </>
  )
}

export default TestimonioForm
