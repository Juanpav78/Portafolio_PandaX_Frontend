import { useCallback, useDeferredValue, useMemo, useState } from "react"
import { useSearchParams } from "react-router"
import { AnimatePresence, motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faClock, faCode, faFolderOpen, faGrip, faLayerGroup, faList, faMagnifyingGlass, faPlus, faTags, faXmark,
} from "@fortawesome/free-solid-svg-icons"
import useProyectos from "../hooks/useProyectos"
import PreviewProyecto from "../components/PreviewProyecto";
import ConfirmDialog from "../components/ConfirmDialog"
import Boton from "../components/Boton"
import PanelDestacados from "../components/PanelDestacados"
import {
  contarTecnologias, contarTipos, filtrarProyectos, formatearFecha, ordenarProyectos,
} from "../helpers/proyectos"

const ORDENES_ADMIN = { recientes: 'Más recientes', antiguos: 'Más antiguos', nombre: 'Nombre (A–Z)' }

const Estadistica = ({ icono, etiqueta, valor, detalle, indice }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: indice * 0.06 }}
    className="glass neon-border rounded-2xl p-5"
  >
    <div className="flex items-center justify-between">
      <p className="text-sm font-semibold text-muted">{etiqueta}</p>
      <span className="grid size-9 place-items-center rounded-lg bg-neon/10 text-neon"><FontAwesomeIcon icon={icono} /></span>
    </div>
    <p className="mt-3 truncate font-display text-2xl text-fg sm:text-3xl">{valor}</p>
    {detalle && <p className="mt-1 truncate text-xs text-subtle">{detalle}</p>}
  </motion.div>
)

