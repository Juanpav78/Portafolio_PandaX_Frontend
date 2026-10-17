import { motion } from "framer-motion"
import useIdioma from "../hooks/useIdioma"

const IDIOMAS = [{ id: 'es', nombre: 'Español' }, { id: 'en', nombre: 'English' }]

// Interruptor ES/EN. La "píldora" activa usa layoutId: Framer Motion la desliza de una opción
// a la otra en lugar de hacerla desaparecer y aparecer.
const SelectorIdioma = ({ className = '' }) => {
  const { idioma, setIdioma, t } = useIdioma()

  return (
    <div role="radiogroup" aria-label={t('nav.language')} className={`flex rounded-full border border-white/10 p-0.5 ${className}`}>
      {IDIOMAS.map(({ id, nombre }) => (
        <button
          key={id}
          role="radio"
          aria-checked={idioma === id}
          aria-label={nombre}
          lang={id}
          onClick={() => setIdioma(id)}
          className={`relative rounded-full px-2.5 py-1 font-mono text-xs font-semibold uppercase transition-colors
            ${idioma === id ? 'text-ink-950' : 'text-muted hover:text-fg'}`}
        >
          {idioma === id && (
            <motion.span layoutId={`idioma-activo-${className}`} className="absolute inset-0 rounded-full bg-linear-to-r from-neon-amber to-neon"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }} />
          )}
          <span className="relative">{id}</span>
        </button>
      ))}
    </div>
  )
}

export default SelectorIdioma
