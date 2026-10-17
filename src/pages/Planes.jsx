import { useCallback, useMemo, useState } from "react"
import { Link } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBolt, faCalendarDays, faCircleCheck, faFire, faListCheck, faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons"
import usePlanes from "../hooks/usePlanes"
import PlanCard from "../components/PlanCard"
import Boton from "../components/Boton"
import { ESTADOS, PRIORIDADES, claveFecha, diasHasta } from "../helpers/planes"
import { normalizar } from "../helpers/proyectos"

// Dentro de cada columna: primero lo más prioritario y, a igual prioridad, lo que vence antes.
// Los planes sin fecha van al final de su grupo.
const ordenarColumna = (a, b) =>
  PRIORIDADES[a.prioridad].orden - PRIORIDADES[b.prioridad].orden ||
  (claveFecha(a.fechaLimite) || '9999').localeCompare(claveFecha(b.fechaLimite) || '9999')

const Resumen = ({ icono, valor, etiqueta, clase }) => (
  <div className="glass flex items-center gap-4 rounded-2xl p-4">
    <span className={`grid size-11 place-items-center rounded-xl bg-white/5 ${clase}`}><FontAwesomeIcon icon={icono} /></span>
    <div>
      <p className="font-display text-2xl text-fg">{valor}</p>
      <p className="text-xs text-subtle">{etiqueta}</p>
    </div>
  </div>
)

