import { useMemo, useState } from "react"
import { Reorder, useDragControls } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowDown, faArrowUp, faGripVertical, faStar, faXmark } from "@fortawesome/free-solid-svg-icons"
import useProyectos from "../hooks/useProyectos"
import { imagenOptimizada } from "../helpers/proyectos"

// Una fila arrastrable. useDragControls limita el arrastre al asa (⋮⋮): sin esto, cualquier
// click en la fila iniciaría un arrastre y los botones de dentro serían difíciles de pulsar.
const FilaDestacado = ({ proyecto, indice, total, onMover, onQuitar, onSoltar }) => {
  const controles = useDragControls()
  return (
    <Reorder.Item
      value={proyecto}
      dragListener={false}
      dragControls={controles}
      onDragEnd={onSoltar}
      className="flex items-center gap-3 rounded-xl border border-white/5 bg-ink-800 p-2 pr-3"
      whileDrag={{ scale: 1.02, boxShadow: '0 0 30px -8px var(--color-neon)' }}
    >
      <button type="button" onPointerDown={e => controles.start(e)} aria-hidden tabIndex={-1}
        className="cursor-grab touch-none px-1 text-subtle active:cursor-grabbing">
        <FontAwesomeIcon icon={faGripVertical} />
      </button>
      <span className="w-5 text-center font-mono text-xs text-neon">{indice + 1}</span>
      <img src={imagenOptimizada(proyecto.imagen?.secure_url, 120)} alt="" className="h-9 w-14 rounded-md object-cover object-top" />
      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-fg">{proyecto.nombre}</span>
      {/* Los botones ↑↓ son la alternativa al arrastre para teclado y lectores de pantalla */}
      <button onClick={() => onMover(indice, -1)} disabled={indice === 0} aria-label={`Subir ${proyecto.nombre}`}
        className="btn btn-subtle btn-icon btn-sm disabled:opacity-20"><FontAwesomeIcon icon={faArrowUp} /></button>
      <button onClick={() => onMover(indice, 1)} disabled={indice === total - 1} aria-label={`Bajar ${proyecto.nombre}`}
        className="btn btn-subtle btn-icon btn-sm disabled:opacity-20"><FontAwesomeIcon icon={faArrowDown} /></button>
      <button onClick={() => onQuitar(proyecto._id)} aria-label={`Quitar ${proyecto.nombre} de destacados`}
        className="btn btn-subtle btn-icon btn-sm hover:text-danger"><FontAwesomeIcon icon={faXmark} /></button>
    </Reorder.Item>
  )
}

// Lista ordenable de los proyectos destacados: el orden de aquí es el orden en la home.
const PanelDestacados = () => {
  const { proyectos, ordenarDestacados, destacarProyecto } = useProyectos()
  const destacados = useMemo(
    () => proyectos.filter(p => p.destacado).sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0)),
    [proyectos]
  )

  // Mientras se arrastra, el orden vive en estado local (Reorder lo actualiza en cada
  // movimiento) y sólo se guarda en el servidor al soltar. Cuando la lista del contexto cambia
  // (se destaca o quita un proyecto, o llega el orden guardado) se resincroniza aquí mismo
  // durante el render, el patrón que recomienda React en lugar de un useEffect.
  const [orden, setOrden] = useState(destacados)
  const [previos, setPrevios] = useState(destacados)
  if (destacados !== previos) {
    setPrevios(destacados)
    setOrden(destacados)
  }

  const guardar = lista => ordenarDestacados(lista.map(p => p._id))

  const mover = (indice, paso) => {
    const nueva = [...orden]
    const [item] = nueva.splice(indice, 1)
    nueva.splice(indice + paso, 0, item)
    setOrden(nueva)
    guardar(nueva)
  }

  return (
    <section aria-labelledby="titulo-destacados" className="glass mb-8 rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 id="titulo-destacados" className="flex items-center gap-2 font-bold text-fg">
            <FontAwesomeIcon icon={faStar} className="text-neon-amber" /> Destacados en la home
          </h2>
          <p className="text-sm text-subtle">Arrastra para cambiar el orden. Se muestran primero en tu portafolio.</p>
        </div>
        <span className="font-mono text-xs text-subtle">{destacados.length}</span>
      </div>

      {orden.length ? (
        <Reorder.Group axis="y" values={orden} onReorder={setOrden} className="flex flex-col gap-2">
          {orden.map((proyecto, i) => (
            <FilaDestacado
              key={proyecto._id}
              proyecto={proyecto}
              indice={i}
              total={orden.length}
              onMover={mover}
              onQuitar={id => destacarProyecto(id, false)}
              onSoltar={() => guardar(orden)}
            />
          ))}
        </Reorder.Group>
      ) : (
        <p className="rounded-xl border border-dashed border-white/10 p-5 text-center text-sm text-subtle">
          Marca proyectos con la <FontAwesomeIcon icon={faStar} className="text-neon-amber" /> del listado para destacarlos.
          Sin destacados, la home muestra los más recientes.
        </p>
      )}
    </section>
  )
}

export default PanelDestacados
