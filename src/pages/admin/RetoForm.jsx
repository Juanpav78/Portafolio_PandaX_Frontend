import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons"
import clientAxios from "../../config/clientAxios"
import useDocumentoAdmin from "../../hooks/useDocumentoAdmin"
import useProyectos from "../../hooks/useProyectos"
import Boton from "../../components/Boton"
import Campo from "../../components/Campo"
import EncabezadoAdmin from "../../components/EncabezadoAdmin"
import EstadoVacio from "../../components/admin/EstadoVacio"
import CampoImagen from "../../components/admin/CampoImagen"
import InterruptorPublicado from "../../components/admin/InterruptorPublicado"
import { errorImagen } from "../../helpers/imagenes"

const RUTA = '/admin/retos'
const MAX_TEMATICA = 120 // mismo límite que el modelo

const esUrl = texto => {
  try {
    return ['http:', 'https:'].includes(new URL(texto).protocol)
  } catch {
    return false
  }
}

const validar = datos => {
  const e = {}
  if (datos.numero !== '' && !(Number.isInteger(Number(datos.numero)) && Number(datos.numero) >= 1)) e.numero = 'Usa un número entero desde 1'
  if (!datos.tematica.trim()) e.tematica = 'Escribe la temática del reto'
  if (datos.video.trim() && !esUrl(datos.video.trim())) e.video = 'Debe ser una URL completa (https://…)'
  if (datos.demo.trim() && !esUrl(datos.demo.trim())) e.demo = 'Debe ser una URL completa (https://…)'
  return e
}

