import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faImages, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons"
import { imagenOptimizada } from "../helpers/proyectos"

// Definida fuera de CampoGaleria: si se declarara dentro, React la trataría como un componente
// nuevo en cada render y desmontaría y volvería a montar todas las miniaturas.
const Miniatura = ({ src, etiqueta, onQuitar, nueva }) => (
  <li className="group relative aspect-video overflow-hidden rounded-lg bg-ink-700 ring-1 ring-white/10">
    <img src={src} alt="" className="size-full object-cover object-top" />
    {nueva && <span className="absolute bottom-1 left-1 rounded bg-neon px-1.5 font-mono text-[0.6rem] font-bold text-ink-950">NUEVA</span>}
    <button type="button" onClick={onQuitar} aria-label={`Quitar ${etiqueta}`}
      className="absolute top-1 right-1 grid size-6 place-items-center rounded-full bg-ink-950/80 text-xs text-fg opacity-100 transition
        hover:bg-danger sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100">
      <FontAwesomeIcon icon={faXmark} />
    </button>
  </li>
)

// Galería del formulario de proyecto. Muestra juntas las imágenes ya guardadas y las nuevas
// pendientes de subir; ninguna acción toca el servidor hasta que se guarda el formulario
// (quitar una guardada sólo la marca para borrar), así "Cancelar" deshace todo.
const CampoGaleria = ({ existentes, nuevas, max, onAgregar, onQuitarExistente, onQuitarNueva, error, tiposAceptados }) => {
  const [arrastrando, setArrastrando] = useState(false)
  const total = existentes.length + nuevas.length
  const lleno = total >= max

  const alSoltar = e => {
    e.preventDefault()
    setArrastrando(false)
    if (!lleno) onAgregar([...e.dataTransfer.files])
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold text-fg/90">Galería <span className="font-normal text-subtle">(opcional)</span></span>
        <span className={`font-mono text-xs ${lleno ? 'text-neon-amber' : 'text-subtle'}`}>{total}/{max}</span>
      </div>

      <ul className="grid grid-cols-3 gap-2">
        {existentes.map((img, i) => (
          <Miniatura key={img.public_id} src={imagenOptimizada(img.secure_url, 240)} etiqueta={`imagen ${i + 1}`} onQuitar={() => onQuitarExistente(img.public_id)} />
        ))}
        {nuevas.map((img, i) => (
          <Miniatura key={img.id} src={img.url} etiqueta={`imagen nueva ${i + 1}`} onQuitar={() => onQuitarNueva(img.id)} nueva />
        ))}
        {!lleno && (
          <li>
            <label
              onDragOver={e => { e.preventDefault(); setArrastrando(true) }}
              onDragLeave={() => setArrastrando(false)}
              onDrop={alSoltar}
              className={`flex aspect-video cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed text-xs transition-colors
                ${arrastrando ? 'border-neon bg-neon/5 text-neon' : 'border-white/10 text-subtle hover:border-neon/50 hover:text-neon-soft'}`}
            >
              <FontAwesomeIcon icon={total ? faPlus : faImages} className="text-base" />
              Añadir
              {/* multiple: se pueden elegir varias capturas de una vez en el selector de archivos */}
              <input type="file" multiple accept={tiposAceptados} className="sr-only"
                aria-label="Añadir imágenes a la galería"
                onChange={e => { onAgregar([...e.target.files]); e.target.value = '' }} />
            </label>
          </li>
        )}
      </ul>
      {error
        ? <p role="alert" className="text-xs font-semibold text-danger">{error}</p>
        : <p className="text-xs text-subtle">Capturas extra (móvil, otras pantallas…). Se ven en el modal después de la portada.</p>}
    </div>
  )
}

export default CampoGaleria
