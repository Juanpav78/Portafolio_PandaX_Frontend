import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faExpand, faImages, faStar } from "@fortawesome/free-solid-svg-icons"
import useIdioma from "../hooks/useIdioma"
import { imagenOptimizada, parseTecnologias } from "../helpers/proyectos"

const MAX_TECHS = 3

// Mueve el foco de luz (.spotlight en index.css) a la posición del cursor dentro de la tarjeta.
// Se escribe directamente en CSS variables en vez de usar estado de React para no re-renderizar
// la tarjeta decenas de veces por segundo mientras se mueve el ratón.
const moverFoco = e => {
  const caja = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--x', `${e.clientX - caja.left}px`)
  e.currentTarget.style.setProperty('--y', `${e.clientY - caja.top}px`)
}

// Tarjeta de proyecto. Sin `onAbrir` es sólo visual (la vista previa del formulario del admin
// la usa así); con `onAbrir` toda la tarjeta es clicable mediante un botón que la cubre entera,
// lo que mantiene un único elemento enfocable con teclado y un nombre accesible claro.
const Card = ({ proyecto, onAbrir, indice = 0 }) => {
  const { t, campo } = useIdioma()
  const { nombre, imagen, tipo, tecnologias, destacado, galeria = [] } = proyecto
  const descripcion = campo(proyecto, 'descripcion')
  const techs = parseTecnologias(tecnologias)
  const restantes = techs.length - MAX_TECHS
  const totalImagenes = galeria.length + (imagen?.secure_url ? 1 : 0)

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      // El retardo escalonado se limita a las primeras tarjetas: con 30 proyectos, la última
      // tardaría segundos en aparecer si cada una sumara su propio retardo.
      transition={{ duration: 0.45, delay: Math.min(indice, 6) * 0.06, ease: 'easeOut' }}
      onMouseMove={moverFoco}
      className="neon-border spotlight group relative flex flex-col overflow-hidden rounded-2xl bg-ink-800/70
        transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:neon-glow"
    >
      <div className="relative aspect-16/10 overflow-hidden bg-ink-700">
        {imagen?.secure_url && (
          <img
            loading="lazy"
            decoding="async"
            src={imagenOptimizada(imagen.secure_url, 640)}
            alt={t('card.screenshot', { nombre })}
            className="size-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-ink-900 via-ink-900/10 to-transparent" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {destacado && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-neon-amber to-neon px-3 py-1 text-xs font-bold text-ink-950 shadow-[0_0_16px_-4px_var(--color-neon)]">
              <FontAwesomeIcon icon={faStar} className="text-[0.65rem]" /> {t('card.featured')}
            </span>
          )}
          {tipo && (
            <span className="glass rounded-full px-3 py-1 text-xs font-bold tracking-wide text-fg uppercase">{tipo}</span>
          )}
        </div>
        {/* Avisa de que hay más capturas dentro, para invitar a abrir el proyecto */}
        {totalImagenes > 1 && (
          <span className="glass absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-xs text-fg"
            title={t('card.photos', { n: totalImagenes })}>
            <FontAwesomeIcon icon={faImages} /> {totalImagenes}
          </span>
        )}
        {onAbrir && (
          <span className="absolute top-3 right-3 grid size-9 -rotate-45 place-items-center rounded-full bg-neon text-ink-950 opacity-0
            shadow-[0_0_20px_var(--color-neon)] transition-all duration-300 group-hover:rotate-0 group-hover:opacity-100">
            <FontAwesomeIcon icon={faExpand} className="text-sm" />
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-xl text-fg transition-colors group-hover:text-neon-soft">
          {nombre || 'Nombre del proyecto'}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted">
          {descripcion || 'La descripción aparecerá aquí.'}
        </p>
        <ul className="mt-auto flex flex-wrap gap-1.5 pt-2" aria-label={t('card.techs')}>
          {techs.slice(0, MAX_TECHS).map(tech => <li key={tech} className="chip">{tech}</li>)}
          {restantes > 0 && <li className="chip border-white/10 bg-white/5 text-muted">+{restantes}</li>}
        </ul>
      </div>

      {onAbrir && (
        <button
          onClick={onAbrir}
          className="absolute inset-0 z-10 rounded-2xl"
          aria-label={t('card.details', { nombre })}
        />
      )}
    </motion.article>
  )
}

export default Card
