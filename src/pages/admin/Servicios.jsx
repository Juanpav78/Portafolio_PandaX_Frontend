import { useCallback, useMemo, useState } from "react"
import { Link } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPen, faPlus, faTags, faTrash } from "@fortawesome/free-solid-svg-icons"
import useListaAdmin from "../../hooks/useListaAdmin"
import useAccionesAdmin from "../../hooks/useAccionesAdmin"
import useSitioFiltro from "../../hooks/useSitioFiltro"
import Boton from "../../components/Boton"
import ConfirmDialog from "../../components/ConfirmDialog"
import EncabezadoPagina from "../../components/admin/EncabezadoPagina"
import EstadoVacio from "../../components/admin/EstadoVacio"
import FiltroSitio from "../../components/admin/FiltroSitio"
import InterruptorPublicado from "../../components/admin/InterruptorPublicado"
import { BadgesSitios } from "../../components/admin/BadgeSitio"
import { nombreSitio } from "../../helpers/sitios"
import { textoPrecio } from "../../helpers/servicios"

const RUTA = '/admin/services'

const Servicios = () => {
  // Se carga la lista completa y se filtra aquí: son pocos servicios y así los conteos de los
  // filtros "Todos | PandaX Code | Portafolio" salen de la misma petición.
  const { items, cargando, error, recargar, setItems } = useListaAdmin(RUTA)
  const { alternarPublicado, eliminar } = useAccionesAdmin(RUTA, setItems)
  const sitio = useSitioFiltro()
  const [aEliminar, setAEliminar] = useState(null)
  const [eliminando, setEliminando] = useState(false)

  const visibles = useMemo(() => sitio ? items.filter(s => s.sitios?.includes(sitio)) : items, [items, sitio])
  const conteos = useMemo(() => ({
    total: items.length,
    code: items.filter(s => s.sitios?.includes('code')).length,
    portafolio: items.filter(s => s.sitios?.includes('portafolio')).length,
  }), [items])

  const confirmar = async () => {
    setEliminando(true)
    try {
      await eliminar(aEliminar)
      setAEliminar(null)
    } catch { /* el toast ya muestra el error */ } finally { setEliminando(false) }
  }
  const cancelar = useCallback(() => setAEliminar(null), [])
  const nuevo = sitio ? `/admin/servicios/nuevo?sitio=${sitio}` : '/admin/servicios/nuevo'

  return (
    <>
      <EncabezadoPagina
        titulo={sitio === 'code' ? 'Servicios y precios' : sitio ? `Servicios · ${nombreSitio(sitio)}` : 'Servicios'}
        descripcion="Las tarjetas de servicios con su precio. Se ordenan por el número de orden."
      />
      <div className="mb-4"><FiltroSitio conteos={conteos} /></div>

      {error && (
        <EstadoVacio titulo="No se pudieron cargar los servicios" texto={error}>
          <Boton variant="ghost" onClick={recargar}>Reintentar</Boton>
        </EstadoVacio>
      )}

      {!error && cargando && !items.length && <div className="skeleton h-64 rounded-xl" />}

      {!error && !cargando && !visibles.length && (
        <EstadoVacio icono={faTags}
          titulo={sitio ? `No hay servicios en ${nombreSitio(sitio)}` : 'Aún no hay servicios'}
          texto="Crea un servicio con su precio y elige en qué web se muestra.">
          <Boton to={nuevo} icon={faPlus}>Nuevo servicio</Boton>
        </EstadoVacio>
      )}

      {visibles.length > 0 && (
        <div className="tarjeta overflow-x-auto">
          <table className="tabla min-w-[46rem]">
            <thead>
              <tr>
                <th className="w-12">#</th><th>Servicio</th><th>Precio</th><th>Sitios</th><th>Estado</th><th className="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visibles.map(s => (
                <tr key={s._id} className={s.publicado === false ? 'opacity-70' : ''}>
                  <td className="text-subtle tabular-nums">{s.order}</td>
                  <td className="max-w-xs">
                    <Link to={`/admin/servicios/${s._id}`} className="font-semibold text-fg hover:text-neon">{s.title}</Link>
                    <p className="truncate text-xs text-subtle">{s.description}</p>
                  </td>
                  <td className="whitespace-nowrap text-muted">{textoPrecio(s)}</td>
                  <td><BadgesSitios sitios={s.sitios} /></td>
                  <td><InterruptorPublicado publicado={s.publicado} nombre={s.title} onChange={v => alternarPublicado(s, v)} /></td>
                  <td>
                    <div className="flex justify-end gap-1">
                      <Link to={`/admin/servicios/${s._id}`} className="btn btn-subtle btn-icon" aria-label={`Editar ${s.title}`} title="Editar">
                        <FontAwesomeIcon icon={faPen} />
                      </Link>
                      <button onClick={() => setAEliminar(s)} className="btn btn-subtle btn-icon hover:text-danger" aria-label={`Eliminar ${s.title}`} title="Eliminar">
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        abierto={Boolean(aEliminar)}
        titulo="¿Eliminar servicio?"
        mensaje={<>Se eliminará <strong className="text-fg">{aEliminar?.title}</strong>. Si sólo quieres que no se vea, usa el interruptor «Publicado».</>}
        cargando={eliminando}
        onConfirmar={confirmar}
        onCancelar={cancelar}
      />
    </>
  )
}

export default Servicios
