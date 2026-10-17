import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCloudArrowUp, faFloppyDisk, faImage } from "@fortawesome/free-solid-svg-icons"
import Boton from "./Boton"
import Campo from "./Campo"
import Card from "./Card"
import CampoTecnologias from "./CampoTecnologias"
import CampoGaleria from "./CampoGaleria"
import useProyectos from "../hooks/useProyectos"
import { contarTecnologias, contarTipos, parseTecnologias } from "../helpers/proyectos"

const MAX_IMAGEN = 2 * 1000 * 1000 // 2 MB, mismo límite que se usaba antes
const TIPOS_IMAGEN = ['image/png', 'image/jpeg', 'image/webp']
const MAX_DESCRIPCION = 600
const MAX_GALERIA = 8 // mismo límite que valida el backend

const esUrl = texto => {
  try {
    return ['http:', 'https:'].includes(new URL(texto).protocol)
  } catch {
    return false
  }
}

// El input type="date" trabaja con "YYYY-MM-DD"; el backend devuelve una fecha ISO completa
const aFechaInput = fecha => (fecha ? new Date(fecha).toISOString().slice(0, 10) : '')

// Devuelve un objeto { campo: mensaje } sólo con los campos inválidos. El orden de las claves
// sigue el orden visual del formulario: se usa para enfocar el primer error al enviar.
const validar = (datos, techs, imagen, editando) => {
  const errores = {}
  if (!datos.nombre.trim()) errores.nombre = 'El nombre es obligatorio'
  if (!datos.tipo.trim()) errores.tipo = 'Indica el tipo de proyecto'
  if (!datos.link.trim()) errores.link = 'El enlace es obligatorio'
  else if (!esUrl(datos.link)) errores.link = 'Debe ser una URL completa (https://…)'
  if (datos.github && !esUrl(datos.github)) errores.github = 'Debe ser una URL completa (https://…)'
  if (!techs.length) errores.tecnologias = 'Añade al menos una tecnología'
  if (!editando && !imagen) errores.imagen = 'La imagen es obligatoria'
  if (!datos.descripcion.trim()) errores.descripcion = 'La descripción es obligatoria'
  return errores
}

// Zona para soltar o elegir la imagen, con vista previa inmediata.
const CampoImagen = ({ preview, onElegir, error, editando }) => {
  const [arrastrando, setArrastrando] = useState(false)

  const alSoltar = e => {
    e.preventDefault()
    setArrastrando(false)
    onElegir(e.dataTransfer.files[0])
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-fg/90">Portada</span>
      <label
        htmlFor="imagen"
        onDragOver={e => { e.preventDefault(); setArrastrando(true) }}
        onDragLeave={() => setArrastrando(false)}
        onDrop={alSoltar}
        className={`group relative flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl
          border-2 border-dashed text-center transition-colors
          ${error ? 'border-danger/60' : arrastrando ? 'border-neon bg-neon/5' : 'border-white/10 hover:border-neon/50'}`}
      >
        {preview ? (
          <>
            <img src={preview} alt="Vista previa" className="absolute inset-0 size-full object-cover object-top" />
            <span className="relative flex items-center gap-2 rounded-full bg-ink-950/80 px-4 py-2 text-sm font-semibold text-fg opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
              <FontAwesomeIcon icon={faImage} /> Cambiar imagen
            </span>
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={faCloudArrowUp} className={`text-3xl ${arrastrando ? 'text-neon' : 'text-subtle'}`} />
            <p className="text-sm text-muted"><span className="font-semibold text-neon-soft">Elige un archivo</span> o arrástralo aquí</p>
            <p className="text-xs text-subtle">PNG, JPG o WebP · máx. 2 MB</p>
          </>
        )}
        <input id="imagen" type="file" accept={TIPOS_IMAGEN.join(',')} className="sr-only"
          aria-describedby={error ? 'imagen-error' : undefined}
          onChange={e => onElegir(e.target.files[0])} />
      </label>
      {error
        ? <p id="imagen-error" className="text-xs font-semibold text-danger">{error}</p>
        : editando && <p className="text-xs text-subtle">Si no eliges otra, se mantiene la imagen actual.</p>}
    </div>
  )
}