const IndexAdmin = () => {
  const { proyectos, cargando, eliminarProyecto } = useProyectos();
  // Igual que en el portafolio público, los filtros viven en la URL: al volver de editar un
  // proyecto con el botón "atrás", el listado conserva la búsqueda y la vista que tenías.
  const [params, setParams] = useSearchParams()
  const busqueda = params.get('q') ?? ''
  const tipo = params.get('tipo') ?? ''
  const orden = params.get('orden') ?? 'recientes'
  const vista = params.get('vista') ?? 'lista'
  const busquedaDiferida = useDeferredValue(busqueda)

  const [aEliminar, setAEliminar] = useState(null)
  const [eliminando, setEliminando] = useState(false)

  const tipos = useMemo(() => contarTipos(proyectos), [proyectos])
  const tecnologias = useMemo(() => contarTecnologias(proyectos), [proyectos])
  const ultimo = useMemo(() => ordenarProyectos(proyectos)[0], [proyectos])
  const resultado = useMemo(
    () => ordenarProyectos(filtrarProyectos(proyectos, { busqueda: busquedaDiferida, tipo }), orden),
    [proyectos, busquedaDiferida, tipo, orden]
  )

  const actualizar = (clave, valor, porDefecto = '') => {
    setParams(previos => {
      const nuevos = new URLSearchParams(previos)
      if (valor && valor !== porDefecto) nuevos.set(clave, valor)
      else nuevos.delete(clave)
      return nuevos
    }, { replace: true })
  }

  // Se conserva la vista elegida al limpiar: es una preferencia, no un filtro
  const limpiar = () => setParams(vista === 'lista' ? {} : { vista }, { replace: true })

  const confirmarEliminar = async () => {
    setEliminando(true)
    try {
      await eliminarProyecto(aEliminar._id)
      setAEliminar(null)
    } catch {
      // El toast con el error ya lo muestra el provider; el diálogo queda abierto para reintentar
    } finally {
      setEliminando(false)
    }
  }
  const cancelarEliminar = useCallback(() => setAEliminar(null), [])

  const hayFiltros = busqueda || tipo
  const cargandoInicial = cargando && !proyectos.length

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-sm text-neon">{'// dashboard'}</p>
          <h1 className='mt-1 font-display text-4xl text-fg'>Proyectos</h1>
          <p className="mt-1 text-muted">Gestiona lo que se muestra en tu portafolio.</p>
        </div>
      </div>

      <section aria-label="Resumen" className="mb-8 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {cargandoInicial
          ? Array.from({ length: 4 }, (_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />)
          : <>
            <Estadistica indice={0} icono={faLayerGroup} etiqueta="Proyectos" valor={proyectos.length} detalle="publicados en el portafolio" />
            <Estadistica indice={1} icono={faTags} etiqueta="Tipos" valor={tipos.length}
              detalle={tipos.slice(0, 3).map(t => t.valor).join(' · ')} />
            <Estadistica indice={2} icono={faCode} etiqueta="Tecnologías" valor={tecnologias.length}
              detalle={tecnologias[0] && `Más usada: ${tecnologias[0].valor} (${tecnologias[0].total})`} />
            <Estadistica indice={3} icono={faClock} etiqueta="Último proyecto" valor={ultimo?.nombre ?? '—'}
              detalle={ultimo && formatearFecha(ultimo, 'es')} />
          </>}
      </section>

      {!cargandoInicial && proyectos.length > 0 && <PanelDestacados />}

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="group" aria-label="Filtrar por tipo">
          <button className="chip-filtro" aria-pressed={!tipo} onClick={() => actualizar('tipo', '')}>
            Todos <span className="opacity-60">{proyectos.length}</span>
          </button>
          {tipos.map(t => (
            <button key={t.valor} className="chip-filtro capitalize" aria-pressed={tipo === t.valor}
              onClick={() => actualizar('tipo', tipo === t.valor ? '' : t.valor)}>
              {t.valor} <span className="opacity-60">{t.total}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select aria-label="Ordenar" value={orden} onChange={e => actualizar('orden', e.target.value, 'recientes')} className="field w-auto py-2 text-sm">
            {Object.entries(ORDENES_ADMIN).map(([valor, texto]) => <option key={valor} value={valor}>{texto}</option>)}
          </select>
          <div className="flex rounded-xl border border-white/10 p-1" role="group" aria-label="Vista">
            {[['lista', faList, 'Lista'], ['grid', faGrip, 'Cuadrícula']].map(([valor, icono, texto]) => (
              <button key={valor} onClick={() => actualizar('vista', valor, 'lista')} aria-pressed={vista === valor} title={texto}
                className={`grid size-8 place-items-center rounded-lg text-sm transition-colors
                  ${vista === valor ? 'bg-neon/15 text-neon' : 'text-subtle hover:text-fg'}`}>
                <FontAwesomeIcon icon={icono} /><span className="sr-only">{texto}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-3 flex min-h-6 items-center justify-between text-sm text-muted" aria-live="polite">
        {!cargandoInicial && (
          <p>{hayFiltros ? <>{resultado.length} de {proyectos.length} proyectos{busqueda && <> para «<span className="text-fg">{busqueda}</span>»</>}</> : `${proyectos.length} proyectos`}</p>
        )}
        {hayFiltros && (
          <button onClick={limpiar} className="inline-flex items-center gap-2 font-semibold text-neon-soft hover:text-neon">
            <FontAwesomeIcon icon={faXmark} /> Limpiar filtros
          </button>
        )}
      </div>

      {cargandoInicial && (
        <div className="glass divide-y divide-white/5 overflow-hidden rounded-2xl">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="flex items-center gap-4 p-4">
              <div className="skeleton h-12 w-18 rounded-lg" />
              <div className="flex-1 space-y-2"><div className="skeleton h-4 w-1/3 rounded" /><div className="skeleton h-3 w-1/5 rounded" /></div>
            </div>
          ))}
        </div>
      )}

      {!cargandoInicial && !proyectos.length && (
        <div className="glass flex flex-col items-center gap-4 rounded-2xl p-12 text-center">
          <span className="grid size-16 place-items-center rounded-2xl bg-neon/10 text-2xl text-neon"><FontAwesomeIcon icon={faFolderOpen} /></span>
          <h2 className="text-xl font-bold text-fg">Aún no hay proyectos</h2>
          <p className="max-w-sm text-muted">Crea tu primer proyecto y aparecerá automáticamente en el portafolio.</p>
          <Boton to="/admin/create" icon={faPlus}>Crear proyecto</Boton>
        </div>
      )}

      {!cargandoInicial && proyectos.length > 0 && !resultado.length && (
        <div className="glass flex flex-col items-center gap-3 rounded-2xl p-12 text-center">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="text-3xl text-subtle" />
          <h2 className="text-lg font-bold text-fg">Sin resultados</h2>
          <p className="text-muted">Ningún proyecto coincide con los filtros actuales.</p>
          <Boton variant="ghost" onClick={limpiar}>Limpiar filtros</Boton>
        </div>
      )}

      {resultado.length > 0 && (vista === 'grid' ? (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {resultado.map(proyecto => (
              <PreviewProyecto key={proyecto._id} proyecto={proyecto} vista="grid" busqueda={busquedaDiferida} onEliminar={setAEliminar} />
            ))}
          </AnimatePresence>
        </ul>
      ) : (
        <div className="glass overflow-hidden rounded-2xl">
          <div className="hidden grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)_minmax(0,1.6fr)_7rem_auto] gap-4 border-b border-white/5 px-4 py-3
            font-mono text-xs tracking-wider text-subtle uppercase md:grid">
            <span>Proyecto</span><span>Tipo</span><span>Tecnologías</span><span>Fecha</span><span className="w-30 text-right">Acciones</span>
          </div>
          <ul className="divide-y divide-white/5">
            <AnimatePresence mode="popLayout">
              {resultado.map(proyecto => (
                <PreviewProyecto key={proyecto._id} proyecto={proyecto} busqueda={busquedaDiferida} onEliminar={setAEliminar} />
              ))}
            </AnimatePresence>
          </ul>
        </div>
      ))}

      <ConfirmDialog
        abierto={Boolean(aEliminar)}
        titulo="¿Eliminar proyecto?"
        mensaje={<>Se eliminará <strong className="text-fg">{aEliminar?.nombre}</strong> y su imagen. Esta acción no se puede deshacer.</>}
        cargando={eliminando}
        onConfirmar={confirmarEliminar}
        onCancelar={cancelarEliminar}
      />
    </>
  )
}

export default IndexAdmin
