import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import useIdioma from "../hooks/useIdioma"
import { imagenOptimizada } from "../helpers/proyectos"

// Distancia mínima (px) del gesto de deslizar para cambiar de imagen; por debajo se considera
// un toque accidental y la imagen vuelve a su sitio.
const UMBRAL_SWIPE = 60

// Carrusel de imágenes del proyecto: portada + galería.
// Las flechas del teclado se reservan al modal (cambiar de proyecto), así que aquí se navega
// con los botones, las miniaturas o deslizando con el dedo en móvil.
const GaleriaImagenes = ({ imagenes, nombre }) => {
  const { t } = useIdioma()
  const [actual, setActual] = useState(0)
  const [direccion, setDireccion] = useState(0)
  const varias = imagenes.length > 1

  const ir = indice => {
    setDireccion(indice > actual ? 1 : -1)
    setActual((indice + imagenes.length) % imagenes.length)
  }

  if (!imagenes.length) return <div className="skeleton aspect-16/10 w-full rounded-2xl" />

  return (
    <div>
      {/* Proporción fija: reserva el hueco mientras la imagen descarga, así el texto de debajo
          no "salta". object-contain muestra la captura completa aunque sea vertical (móvil). */}
      <div className="skeleton relative aspect-16/10 max-h-[55vh] w-full overflow-hidden rounded-2xl">
        <AnimatePresence initial={false} custom={direccion} mode="popLayout">
          <motion.img
            key={imagenes[actual].secure_url}
            src={imagenOptimizada(imagenes[actual].secure_url, 1400)}
            alt={t('card.screenshot', { nombre }) + (varias ? ` (${actual + 1}/${imagenes.length})` : '')}
            custom={direccion}
            initial={{ opacity: 0, x: direccion * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direccion * -60 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            drag={varias ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.4}
            onDragEnd={(_, { offset }) => {
              if (offset.x < -UMBRAL_SWIPE) ir(actual + 1)
              else if (offset.x > UMBRAL_SWIPE) ir(actual - 1)
            }}
            draggable={false}
            className="absolute inset-0 size-full cursor-grab object-contain active:cursor-grabbing"
          />
        </AnimatePresence>
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10 ring-inset" />

        {varias && (
          <>
            <button onClick={() => ir(actual - 1)} aria-label={t('detail.prevImage')}
              className="glass absolute top-1/2 left-3 grid size-10 -translate-y-1/2 place-items-center rounded-full text-fg transition hover:text-neon">
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <button onClick={() => ir(actual + 1)} aria-label={t('detail.nextImage')}
              className="glass absolute top-1/2 right-3 grid size-10 -translate-y-1/2 place-items-center rounded-full text-fg transition hover:text-neon">
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
            <span className="glass absolute right-3 bottom-3 rounded-full px-2.5 py-1 font-mono text-xs text-fg">
              {actual + 1} / {imagenes.length}
            </span>
          </>
        )}
      </div>

      {varias && (
        <ul className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {imagenes.map((imagen, i) => (
            <li key={imagen.secure_url} className="shrink-0">
              <button
                onClick={() => ir(i)}
                aria-label={t('detail.goToImage', { n: i + 1 })}
                aria-current={i === actual}
                className={`block h-14 w-20 overflow-hidden rounded-lg ring-2 transition
                  ${i === actual ? 'ring-neon shadow-[0_0_14px_-2px_var(--color-neon)]' : 'opacity-50 ring-transparent hover:opacity-100'}`}
              >
                <img src={imagenOptimizada(imagen.secure_url, 160)} alt="" loading="lazy" className="size-full object-cover object-top" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default GaleriaImagenes
