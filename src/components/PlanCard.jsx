import { Link } from "react-router"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight, faClock, faGripVertical } from "@fortawesome/free-solid-svg-icons"
import { PRIORIDADES, progreso, siguienteEstado, vencimiento } from "../helpers/planes"
import { parseTecnologias } from "../helpers/proyectos"

// Tarjeta del tablero del planificador.
// El arrastre usa la API nativa de HTML5 en un <article> normal: si se pusiera en el motion.div,
// Framer Motion interpretaría onDragStart como su propio gesto de arrastre y no como el del
// navegador. El motion.div exterior sólo se encarga de animar la recolocación (layout).
const PlanCard = ({ plan, arrastrando, onArrastrar, onSoltarFin, onMover }) => {
  const { hechas, total, porcentaje } = progreso(plan)
  const aviso = vencimiento(plan.fechaLimite, plan.estado === 'completado')
  const siguiente = siguienteEstado(plan.estado)
  const techs = parseTecnologias(plan.tecnologias)

  return (
    <motion.div layout transition={{ type: 'spring', stiffness: 500, damping: 40 }}>
      <article
        draggable
        onDragStart={e => {
          e.dataTransfer.setData('text/plain', plan._id)
          e.dataTransfer.effectAllowed = 'move'
          onArrastrar(plan._id)
        }}
        onDragEnd={onSoltarFin}
        className={`group relative cursor-grab rounded-xl border border-white/5 bg-ink-800/80 p-4 transition-all
          hover:border-neon/30 hover:shadow-[0_0_24px_-12px_var(--color-neon)] active:cursor-grabbing
          ${arrastrando ? 'scale-95 opacity-40' : ''}`}
      >
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className={`rounded-full border px-2 py-0.5 text-[0.68rem] font-bold tracking-wide uppercase ${PRIORIDADES[plan.prioridad].clase}`}>
            {PRIORIDADES[plan.prioridad].nombre}
          </span>
          <FontAwesomeIcon icon={faGripVertical} className="text-subtle opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
        </div>

        {/* El enlace cubre toda la tarjeta (::after) pero los botones quedan por encima con z-10 */}
        <Link to={`/admin/planes/${plan._id}`} draggable={false}
          className="block font-bold text-fg after:absolute after:inset-0 after:content-[''] hover:text-neon-soft">
          {plan.nombre}
        </Link>
        {plan.descripcion && <p className="mt-1 line-clamp-2 text-sm text-muted">{plan.descripcion}</p>}

        {techs.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1">
            {techs.slice(0, 3).map(tech => <li key={tech} className="chip text-[0.65rem]">{tech}</li>)}
          </ul>
        )}

        {total > 0 && (
          <div className="mt-3">
            <div className="mb-1 flex justify-between text-xs text-subtle">
              <span>{hechas}/{total} tareas</span>
              <span>{porcentaje}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
              <div className="h-full rounded-full bg-linear-to-r from-neon to-neon-pink transition-[width] duration-500" style={{ width: `${porcentaje}%` }} />
            </div>
          </div>
        )}

        <div className="mt-3 flex min-h-7 items-center justify-between gap-2">
          {aviso
            ? <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${aviso.clase}`}>
                <FontAwesomeIcon icon={faClock} /> {aviso.texto}
              </span>
            : <span />}
          {/* Alternativa al arrastre para móvil y teclado: avanza el plan a la siguiente columna */}
          {siguiente && (
            <button
              onClick={() => onMover(plan._id, siguiente.id)}
              title={`Mover a ${siguiente.nombre}`}
              aria-label={`Mover ${plan.nombre} a ${siguiente.nombre}`}
              className="relative z-10 grid size-7 place-items-center rounded-lg border border-white/10 text-xs text-muted transition-all
                hover:border-neon/50 hover:text-neon focus-visible:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          )}
        </div>
      </article>
    </motion.div>
  )
}

export default PlanCard
