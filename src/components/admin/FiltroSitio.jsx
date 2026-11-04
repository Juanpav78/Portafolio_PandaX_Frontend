import { useSearchParams } from "react-router"
import { SITIOS } from "../../helpers/sitios"
import useSitioFiltro from "../../hooks/useSitioFiltro"

// Filtros rápidos "Todos | PandaX Code | Portafolio" de cada listado. El valor vive en la URL
// (?sitio=) para que los accesos directos de la barra lateral lleguen ya filtrados.
// `conteos` es opcional: { total, code, portafolio }.
const FiltroSitio = ({ conteos }) => {
  const [, setParams] = useSearchParams()
  const sitio = useSitioFiltro()

  const elegir = valor => setParams(previos => {
    const nuevos = new URLSearchParams(previos)
    if (valor) nuevos.set('sitio', valor)
    else nuevos.delete('sitio')
    return nuevos
  }, { replace: true })

  const opciones = [{ valor: '', nombre: 'Todos' }, ...SITIOS]
  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="group" aria-label="Filtrar por sitio">
      {opciones.map(({ valor, nombre }) => (
        <button key={valor || 'todos'} type="button" className="chip-filtro" aria-pressed={sitio === valor} onClick={() => elegir(valor)}>
          {valor ? <span className="badge-sitio" data-sitio={valor}>{nombre}</span> : nombre}
          {conteos && <span className="text-xs text-subtle">{conteos[valor || 'total'] ?? 0}</span>}
        </button>
      ))}
    </div>
  )
}

export default FiltroSitio
