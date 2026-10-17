import { useMemo, useState } from "react"
import { Link } from "react-router"
import { AnimatePresence, motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronLeft, faChevronRight, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"
import usePlanes from "../hooks/usePlanes"
import useProyectos from "../hooks/useProyectos"
import { TIPOS_EVENTO, claveHoy, claveLocal, construirEventos, diasDelMes, diasHasta, formatearDia } from "../helpers/planes"

const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const MAX_EN_CELDA = 2

const Evento = ({ evento, compacto = false }) => {
  const tipo = TIPOS_EVENTO[evento.tipo]
  if (compacto) {
    return (
      <span className={`flex items-center gap-1 truncate rounded-md border px-1.5 py-0.5 text-[0.68rem] font-semibold ${tipo.clase} ${evento.completado ? 'opacity-50' : ''}`}>
        <FontAwesomeIcon icon={tipo.icono} className="shrink-0 text-[0.6rem]" />
        <span className="truncate">{evento.titulo}</span>
      </span>
    )
  }
  return (
    <Link to={evento.ruta} className="flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-white/5">
      <span className={`grid size-8 shrink-0 place-items-center rounded-lg border text-xs ${tipo.clase}`}>
        <FontAwesomeIcon icon={tipo.icono} />
      </span>
      <div className="min-w-0">
        <p className={`truncate text-sm font-semibold ${evento.completado && evento.tipo !== 'publicado' ? 'text-subtle line-through' : 'text-fg'}`}>{evento.titulo}</p>
        <p className="truncate text-xs text-subtle">{tipo.nombre} · {evento.detalle}</p>
      </div>
    </Link>
  )
}

const Calendario = () => {
  const { planes } = usePlanes()
  const { proyectos } = useProyectos()
  const hoy = claveHoy()
  const [mes, setMes] = useState(() => {
    const ahora = new Date()
    return new Date(ahora.getFullYear(), ahora.getMonth(), 1)
  })
  const [seleccionado, setSeleccionado] = useState(hoy)
  // Tipos de evento visibles; la leyenda funciona como filtro
  const [ocultos, setOcultos] = useState(() => new Set())
  // Dirección de la última navegación, para que el mes entre deslizándose desde el lado correcto
  const [direccion, setDireccion] = useState(1)

  const todos = useMemo(() => construirEventos(planes, proyectos), [planes, proyectos])
  const eventosDe = clave => (todos.get(clave) ?? []).filter(e => !ocultos.has(e.tipo))
  const celdas = useMemo(() => diasDelMes(mes), [mes])

  // Lo que ya pasó y sigue sin hacerse: tareas y entregas de planes no completados.
  // Es lo más urgente, por eso se muestra aparte aunque su día no esté en el mes visible.
  const atrasados = useMemo(() => [...todos.values()].flat()
    .filter(e => !e.completado && e.tipo !== 'inicio' && diasHasta(e.clave) < 0)
    .sort((a, b) => a.clave.localeCompare(b.clave)), [todos])

  const proximos = useMemo(() => [...todos.values()].flat()
    .filter(e => !e.completado && diasHasta(e.clave) >= 0 && diasHasta(e.clave) <= 14)
    .sort((a, b) => a.clave.localeCompare(b.clave)), [todos])

  const cambiarMes = paso => {
    setDireccion(paso)
    setMes(actual => new Date(actual.getFullYear(), actual.getMonth() + paso, 1))
  }
  const irAHoy = () => {
    const ahora = new Date()
    setDireccion(0)
    setMes(new Date(ahora.getFullYear(), ahora.getMonth(), 1))
    setSeleccionado(hoy)
  }

  const alternarTipo = tipo => setOcultos(actuales => {
    const nuevos = new Set(actuales)
    if (nuevos.has(tipo)) nuevos.delete(tipo)
    else nuevos.add(tipo)
    return nuevos
  })

  const tituloMes = mes.toLocaleDateString('es', { month: 'long', year: 'numeric' })
  const eventosDia = eventosDe(seleccionado)

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-sm text-neon">{'// calendario'}</p>
          <h1 className="mt-1 font-display text-4xl text-fg first-letter:uppercase">{tituloMes}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={irAHoy} className="btn btn-ghost btn-sm">Hoy</button>
          <button onClick={() => cambiarMes(-1)} aria-label="Mes anterior" className="btn btn-ghost btn-icon"><FontAwesomeIcon icon={faChevronLeft} /></button>
          <button onClick={() => cambiarMes(1)} aria-label="Mes siguiente" className="btn btn-ghost btn-icon"><FontAwesomeIcon icon={faChevronRight} /></button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Tipos de evento">
        {Object.entries(TIPOS_EVENTO).map(([id, tipo]) => (
          <button key={id} onClick={() => alternarTipo(id)} aria-pressed={!ocultos.has(id)}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-opacity
              ${tipo.clase} ${ocultos.has(id) ? 'opacity-35' : ''}`}>
            <FontAwesomeIcon icon={tipo.icono} /> {tipo.nombre}
          </button>
        ))}
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="glass overflow-hidden rounded-2xl">
          <div className="grid grid-cols-7 border-b border-white/5">
            {DIAS_SEMANA.map(dia => (
              <span key={dia} className="py-3 text-center font-mono text-xs tracking-wider text-subtle uppercase">{dia}</span>
            ))}
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={mes.toISOString()}
              initial={{ opacity: 0, x: direccion * 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direccion * -30 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-7"
            >
              {celdas.map(dia => {
                const clave = claveLocal(dia)
                const eventos = eventosDe(clave)
                const fueraDeMes = dia.getMonth() !== mes.getMonth()
                const esHoy = clave === hoy
                const activo = clave === seleccionado
                return (
                  <button
                    key={clave}
                    onClick={() => setSeleccionado(clave)}
                    aria-pressed={activo}
                    aria-label={`${dia.toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })}, ${eventos.length} eventos`}
                    className={`flex min-h-16 flex-col gap-1 border-r border-b border-white/5 p-1.5 text-left transition-colors sm:min-h-28 sm:p-2
                      ${activo ? 'bg-neon/10 shadow-[inset_0_0_0_1px_var(--color-neon)]' : 'hover:bg-white/3'}
                      ${fueraDeMes ? 'opacity-35' : ''}`}
                  >
                    <span className={`grid size-7 place-items-center rounded-full text-sm font-semibold
                      ${esHoy ? 'bg-neon text-ink-950 shadow-[0_0_14px_var(--color-neon)]' : 'text-fg'}`}>
                      {dia.getDate()}
                    </span>
                    {/* En móvil no caben títulos: se muestran puntos de color por evento */}
                    <span className="flex flex-wrap gap-0.5 sm:hidden">
                      {eventos.slice(0, 4).map(e => <span key={e.id + e.tipo} className={`size-1.5 rounded-full ${TIPOS_EVENTO[e.tipo].punto}`} />)}
                    </span>
                    <span className="hidden flex-col gap-1 sm:flex">
                      {eventos.slice(0, MAX_EN_CELDA).map(e => <Evento key={e.id + e.tipo} evento={e} compacto />)}
                      {eventos.length > MAX_EN_CELDA && <span className="px-1 text-[0.68rem] text-subtle">+{eventos.length - MAX_EN_CELDA} más</span>}
                    </span>
                  </button>
                )
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        <aside className="flex flex-col gap-4">
          <section className="glass rounded-2xl p-4" aria-live="polite">
            <h2 className="mb-2 px-1 font-bold text-fg first-letter:uppercase">
              {formatearDia(seleccionado, { weekday: 'long', day: 'numeric', month: 'long' })}
            </h2>
            {eventosDia.length
              ? eventosDia.map(e => <Evento key={e.id + e.tipo} evento={e} />)
              : <p className="px-1 py-4 text-sm text-subtle">Nada programado este día.</p>}
          </section>

          {atrasados.length > 0 && (
            <section className="glass rounded-2xl border-danger/30 p-4">
              <h2 className="mb-2 flex items-center gap-2 px-1 font-bold text-danger">
                <FontAwesomeIcon icon={faTriangleExclamation} /> Atrasado ({atrasados.length})
              </h2>
              {atrasados.slice(0, 6).map(e => <Evento key={e.id + e.tipo} evento={e} />)}
            </section>
          )}

          <section className="glass rounded-2xl p-4">
            <h2 className="mb-2 px-1 font-bold text-fg">Próximos 14 días</h2>
            {proximos.length
              ? proximos.map(e => (
                <div key={e.id + e.tipo}>
                  <p className="px-1 pt-2 font-mono text-[0.68rem] tracking-wider text-subtle uppercase">{formatearDia(e.clave, { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                  <Evento evento={e} />
                </div>
              ))
              : <p className="px-1 py-4 text-sm text-subtle">Sin entregas próximas.</p>}
          </section>
        </aside>
      </div>
    </>
  )
}

export default Calendario
