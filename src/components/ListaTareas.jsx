import { useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faListCheck, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons"
import usePlanes from "../hooks/usePlanes"
import { claveFecha, progreso, vencimiento } from "../helpers/planes"

// Una tarea. El título se edita en el sitio: click para editar, Enter o salir del campo
// guarda, Escape cancela. Se guarda sólo si el texto cambió, para no hacer peticiones vacías.
const Tarea = ({ planId, tarea }) => {
  const { actualizarTarea, eliminarTarea } = usePlanes()
  const [editando, setEditando] = useState(false)
  const [titulo, setTitulo] = useState(tarea.titulo)
  const aviso = vencimiento(tarea.fechaLimite, tarea.completada)

  const guardar = () => {
    setEditando(false)
    const limpio = titulo.trim()
    if (!limpio) return setTitulo(tarea.titulo)
    if (limpio !== tarea.titulo) actualizarTarea(planId, tarea._id, { titulo: limpio }).catch(() => setTitulo(tarea.titulo))
  }

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="group flex items-start gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-white/3"
    >
      <button
        role="checkbox"
        aria-checked={tarea.completada}
        aria-label={tarea.completada ? `Marcar "${tarea.titulo}" como pendiente` : `Completar "${tarea.titulo}"`}
        onClick={() => actualizarTarea(planId, tarea._id, { completada: !tarea.completada }).catch(() => {})}
        className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border text-[0.65rem] transition-all
          ${tarea.completada
            ? 'border-success bg-success text-ink-950 shadow-[0_0_12px_-2px_var(--color-success)]'
            : 'border-white/20 text-transparent hover:border-neon'}`}
      >
        <FontAwesomeIcon icon={faCheck} />
      </button>

      <div className="min-w-0 flex-1">
        {editando ? (
          <input
            autoFocus
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
            onBlur={guardar}
            onKeyDown={e => {
              if (e.key === 'Enter') e.currentTarget.blur()
              if (e.key === 'Escape') { setTitulo(tarea.titulo); setEditando(false) }
            }}
            aria-label="Título de la tarea"
            className="w-full rounded-md bg-white/5 px-2 py-0.5 text-sm text-fg outline-none ring-1 ring-neon"
          />
        ) : (
          <button onClick={() => setEditando(true)} title="Click para editar"
            className={`w-full text-left text-sm transition-colors ${tarea.completada ? 'text-subtle line-through' : 'text-fg hover:text-neon-soft'}`}>
            {tarea.titulo}
          </button>
        )}
        <div className="mt-1 flex items-center gap-2">
          {/* Fecha límite editable directamente: el input nativo de fecha vale para escritorio y móvil */}
          <input
            type="date"
            value={claveFecha(tarea.fechaLimite)}
            onChange={e => actualizarTarea(planId, tarea._id, { fechaLimite: e.target.value }).catch(() => {})}
            aria-label={`Fecha límite de ${tarea.titulo}`}
            className={`w-auto bg-transparent text-xs outline-none [&::-webkit-calendar-picker-indicator]:invert-[0.6]
              ${tarea.fechaLimite ? '' : 'w-5 opacity-0 group-hover:opacity-100 focus:w-auto focus:opacity-100'}`}
          />
          {/* El input ya muestra la fecha; el texto sólo se añade cuando hay urgencia */}
          {aviso?.urgente && <span className={`text-xs font-semibold ${aviso.clase}`}>{aviso.texto}</span>}
        </div>
      </div>

      <button
        onClick={() => eliminarTarea(planId, tarea._id).catch(() => {})}
        aria-label={`Eliminar tarea "${tarea.titulo}"`}
        className="text-subtle opacity-0 transition-all group-hover:opacity-100 hover:text-danger focus-visible:opacity-100"
      >
        <FontAwesomeIcon icon={faTrash} className="text-xs" />
      </button>
    </motion.li>
  )
}

const ListaTareas = ({ plan }) => {
  const { agregarTarea } = usePlanes()
  const [titulo, setTitulo] = useState('')
  const [fecha, setFecha] = useState('')
  const [enviando, setEnviando] = useState(false)
  const inputRef = useRef(null)
  const { hechas, total, porcentaje } = progreso(plan)

  // Las pendientes arriba y las completadas al final. sort() es estable, así que dentro de
  // cada grupo se conserva el orden en que se crearon.
  const ordenadas = useMemo(
    () => [...plan.tareas].sort((a, b) => Number(a.completada) - Number(b.completada)),
    [plan.tareas]
  )

  const agregar = async e => {
    e.preventDefault()
    if (!titulo.trim()) return
    setEnviando(true)
    try {
      await agregarTarea(plan._id, { titulo: titulo.trim(), fechaLimite: fecha || undefined })
      setTitulo('')
      setFecha('')
    } catch {
      // El provider ya mostró el error; se conserva lo escrito para reintentar
    } finally {
      setEnviando(false)
      // El foco vuelve al input para encadenar varias tareas seguidas sólo con el teclado
      inputRef.current?.focus()
    }
  }

  return (
    <section className="glass flex flex-col rounded-2xl p-6" aria-labelledby="titulo-tareas">
      <div className="mb-4 flex items-center justify-between">
        <h2 id="titulo-tareas" className="flex items-center gap-2 font-bold text-fg">
          <FontAwesomeIcon icon={faListCheck} className="text-neon" /> Tareas
        </h2>
        <span className="font-mono text-xs text-subtle">{hechas}/{total}</span>
      </div>

      <div className="mb-5 h-2 overflow-hidden rounded-full bg-white/5" role="progressbar" aria-valuenow={porcentaje} aria-valuemin={0} aria-valuemax={100} aria-label="Progreso de tareas">
        <motion.div
          className="h-full rounded-full bg-linear-to-r from-neon-amber via-neon to-neon-pink shadow-[0_0_12px_var(--color-neon)]"
          initial={false}
          animate={{ width: `${porcentaje}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>

      <form onSubmit={agregar} className="mb-3 flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
            placeholder="Nueva tarea… (Enter para añadir)"
            aria-label="Nueva tarea"
            maxLength={200}
            className="field py-2 text-sm"
          />
          <button type="submit" disabled={enviando || !titulo.trim()} aria-label="Añadir tarea" className="btn btn-primary btn-icon shrink-0">
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
        <label className="flex items-center gap-2 text-xs text-subtle">
          Fecha límite (opcional)
          <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className="field w-auto px-2 py-1 text-xs" />
        </label>
      </form>

      {total === 0 ? (
        <p className="py-8 text-center text-sm text-subtle">
          Divide el plan en pasos pequeños.<br />Cada tarea completada suma al progreso.
        </p>
      ) : (
        <ul className="-mx-2 flex flex-col">
          <AnimatePresence initial={false}>
            {ordenadas.map(tarea => <Tarea key={tarea._id} planId={plan._id} tarea={tarea} />)}
          </AnimatePresence>
        </ul>
      )}
    </section>
  )
}

export default ListaTareas
