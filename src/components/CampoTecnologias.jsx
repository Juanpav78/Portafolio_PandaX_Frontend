import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { parseTecnologias } from "../helpers/proyectos"

// Input de tecnologías como chips. Enter o coma confirman la tecnología escrita y Backspace
// en el input vacío borra la última, que es lo que se espera de un campo de etiquetas.
// Internamente es un array, pero al backend se envía como texto separado por comas (el
// formato que ya usaba la base de datos), así los proyectos antiguos siguen funcionando.
// `id`, `label` y `placeholder` permiten reutilizarlo para otras listas de etiquetas (p. ej. puntos clave).
const CampoTecnologias = ({
  techs, setTechs, sugerencias = [], error, hint = 'Las tres primeras se muestran en la tarjeta.',
  id = 'tecnologias', label = 'Tecnologías', placeholder = 'React, Node.js… (Enter para añadir)',
}) => {
  const [texto, setTexto] = useState('')

  const agregar = valor => {
    const nuevas = parseTecnologias(valor)
      .filter(tech => !techs.some(t => t.toLowerCase() === tech.toLowerCase()))
    if (nuevas.length) setTechs([...techs, ...nuevas])
    setTexto('')
  }

  const alPulsar = e => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      agregar(texto)
    } else if (e.key === 'Backspace' && !texto && techs.length) {
      setTechs(techs.slice(0, -1))
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-fg/90">{label}</label>
      <div
        aria-invalid={Boolean(error)}
        className="field flex min-h-12 flex-wrap items-center gap-2 py-2 focus-within:border-neon
          focus-within:shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-neon)_20%,transparent)]"
      >
        {techs.map(tech => (
          <span key={tech} className="chip gap-1.5 py-1">
            {tech}
            <button type="button" onClick={() => setTechs(techs.filter(t => t !== tech))}
              aria-label={`Quitar ${tech}`} className="hover:text-fg"><FontAwesomeIcon icon={faXmark} /></button>
          </span>
        ))}
        <input
          id={id}
          list={`sugerencias-${id}`}
          value={texto}
          onChange={e => setTexto(e.target.value)}
          onKeyDown={alPulsar}
          // Al salir del campo se confirma lo escrito para que no se pierda si no pulsaron Enter
          onBlur={() => texto && agregar(texto)}
          placeholder={techs.length ? '' : placeholder}
          aria-describedby={error ? `${id}-error` : `${id}-hint`}
          className="min-w-32 flex-1 bg-transparent text-fg outline-none placeholder:text-subtle"
        />
      </div>
      {/* Sugiere las tecnologías ya usadas para evitar duplicados con distinta escritura
          ("React" vs "ReactJS"), que fragmentarían el filtro por tecnología del portafolio */}
      <datalist id={`sugerencias-${id}`}>
        {sugerencias.filter(s => !techs.includes(s)).map(s => <option key={s} value={s} />)}
      </datalist>
      {error
        ? <p id={`${id}-error`} className="text-xs font-semibold text-danger">{error}</p>
        : <p id={`${id}-hint`} className="text-xs text-subtle">{hint}</p>}
    </div>
  )
}

export default CampoTecnologias