const Formulario = ({ inicial }) => {
  const navigate = useNavigate()
  const { mostrarAlerta } = useProyectos()
  const editando = Boolean(inicial)

  const [datos, setDatos] = useState({
    numero: inicial?.numero != null ? String(inicial.numero) : '',
    tematica: inicial?.tematica ?? '',
    video: inicial?.video ?? '',
    demo: inicial?.demo ?? '',
  })
  const [publicado, setPublicado] = useState(inicial?.publicado ?? true)
  const [errores, setErrores] = useState({})
  const [enviando, setEnviando] = useState(false)
  // Número que el backend asignará si se deja vacío; sólo informativo en "nuevo reto"
  const [sugerido, setSugerido] = useState(null)

  useEffect(() => {
    if (editando) return
    let activo = true
    clientAxios(`${RUTA}/siguiente`).then(({ data }) => activo && setSugerido(data.numero)).catch(() => {})
    return () => { activo = false }
  }, [editando])

  // Imagen: archivo nuevo con su vista previa, o la guardada salvo que se pida quitarla.
  // La URL temporal se crea en el evento y se libera al cambiarla y al salir (ver Formulario).
  const [imagen, setImagen] = useState(null)
  const [preview, setPreview] = useState(null)
  const [quitar, setQuitar] = useState(false)
  const previewRef = useRef(null)
  useEffect(() => () => previewRef.current && URL.revokeObjectURL(previewRef.current), [])

  const elegirImagen = archivo => {
    if (!archivo) return
    const error = errorImagen(archivo)
    if (error) return setErrores(e => ({ ...e, imagen: error }))
    if (previewRef.current) URL.revokeObjectURL(previewRef.current)
    previewRef.current = URL.createObjectURL(archivo)
    setPreview(previewRef.current)
    setImagen(archivo)
    setQuitar(false)
    setErrores(actuales => {
      const restantes = { ...actuales }
      delete restantes.imagen
      return restantes
    })
  }

  const quitarImagen = () => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current)
    previewRef.current = null
    setPreview(null)
    setImagen(null)
    setQuitar(Boolean(inicial?.imagen))
  }

  const vistaPrevia = preview ?? (quitar ? null : inicial?.imagen?.secure_url ?? null)
  // Al corregir un campo su error desaparece en el momento, sin esperar a enviar de nuevo
  const cambiar = e => {
    const { name, value } = e.target
    setDatos(d => ({ ...d, [name]: value }))
    setErrores(actuales => {
      if (!actuales[name]) return actuales
      const restantes = { ...actuales }
      delete restantes[name]
      return restantes
    })
  }

  const enviar = async ev => {
    ev.preventDefault()
    const e = validar(datos)
    setErrores(e)
    if (Object.keys(e).length) return document.getElementById(Object.keys(e)[0])?.focus()

    // Multipart: los campos y la imagen van juntos. Sin Content-Type a mano: el navegador
    // añade el boundary. El número vacío se omite para que el backend asigne el siguiente.
    const cuerpo = new FormData()
    if (datos.numero !== '') cuerpo.append('numero', datos.numero)
    cuerpo.append('tematica', datos.tematica.trim())
    cuerpo.append('video', datos.video.trim())
    cuerpo.append('demo', datos.demo.trim())
    cuerpo.append('publicado', String(publicado))
    if (imagen) cuerpo.append('imagen', imagen)
    if (quitar) cuerpo.append('quitarImagen', 'true')

    setEnviando(true)
    try {
      if (editando) await clientAxios.put(`${RUTA}/${inicial._id}`, cuerpo)
      else await clientAxios.post(RUTA, cuerpo)
      mostrarAlerta(editando ? 'Reto actualizado' : 'Reto creado', false)
      navigate('/admin/retos')
    } catch (error) {
      mostrarAlerta(error.response?.data?.msg ?? 'No se pudo guardar el reto')
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={enviar} noValidate className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <section className="tarjeta flex flex-col gap-5 p-6">
        <h2 className="font-semibold text-fg">Reto</h2>
        <div className="grid gap-5 sm:grid-cols-[8rem_minmax(0,1fr)]">
          <Campo label="Número" id="numero" type="number" min={1} inputMode="numeric" value={datos.numero} onChange={cambiar}
            error={errores.numero} placeholder={sugerido ? String(sugerido) : 'Auto'}
            hint={editando ? undefined : 'Vacío: el siguiente'} />
          <Campo label="Temática" id="tematica" maxLength={MAX_TEMATICA} value={datos.tematica} onChange={cambiar}
            error={errores.tematica} placeholder="Cafetería japonesa"
            extra={<span className="text-xs text-subtle tabular-nums">{datos.tematica.length}/{MAX_TEMATICA}</span>} />
        </div>
        <Campo label="Video (opcional)" id="video" type="url" value={datos.video} onChange={cambiar} error={errores.video}
          placeholder="https://www.instagram.com/reel/…" hint="Instagram, TikTok o YouTube" />
        <Campo label="Demo (opcional)" id="demo" type="url" value={datos.demo} onChange={cambiar} error={errores.demo}
          placeholder="https://…" hint="La landing publicada" />
        <CampoImagen label="Miniatura (opcional)" preview={vistaPrevia} onElegir={elegirImagen} error={errores.imagen}
          editando={editando} onQuitar={vistaPrevia ? quitarImagen : undefined}
          ayuda="Vertical u horizontal: el muro respeta su proporción." />
      </section>

      <aside className="flex flex-col gap-6 lg:sticky lg:top-22 lg:self-start">
        <section className="tarjeta flex flex-col gap-4 p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold text-fg">Publicación</h2>
            <InterruptorPublicado publicado={publicado} onChange={setPublicado} />
          </div>
          <p className="text-sm text-muted">
            {publicado ? 'Se verá en el muro de Retos de PandaX Code.' : 'Queda guardado pero no aparece en la web.'}
          </p>
        </section>
        <div className="flex gap-3">
          <Boton to="/admin/retos" variant="ghost">Cancelar</Boton>
          <Boton type="submit" loading={enviando} icon={faFloppyDisk} className="flex-1">
            {editando ? 'Guardar cambios' : 'Crear reto'}
          </Boton>
        </div>
      </aside>
    </form>
  )
}

const RetoForm = () => {
  const { id } = useParams()
  const { doc, cargando, error } = useDocumentoAdmin(id ? `${RUTA}/${id}` : null)
  const titulo = id ? (doc ? `Reto #${String(doc.numero).padStart(2, '0')}` : 'Editar reto') : 'Nuevo reto'

  return (
    <>
      <EncabezadoAdmin etiqueta="Retos" titulo={titulo} volver={{ to: '/admin/retos', texto: 'Retos' }} />
      {cargando && <div className="skeleton h-80 rounded-xl" />}
      {error && <EstadoVacio titulo="No se encontró el reto" texto={error}><Boton to="/admin/retos" variant="ghost">Volver</Boton></EstadoVacio>}
      {!cargando && !error && <Formulario key={doc?._id ?? 'nuevo'} inicial={doc} />}
    </>
  )
}

export default RetoForm
