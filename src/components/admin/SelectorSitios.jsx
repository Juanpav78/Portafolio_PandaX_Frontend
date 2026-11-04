import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck } from "@fortawesome/free-solid-svg-icons"
import { SITIOS } from "../../helpers/sitios"

// Casillas tipo chip para elegir en qué webs aparece un contenido. Exige al menos uno (igual que
// el backend) y muestra debajo, en palabras, dónde se va a ver según los sitios y "Publicado".
const SelectorSitios = ({ valor = [], onChange, error, publicado = true, tipo = 'Este contenido' }) => {
  const alternar = sitio => onChange(valor.includes(sitio) ? valor.filter(s => s !== sitio) : [...valor, sitio])
  const elegidos = SITIOS.filter(s => valor.includes(s.valor))

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1.5 text-sm font-semibold text-fg/90">Sitios donde aparece</legend>
      <div id="sitios" tabIndex={-1} className="grid gap-2 sm:grid-cols-2">
        {SITIOS.map(({ valor: sitio, nombre, descripcion }) => {
          const activo = valor.includes(sitio)
          return (
            <label key={sitio}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 transition-colors
                ${activo ? 'border-neon bg-neon/5' : 'border-ink-600 hover:border-white/20'}`}>
              <input type="checkbox" className="peer sr-only" checked={activo} onChange={() => alternar(sitio)} />
              <span aria-hidden className={`mt-0.5 grid size-4 shrink-0 place-items-center rounded border text-[0.55rem]
                peer-focus-visible:ring-2 peer-focus-visible:ring-neon/40
                ${activo ? 'border-neon bg-neon text-white' : 'border-white/25'}`}>
                {activo && <FontAwesomeIcon icon={faCheck} className="text-ink-950" />}
              </span>
              <span className="flex flex-col">
                <span className="badge-sitio w-fit" data-sitio={sitio}>{nombre}</span>
                <span className="mt-1 text-xs text-subtle">{descripcion}</span>
              </span>
            </label>
          )
        })}
      </div>
      {error
        ? <p className="text-xs font-semibold text-danger">{error}</p>
        : (
          <p className="rounded-lg bg-ink-700 px-3 py-2 text-xs text-muted">
            {!elegidos.length && 'Elige al menos un sitio.'}
            {elegidos.length > 0 && !publicado && `${tipo} está oculto: no aparecerá en ninguna web hasta que lo publiques.`}
            {elegidos.length > 0 && publicado && <>Vista previa: {tipo.toLowerCase()} aparecerá en <strong className="text-fg">{elegidos.map(s => s.nombre).join(' y ')}</strong>.</>}
          </p>
        )}
    </fieldset>
  )
}

export default SelectorSitios
