import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCloudArrowUp, faImage } from "@fortawesome/free-solid-svg-icons"
import { TIPOS_IMAGEN } from "../../helpers/imagenes"

// Zona para soltar o elegir la imagen, con vista previa inmediata. Sirve para la portada y para
// la captura móvil (más alta, `vertical`), que además se puede quitar con `onQuitar`.
const CampoImagen = ({
  preview, onElegir, error, editando, id = 'imagen', label = 'Portada', vertical = false, onQuitar,
  ayuda = 'Si no eliges otra, se mantiene la imagen actual.',
}) => {
  const [arrastrando, setArrastrando] = useState(false)

  const alSoltar = e => {
    e.preventDefault()
    setArrastrando(false)
    onElegir(e.dataTransfer.files[0])
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-semibold text-fg/90">{label}</span>
        {preview && onQuitar && (
          <button type="button" onClick={onQuitar} className="text-xs font-medium text-subtle hover:text-danger">Quitar</button>
        )}
      </div>
      <label
        htmlFor={id}
        onDragOver={e => { e.preventDefault(); setArrastrando(true) }}
        onDragLeave={() => setArrastrando(false)}
        onDrop={alSoltar}
        className={`group relative flex ${vertical ? 'mx-auto aspect-[9/16] w-1/2 min-w-36' : 'aspect-video'} cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl
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
        <input id={id} type="file" accept={TIPOS_IMAGEN.join(',')} className="sr-only"
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={e => onElegir(e.target.files[0])} />
      </label>
      {error
        ? <p id={`${id}-error`} className="text-xs font-semibold text-danger">{error}</p>
        : (editando || vertical) && <p className="text-xs text-subtle">{ayuda}</p>}
    </div>
  )
}

export default CampoImagen
