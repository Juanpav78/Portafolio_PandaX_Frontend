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
import FiltroSitio from "../components/admin/FiltroSitio"
import EncabezadoPagina from "../components/admin/EncabezadoPagina"
import useSitioFiltro from "../hooks/useSitioFiltro"
import { nombreSitio, sitiosDe } from "../helpers/sitios"
import {
  contarTecnologias, contarTipos, filtrarProyectos, formatearFecha, ordenarProyectos,
} from "../helpers/proyectos"

const ORDENES_ADMIN = { recientes: 'Más recientes', antiguos: 'Más antiguos', nombre: 'Nombre (A–Z)' }

const Estadistica = ({ icono, etiqueta, valor, detalle, indice }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: indice * 0.06 }}
    className="tarjeta p-5"
  >
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-muted">{etiqueta}</p>
      <FontAwesomeIcon icon={icono} className="text-subtle" />
    </div>
    <p className="mt-3 truncate text-2xl font-semibold tracking-tight text-fg">{valor}</p>
    {detalle && <p className="mt-1 truncate text-xs text-subtle">{detalle}</p>}
  </motion.div>
)

const IndexAdmin = () => {
  const { proyectos: todos, cargando, eliminarProyecto } = useProyectos();
  // Filtro rápido por sitio (?sitio=). Todo lo de abajo (métricas, tipos, búsqueda) trabaja
  // sobre los proyectos del sitio elegido, para que el listado sea coherente con el filtro.
  const sitio = useSitioFiltro()
  const proyectos = useMemo(() => sitio ? todos.filter(p => sitiosDe(p).includes(sitio)) : todos, [todos, sitio])
  const conteos = useMemo(() => ({
    total: todos.length,
    code: todos.filter(p => sitiosDe(p).includes('code')).length,
    portafolio: todos.filter(p => sitiosDe(p).includes('portafolio')).length,
  }), [todos])
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

  // Se conservan la vista y el sitio al limpiar: la vista es una preferencia y el sitio la
  // sección en la que estás (se cambia con sus propios filtros)
  const limpiar = () => setParams({ ...(vista !== 'lista' && { vista }), ...(sitio && { sitio }) }, { replace: true })

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
      <EncabezadoPagina
        titulo={sitio ? `Proyectos · ${nombreSitio(sitio)}` : 'Proyectos'}
        descripcion="Contenido compartido: cada proyecto indica en qué webs aparece y si está publicado."
      />

      <div className="mb-6"><FiltroSitio conteos={conteos} /></div>

      <section aria-label="Resumen" className="mb-8 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {cargandoInicial
          ? Array.from({ length: 4 }, (_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />)
          : <>
            <Estadistica indice={0} icono={faLayerGroup} etiqueta="Proyectos" valor={proyectos.length}
              detalle={`${proyectos.filter(p => p.publicado !== false).length} publicados · ${proyectos.filter(p => p.publicado === false).length} ocultos`} />
            <Estadistica indice={1} icono={faTags} etiqueta="Tipos" valor={tipos.length}
              detalle={tipos.slice(0, 3).map(t => t.valor).join(' · ')} />
            <Estadistica indice={2} icono={faCode} etiqueta="Tecnologías" valor={tecnologias.length}
              detalle={tecnologias[0] && `Más usada: ${tecnologias[0].valor} (${tecnologias[0].total})`} />
            <Estadistica indice={3} icono={faClock} etiqueta="Último proyecto" valor={ultimo?.nombre ?? '—'}
              detalle={ultimo && formatearFecha(ultimo, 'es')} />
          </>}
      </section>

      {/* Los destacados ordenan la home del portafolio: sólo tienen sentido sin filtro o en Portafolio */}
      {!cargandoInicial && proyectos.length > 0 && sitio !== 'code' && <PanelDestacados />}

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
          <div className="flex rounded-lg border border-ink-600 bg-ink-800 p-1" role="group" aria-label="Vista">
            {[['lista', faList, 'Lista'], ['grid', faGrip, 'Cuadrícula']].map(([valor, icono, texto]) => (
              <button key={valor} onClick={() => actualizar('vista', valor, 'lista')} aria-pressed={vista === valor} title={texto}
                className={`grid size-8 place-items-center rounded-lg text-sm transition-colors
                  ${vista === valor ? 'bg-ink-700 text-fg' : 'text-subtle hover:text-fg'}`}>
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
          <button onClick={limpiar} className="inline-flex items-center gap-2 font-medium text-neon hover:underline">
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
        <div className="tarjeta flex flex-col items-center gap-3 p-12 text-center">
          <span className="grid size-12 place-items-center rounded-xl bg-ink-700 text-xl text-subtle"><FontAwesomeIcon icon={faFolderOpen} /></span>
          <h2 className="text-base font-semibold text-fg">{sitio ? `Aún no hay proyectos en ${nombreSitio(sitio)}` : 'Aún no hay proyectos'}</h2>
          <p className="max-w-sm text-sm text-muted">Crea un proyecto y elige en qué webs aparece.</p>
          <Boton to="/admin/create" icon={faPlus}>Crear proyecto</Boton>
        </div>
      )}

      {!cargandoInicial && proyectos.length > 0 && !resultado.length && (
        <div className="tarjeta flex flex-col items-center gap-3 p-12 text-center">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="text-2xl text-subtle" />
          <h2 className="text-base font-semibold text-fg">Sin resultados</h2>
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
        <div className="tarjeta overflow-hidden">
          <div className="hidden grid-cols-[minmax(0,2.2fr)_minmax(0,1.2fr)_minmax(0,1.4fr)_7.5rem_auto] gap-4 border-b border-ink-600 px-4 py-2.5
            text-[0.72rem] font-semibold tracking-wide text-subtle uppercase md:grid">
            <span>Proyecto</span><span>Sitios</span><span>Tecnologías</span><span>Estado</span><span className="w-30 text-right">Acciones</span>
          </div>
          <ul className="divide-y divide-ink-600">
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