// Formulario para crear y editar. Con `proyecto` arranca con sus datos (Edit lo monta con
// key={id}, así al cambiar de proyecto el estado se reinicia sin efectos de sincronización).
// `borrador` precarga un proyecto nuevo, p. ej. al publicar un plan completado del planificador.
const Formulario = ({ proyecto, borrador }) => {
  const { submitProyecto, proyectos, mostrarAlerta } = useProyectos();
  const navigate = useNavigate()
  const editando = Boolean(proyecto)

  const base = proyecto ?? borrador
  const [datos, setDatos] = useState({
    nombre: base?.nombre ?? '',
    tipo: base?.tipo ?? '',
    link: base?.link ?? '',
    github: base?.github ?? '',
    fechaEntrega: aFechaInput(base?.fechaEntrega),
    descripcion: base?.descripcion ?? '',
    problema: base?.problema ?? '',
    solucion: base?.solucion ?? '',
    descripcionEn: base?.descripcionEn ?? '',
    problemaEn: base?.problemaEn ?? '',
    solucionEn: base?.solucionEn ?? '',
  })
  const [techs, setTechs] = useState(() => parseTecnologias(base?.tecnologias))
  const [imagen, setImagen] = useState(null)
  const [errores, setErrores] = useState({})
  const [enviando, setEnviando] = useState(false)
  // Tras el primer intento de envío se revalida en cada cambio, para que el error desaparezca
  // en cuanto se corrige. Antes de eso no se marca nada en rojo mientras el usuario aún escribe.
  const intentado = useRef(false)

  // URL temporal para previsualizar el archivo elegido. Cada createObjectURL retiene el archivo
  // en memoria hasta que se revoca, así que se libera la anterior al elegir otra y la última al
  // desmontar. Se crea en el evento (no en useMemo/useEffect) porque StrictMode ejecuta esos
  // dos veces en desarrollo y revocaría la URL que la vista previa está usando.
  const [preview, setPreview] = useState(null)
  const previewRef = useRef(null)
  useEffect(() => () => previewRef.current && URL.revokeObjectURL(previewRef.current), [])

  // Galería: archivos nuevos (con su URL de vista previa) y public_id de las guardadas que se
  // quieren borrar. Las URLs temporales se liberan al quitar cada imagen y al salir del formulario.
  const [galeriaNueva, setGaleriaNueva] = useState([])
  const [galeriaEliminar, setGaleriaEliminar] = useState([])
  const urlsGaleria = useRef(new Set())
  useEffect(() => {
    const urls = urlsGaleria.current
    return () => urls.forEach(url => URL.revokeObjectURL(url))
  }, [])
  const galeriaGuardada = (proyecto?.galeria ?? []).filter(img => !galeriaEliminar.includes(img.public_id))

  const tiposExistentes = useMemo(() => contarTipos(proyectos).map(t => t.valor), [proyectos])
  const techsExistentes = useMemo(() => contarTecnologias(proyectos).map(t => t.valor), [proyectos])

  const revalidar = (nuevosDatos, nuevasTechs, nuevaImagen) => {
    if (intentado.current) setErrores(validar(nuevosDatos, nuevasTechs, nuevaImagen, editando))
  }

  const cambiar = e => {
    const nuevos = { ...datos, [e.target.name]: e.target.value }
    setDatos(nuevos)
    revalidar(nuevos, techs, imagen)
  }

  const cambiarTechs = nuevas => {
    setTechs(nuevas)
    revalidar(datos, nuevas, imagen)
  }

  // La imagen se valida al elegirla (no al enviar): así el usuario sabe al momento que el
  // archivo no sirve, en vez de enterarse después de rellenar todo el formulario.
  const elegirImagen = archivo => {
    if (!archivo) return
    if (!TIPOS_IMAGEN.includes(archivo.type)) return setErrores(e => ({ ...e, imagen: 'Formato no válido. Usa PNG, JPG o WebP' }))
    if (archivo.size > MAX_IMAGEN) return setErrores(e => ({ ...e, imagen: `La imagen pesa ${(archivo.size / 1e6).toFixed(1)} MB; el máximo es 2 MB` }))
    if (previewRef.current) URL.revokeObjectURL(previewRef.current)
    previewRef.current = URL.createObjectURL(archivo)
    setPreview(previewRef.current)
    setImagen(archivo)
    setErrores(actuales => {
      const restantes = { ...actuales }
      delete restantes.imagen
      return restantes
    })
  }

  // Se aceptan sólo los archivos válidos que quepan en el límite; los demás se descartan con un
  // aviso que dice cuántos y por qué, en vez de rechazar la selección entera por uno malo.
  const agregarGaleria = archivos => {
    const hueco = MAX_GALERIA - galeriaGuardada.length - galeriaNueva.length
    const validos = archivos.filter(a => TIPOS_IMAGEN.includes(a.type) && a.size <= MAX_IMAGEN)
    const aceptados = validos.slice(0, Math.max(hueco, 0))
    const avisos = []
    if (validos.length < archivos.length) avisos.push(`${archivos.length - validos.length} no válidas (formato o más de 2 MB)`)
    if (aceptados.length < validos.length) avisos.push(`${validos.length - aceptados.length} no caben (máx. ${MAX_GALERIA})`)
    setErrores(actuales => ({ ...actuales, galeria: avisos.length ? `Se omitieron imágenes: ${avisos.join(' y ')}.` : undefined }))

    const nuevas = aceptados.map(archivo => {
      const url = URL.createObjectURL(archivo)
      urlsGaleria.current.add(url)
      return { id: crypto.randomUUID(), archivo, url }
    })
    setGaleriaNueva(actuales => [...actuales, ...nuevas])
  }

  const quitarNueva = id => {
    const img = galeriaNueva.find(g => g.id === id)
    if (img) {
      URL.revokeObjectURL(img.url)
      urlsGaleria.current.delete(img.url)
    }
    setGaleriaNueva(actuales => actuales.filter(g => g.id !== id))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    intentado.current = true
    const nuevosErrores = validar(datos, techs, imagen, editando)
    setErrores(nuevosErrores)

    const primerError = Object.keys(nuevosErrores)[0]
    if (primerError) {
      document.getElementById(primerError)?.focus()
      return
    }

    setEnviando(true)
    try {
      await submitProyecto({
        id: proyecto?._id,
        ...datos,
        tecnologias: techs.join(', '),
        imagen: imagen ?? undefined,
        galeria: galeriaNueva.map(g => g.archivo),
        // El multipart sólo transporta texto y archivos: la lista de ids va como JSON
        galeriaEliminar: galeriaEliminar.length ? JSON.stringify(galeriaEliminar) : undefined,
      })
      // El toast de éxito lo muestra el AdminLayout, que sigue montado tras navegar
      navigate('/admin')
    } catch (error) {
      mostrarAlerta(error.message)
      setEnviando(false)
    }
  }

  // Lo que se ve en la tarjeta de vista previa: si aún no hay archivo nuevo se usa la imagen
  // guardada, para que al editar la vista previa no aparezca vacía.
  const vistaPrevia = {
    ...datos,
    tecnologias: techs.join(','),
    imagen: { secure_url: preview ?? proyecto?.imagen?.secure_url },
    galeria: [...galeriaGuardada, ...galeriaNueva],
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="flex flex-col gap-6">
        <fieldset className="glass flex flex-col gap-5 rounded-2xl p-6">
          <legend className="sr-only">Información general</legend>
          <h2 className="font-bold text-fg">Información general</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Campo label="Nombre" id="nombre" placeholder="Mi proyecto increíble" value={datos.nombre} onChange={cambiar} error={errores.nombre} />
            <Campo label="Tipo" id="tipo" list="sugerencias-tipos" placeholder="Web, clon, diseño…" value={datos.tipo} onChange={cambiar}
              error={errores.tipo} hint="Se usa para los filtros del portafolio" />
            <datalist id="sugerencias-tipos">
              {tiposExistentes.map(t => <option key={t} value={t} />)}
            </datalist>
          </div>
          <Campo
            as="textarea" label="Descripción" id="descripcion" rows={6} maxLength={MAX_DESCRIPCION}
            placeholder="¿Qué problema resuelve? ¿Qué aprendiste construyéndolo?"
            value={datos.descripcion} onChange={cambiar} error={errores.descripcion} className="resize-y"
            extra={<span className={`font-mono text-xs ${datos.descripcion.length > MAX_DESCRIPCION * 0.9 ? 'text-neon-amber' : 'text-subtle'}`}>
              {datos.descripcion.length}/{MAX_DESCRIPCION}
            </span>}
          />
          <CampoTecnologias techs={techs} setTechs={cambiarTechs} sugerencias={techsExistentes} error={errores.tecnologias} />
        </fieldset>

        <fieldset className="glass flex flex-col gap-5 rounded-2xl p-6">
          <legend className="sr-only">Caso de estudio</legend>
          <div>
            <h2 className="font-bold text-fg">Caso de estudio <span className="font-normal text-subtle">(opcional)</span></h2>
            <p className="mt-1 text-sm text-subtle">Cuenta el porqué del proyecto: es lo que más valoran reclutadores y clientes.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <Campo as="textarea" label="Problema" id="problema" rows={4} maxLength={MAX_DESCRIPCION} className="resize-y"
              placeholder="¿Qué necesidad o dificultad había? ¿Para quién?" value={datos.problema} onChange={cambiar} />
            <Campo as="textarea" label="Solución" id="solucion" rows={4} maxLength={MAX_DESCRIPCION} className="resize-y"
              placeholder="¿Cómo lo resolviste? ¿Qué decisiones técnicas tomaste y qué resultado tuvo?" value={datos.solucion} onChange={cambiar} />
          </div>
        </fieldset>

        {/* Plegado por defecto: es opcional y ocupa mucho. Se abre solo si ya tiene contenido,
            para que al editar se vea que el proyecto tiene traducción. */}
        <details open={Boolean(base?.descripcionEn || base?.problemaEn || base?.solucionEn)} className="glass group rounded-2xl p-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
            <span>
              <span className="font-bold text-fg">Versión en inglés <span className="font-normal text-subtle">(opcional)</span></span>
              <span className="mt-1 block text-sm text-subtle">Se muestra cuando el visitante elige inglés. Si la dejas vacía, se usa el texto en español.</span>
            </span>
            <span className="text-subtle transition-transform group-open:rotate-45 text-xl">+</span>
          </summary>
          <div className="mt-5 flex flex-col gap-5">
            <Campo as="textarea" label="Description" id="descripcionEn" rows={4} maxLength={MAX_DESCRIPCION} className="resize-y"
              placeholder={datos.descripcion || 'What is this project about?'} value={datos.descripcionEn} onChange={cambiar} lang="en" />
            <div className="grid gap-5 md:grid-cols-2">
              <Campo as="textarea" label="The challenge" id="problemaEn" rows={3} maxLength={MAX_DESCRIPCION} className="resize-y"
                value={datos.problemaEn} onChange={cambiar} lang="en" />
              <Campo as="textarea" label="The solution" id="solucionEn" rows={3} maxLength={MAX_DESCRIPCION} className="resize-y"
                value={datos.solucionEn} onChange={cambiar} lang="en" />
            </div>
          </div>
        </details>

        <fieldset className="glass flex flex-col gap-5 rounded-2xl p-6">
          <legend className="sr-only">Enlaces</legend>
          <h2 className="font-bold text-fg">Enlaces y fecha</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Campo label="Sitio web" id="link" type="url" placeholder="https://miproyecto.com" value={datos.link} onChange={cambiar} error={errores.link} />
            <Campo label="Repositorio (opcional)" id="github" type="url" placeholder="https://github.com/…" value={datos.github} onChange={cambiar} error={errores.github} />
          </div>
          <Campo label="Fecha de entrega" id="fechaEntrega" type="date" value={datos.fechaEntrega} onChange={cambiar}
            hint="Ordena el portafolio. Si la dejas vacía se usa la fecha de hoy." className="sm:max-w-xs" />
        </fieldset>
      </div>

      <aside className="flex flex-col gap-6 lg:sticky lg:top-26 lg:self-start">
        <div className="glass rounded-2xl p-6">
          <CampoImagen preview={preview ?? proyecto?.imagen?.secure_url} onElegir={elegirImagen} error={errores.imagen} editando={editando} />
          <div className="mt-6 border-t border-white/5 pt-6">
            <CampoGaleria
              existentes={galeriaGuardada}
              nuevas={galeriaNueva}
              max={MAX_GALERIA}
              tiposAceptados={TIPOS_IMAGEN.join(',')}
              onAgregar={agregarGaleria}
              onQuitarExistente={id => setGaleriaEliminar(actuales => [...actuales, id])}
              onQuitarNueva={quitarNueva}
              error={errores.galeria}
            />
          </div>
        </div>

        <div>
          <p className="mb-3 font-mono text-xs tracking-widest text-subtle uppercase">Vista previa en el portafolio</p>
          <div className="pointer-events-none">
            <Card proyecto={vistaPrevia} />
          </div>
        </div>

        <div className="flex gap-3">
          <Boton to="/admin" variant="ghost">Cancelar</Boton>
          <Boton type="submit" loading={enviando} icon={faFloppyDisk} className="flex-1">
            {editando ? 'Guardar cambios' : 'Publicar proyecto'}
          </Boton>
        </div>
      </aside>
    </form>
  )
}

export default Formulario
