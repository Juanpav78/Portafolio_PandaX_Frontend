import { useCallback, useMemo, useState } from "react"
import { Link } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPen, faPlus, faQuoteLeft, faTrash } from "@fortawesome/free-solid-svg-icons"
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

const RUTA = '/admin/testimonials'

// Los testimonios se leen mejor como tarjetas (texto largo) que como filas de tabla
const Testimonios = () => {
  const { items, cargando, error, recargar, setItems } = useListaAdmin(RUTA)
  const { alternarPublicado, eliminar } = useAccionesAdmin(RUTA, setItems)
  const sitio = useSitioFiltro()
  const [aEliminar, setAEliminar] = useState(null)
  const [eliminando, setEliminando] = useState(false)

  const visibles = useMemo(() => sitio ? items.filter(t => t.sitios?.includes(sitio)) : items, [items, sitio])
  const conteos = useMemo(() => ({
    total: items.length,
    code: items.filter(t => t.sitios?.includes('code')).length,
    portafolio: items.filter(t => t.sitios?.includes('portafolio')).length,
  }), [items])

  const confirmar = async () => {
    setEliminando(true)
    try {
      await eliminar(aEliminar)
      setAEliminar(null)
    } catch { /* el toast ya muestra el error */ } finally { setEliminando(false) }
  }
  const cancelar = useCallback(() => setAEliminar(null), [])
  const nuevo = sitio ? `/admin/testimonios/nuevo?sitio=${sitio}` : '/admin/testimonios/nuevo'

  return (
    <>
      <EncabezadoPagina
        titulo={sitio ? `Testimonios · ${nombreSitio(sitio)}` : 'Testimonios'}
        descripcion="Opiniones de clientes. La sección de testimonios de cada web se oculta si no tiene ninguno publicado."
      />
      <div className="mb-4"><FiltroSitio conteos={conteos} /></div>

      {error && (
        <EstadoVacio titulo="No se pudieron cargar los testimonios" texto={error}>
          <Boton variant="ghost" onClick={recargar}>Reintentar</Boton>
        </EstadoVacio>
      )}

      {!error && cargando && !items.length && (
        <div className="grid gap-4 md:grid-cols-2">{[0, 1].map(i => <div key={i} className="skeleton h-40 rounded-xl" />)}</div>
      )}

      {!error && !cargando && !visibles.length && (
        <EstadoVacio icono={faQuoteLeft}
          titulo={sitio ? `No hay testimonios en ${nombreSitio(sitio)}` : 'Aún no hay testimonios'}
          texto="Agrega lo que dicen tus clientes y elige en qué web se muestra.">
          <Boton to={nuevo} icon={faPlus}>Nuevo testimonio</Boton>
        </EstadoVacio>
      )}

      {visibles.length > 0 && (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibles.map(t => (
            <li key={t._id} className={`tarjeta flex flex-col gap-4 p-5 ${t.publicado === false ? 'opacity-70' : ''}`}>
              <blockquote className="line-clamp-5 flex-1 text-sm text-fg">“{t.text}”</blockquote>
              <div>
                <p className="text-sm font-semibold text-fg">{t.name}</p>
                {(t.role || t.company) && <p className="text-xs text-subtle">{[t.role, t.company].filter(Boolean).join(' · ')}</p>}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-600 pt-3">
                <BadgesSitios sitios={t.sitios} />
                <div className="flex items-center gap-1">
                  <InterruptorPublicado publicado={t.publicado} nombre={t.name} conTexto={false} onChange={v => alternarPublicado(t, v)} />
                  <Link to={`/admin/testimonios/${t._id}`} className="btn btn-subtle btn-icon" aria-label={`Editar testimonio de ${t.name}`} title="Editar">
                    <FontAwesomeIcon icon={faPen} />
                  </Link>
                  <button onClick={() => setAEliminar(t)} className="btn btn-subtle btn-icon hover:text-danger" aria-label={`Eliminar testimonio de ${t.name}`} title="Eliminar">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        abierto={Boolean(aEliminar)}
        titulo="¿Eliminar testimonio?"
        mensaje={<>Se eliminará el testimonio de <strong className="text-fg">{aEliminar?.name}</strong>. Para dejar de mostrarlo sin borrarlo, desactiva «Publicado».</>}
        cargando={eliminando}
        onConfirmar={confirmar}
        onCancelar={cancelar}
      />
    </>
  )
}

export default Testimonios