const Planes = () => {
  const { planes, cargando, actualizarPlan } = usePlanes()
  const [busqueda, setBusqueda] = useState('')
  const [prioridad, setPrioridad] = useState('')
  // id del plan que se está arrastrando y columna sobre la que está, para el resaltado visual
  const [arrastrando, setArrastrando] = useState(null)
  const [sobre, setSobre] = useState(null)

  const columnas = useMemo(() => {
    const termino = normalizar(busqueda)
    const visibles = planes.filter(plan =>
      (!prioridad || plan.prioridad === prioridad) &&
      (!termino || normalizar(`${plan.nombre} ${plan.descripcion} ${plan.tecnologias}`).includes(termino)))
    return ESTADOS.map(estado => ({
      ...estado,
      planes: visibles.filter(p => p.estado === estado.id).sort(ordenarColumna),
    }))
  }, [planes, busqueda, prioridad])

  const resumen = useMemo(() => {
    const activos = planes.filter(p => p.estado !== 'completado')
    const fechas = activos.flatMap(p => [
      p.fechaLimite,
      ...p.tareas.filter(t => !t.completada).map(t => t.fechaLimite),
    ]).filter(Boolean).map(f => diasHasta(claveFecha(f)))
    return {
      enCurso: planes.filter(p => p.estado === 'en-progreso').length,
      pendientes: activos.reduce((total, p) => total + p.tareas.filter(t => !t.completada).length, 0),
      estaSemana: fechas.filter(d => d >= 0 && d <= 7).length,
      vencidos: fechas.filter(d => d < 0).length,
      completados: planes.length - activos.length,
    }
  }, [planes])

  const mover = useCallback((id, estado) => {
    const plan = planes.find(p => p._id === id)
    if (plan && plan.estado !== estado) actualizarPlan(id, { estado }).catch(() => {})
  }, [planes, actualizarPlan])

  const soltar = (e, estado) => {
    e.preventDefault()
    mover(e.dataTransfer.getData('text/plain'), estado)
    setArrastrando(null)
    setSobre(null)
  }

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-sm text-neon">{'// planificador'}</p>
          <h1 className="mt-1 font-display text-4xl text-fg">Próximos proyectos</h1>
          <p className="mt-1 text-muted">Ideas y proyectos futuros, con sus tareas. Arrastra las tarjetas para cambiar su estado.</p>
        </div>
        <Boton to="/admin/calendario" variant="ghost" icon={faCalendarDays}>Ver calendario</Boton>
      </div>

      <section aria-label="Resumen" className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Resumen icono={faBolt} valor={resumen.enCurso} etiqueta="En progreso" clase="text-neon" />
        <Resumen icono={faListCheck} valor={resumen.pendientes} etiqueta="Tareas pendientes" clase="text-neon-amber" />
        <Resumen icono={faFire} valor={resumen.vencidos ? `${resumen.vencidos} ${resumen.vencidos === 1 ? 'vencida' : 'vencidas'}` : resumen.estaSemana}
          etiqueta={resumen.vencidos ? `y ${resumen.estaSemana} esta semana` : 'Vencen esta semana'}
          clase={resumen.vencidos ? 'text-danger' : 'text-neon-cyan'} />
        <Resumen icono={faCircleCheck} valor={resumen.completados} etiqueta="Completados" clase="text-success" />
      </section>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1 sm:max-w-sm">
          <span className="sr-only">Buscar planes</span>
          <FontAwesomeIcon icon={faMagnifyingGlass} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-subtle" />
          <input type="search" value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar planes…" className="field py-2.5 pl-11 text-sm" />
        </label>
        <div className="flex gap-2 overflow-x-auto" role="group" aria-label="Filtrar por prioridad">
          <button className="chip-filtro" aria-pressed={!prioridad} onClick={() => setPrioridad('')}>Todas</button>
          {Object.entries(PRIORIDADES).map(([id, p]) => (
            <button key={id} className="chip-filtro" aria-pressed={prioridad === id} onClick={() => setPrioridad(prioridad === id ? '' : id)}>
              {p.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* En móvil las columnas se desplazan en horizontal con "snap" en vez de apilarse: así el
          tablero se sigue leyendo como un flujo de izquierda a derecha */}
      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
        {columnas.map(columna => (
          <section
            key={columna.id}
            aria-label={columna.nombre}
            onDragOver={e => { e.preventDefault(); setSobre(columna.id) }}
            onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget)) setSobre(null) }}
            onDrop={e => soltar(e, columna.id)}
            className={`flex w-[82vw] max-w-sm shrink-0 snap-start flex-col rounded-2xl border p-3 transition-colors sm:w-80 lg:w-auto lg:max-w-none
              ${sobre === columna.id ? 'border-neon/50 bg-neon/5' : 'border-white/5 bg-ink-900/50'}`}
          >
            <header className="mb-3 flex items-center justify-between px-1">
              <h2 className="flex items-center gap-2 text-sm font-bold text-fg">
                <span className={`size-2 rounded-full ${columna.fondo} shadow-[0_0_10px_currentColor] ${columna.texto}`} />
                {columna.nombre}
                <span className="rounded-full bg-white/5 px-2 font-mono text-xs text-subtle">{columna.planes.length}</span>
              </h2>
              <Link to={`/admin/planes/nuevo?estado=${columna.id}`} aria-label={`Nuevo plan en ${columna.nombre}`}
                className="btn btn-subtle btn-icon text-xs"><FontAwesomeIcon icon={faPlus} /></Link>
            </header>

            <div className="flex min-h-32 flex-1 flex-col gap-3">
              {cargando && <div className="skeleton h-28 rounded-xl" />}
              {columna.planes.map(plan => (
                <PlanCard
                  key={plan._id}
                  plan={plan}
                  arrastrando={arrastrando === plan._id}
                  onArrastrar={setArrastrando}
                  onSoltarFin={() => { setArrastrando(null); setSobre(null) }}
                  onMover={mover}
                />
              ))}
              {!cargando && !columna.planes.length && (
                <p className="grid flex-1 place-items-center rounded-xl border border-dashed border-white/10 p-6 text-center text-xs text-subtle">
                  {arrastrando ? 'Suelta aquí' : 'Sin planes'}
                </p>
              )}
            </div>
          </section>
        ))}
      </div>
    </>
  )
}

export default Planes
