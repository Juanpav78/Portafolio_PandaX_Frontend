import { useDeferredValue, useMemo } from "react"
import { useSearchParams } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons"
import useProyectos from "../hooks/useProyectos"
import GaleriaProyectos from "../components/GaleriaProyectos"
import SectionTitle from "../components/SectionTitle"
import Boton from "../components/Boton"
import ConNegritas from "../components/ConNegritas"
import useIdioma from "../hooks/useIdioma"
import { contarTecnologias, contarTipos, filtrarProyectos, ORDENES, ordenarProyectos } from "../helpers/proyectos"

const Portafolio = () => {
  const { proyectos } = useProyectos()
  const { t } = useIdioma()
  // Los filtros viven en la URL (?q=&tipo=&tech=&orden=): se pueden compartir, sobreviven a
  // recargar la página y el botón "atrás" del navegador los restaura.
  const [params, setParams] = useSearchParams()
  const busqueda = params.get('q') ?? ''
  const tipo = params.get('tipo') ?? ''
  const tecnologia = params.get('tech') ?? ''
  // Por defecto, destacados primero: es el orden que el admin eligió para presentar su trabajo
  const orden = params.get('orden') ?? 'destacados'

  // useDeferredValue mantiene el input fluido al teclear: React pinta primero la letra y
  // recalcula la rejilla (con sus animaciones de layout) cuando tiene tiempo libre.
  const busquedaDiferida = useDeferredValue(busqueda)

  const tipos = useMemo(() => contarTipos(proyectos), [proyectos])
  const tecnologias = useMemo(() => contarTecnologias(proyectos), [proyectos])
  const resultado = useMemo(
    () => ordenarProyectos(filtrarProyectos(proyectos, { busqueda: busquedaDiferida, tipo, tecnologia }), orden),
    [proyectos, busquedaDiferida, tipo, tecnologia, orden]
  )

  // replace: escribir en el buscador no debe llenar el historial con una entrada por letra
  const actualizar = (clave, valor) => {
    setParams(previos => {
      const nuevos = new URLSearchParams(previos)
      if (valor) nuevos.set(clave, valor)
      else nuevos.delete(clave)
      return nuevos
    }, { replace: true })
  }

  const hayFiltros = busqueda || tipo || tecnologia

  return (
    <main className='px-4 pt-32 pb-24 sm:px-6'>
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          as="h1"
          etiqueta={t('portfolio.label')}
          titulo={t('portfolio.title')}
          destacado={t('portfolio.highlight')}
          descripcion={t('portfolio.description')}
        />

        <div className="glass sticky top-24 z-30 mb-10 flex flex-col gap-4 rounded-2xl p-4">
          <div className="flex flex-col gap-3 md:flex-row">
            <label className="relative flex-1">
              <span className="sr-only">{t('portfolio.searchLabel')}</span>
              <FontAwesomeIcon icon={faMagnifyingGlass} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-subtle" />
              <input
                type="search"
                value={busqueda}
                onChange={e => actualizar('q', e.target.value)}
                placeholder={t('portfolio.search')}
                className="field pl-11"
              />
            </label>
            <div className="grid grid-cols-2 gap-3 md:flex">
              <select aria-label={t('portfolio.techLabel')} value={tecnologia} onChange={e => actualizar('tech', e.target.value)} className="field md:w-48">
                <option value="">{t('portfolio.allTech')}</option>
                {tecnologias.map(t => <option key={t.valor} value={t.valor}>{t.valor} ({t.total})</option>)}
              </select>
              <select aria-label={t('portfolio.sortLabel')} value={orden} onChange={e => actualizar('orden', e.target.value === 'destacados' ? '' : e.target.value)} className="field md:w-48">
                {ORDENES.map(valor => <option key={valor} value={valor}>{t(`portfolio.sort.${valor}`)}</option>)}
              </select>
            </div>
          </div>

          {tipos.length > 1 && (
            // Scroll horizontal en móvil en lugar de varias filas de chips que empujarían la rejilla
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="group" aria-label={t('portfolio.typeLabel')}>
              <button className="chip-filtro" aria-pressed={!tipo} onClick={() => actualizar('tipo', '')}>
                {t('portfolio.all')} <span className="opacity-60">{proyectos.length}</span>
              </button>
              {tipos.map(t => (
                <button key={t.valor} className="chip-filtro capitalize" aria-pressed={tipo === t.valor}
                  onClick={() => actualizar('tipo', tipo === t.valor ? '' : t.valor)}>
                  {t.valor} <span className="opacity-60">{t.total}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mb-6 flex items-center justify-between text-sm text-muted" aria-live="polite">
          <p><ConNegritas texto={t('portfolio.showing', { a: resultado.length, b: proyectos.length })} /></p>
          {hayFiltros && (
            <button onClick={() => setParams({}, { replace: true })} className="inline-flex items-center gap-2 font-semibold text-neon-soft hover:text-neon">
              <FontAwesomeIcon icon={faXmark} /> {t('portfolio.clear')}
            </button>
          )}
        </div>

        <GaleriaProyectos
          proyectos={resultado}
          skeletons={9}
          vacio={
            <div className="glass mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl p-10 text-center">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-3xl text-subtle" />
              <p className="text-lg font-semibold text-fg">{t('portfolio.emptyTitle')}</p>
              <p className="text-muted">{t('portfolio.emptyText')}</p>
              <Boton variant="ghost" onClick={() => setParams({}, { replace: true })}>{t('portfolio.clear')}</Boton>
            </div>
          }
        />
      </div>
    </main>
  )
}

export default Portafolio
