import { useCallback, useState } from "react"
import { Link } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowUpRightFromSquare, faDice, faPen, faPlay, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons"
import useListaAdmin from "../../hooks/useListaAdmin"
import useAccionesAdmin from "../../hooks/useAccionesAdmin"
import Boton from "../../components/Boton"
import ConfirmDialog from "../../components/ConfirmDialog"
import EncabezadoPagina from "../../components/admin/EncabezadoPagina"
import EstadoVacio from "../../components/admin/EstadoVacio"
import InterruptorPublicado from "../../components/admin/InterruptorPublicado"
import { imagenOptimizada } from "../../helpers/proyectos"

const RUTA = '/admin/retos'
const dos = n => String(n).padStart(2, '0')

// Retos de PandaX Code: cada uno ocupa una casilla del muro de la sección Retos de la web.
// Se ven como tarjetas con su miniatura, igual que en el muro.
const Retos = () => {
  const { items, cargando, error, recargar, setItems } = useListaAdmin(RUTA)
  const { alternarPublicado, eliminar } = useAccionesAdmin(RUTA, setItems)
  const [aEliminar, setAEliminar] = useState(null)
  const [eliminando, setEliminando] = useState(false)

  const confirmar = async () => {
    setEliminando(true)
    try {
      await eliminar(aEliminar)
      setAEliminar(null)
    } catch { /* el toast ya muestra el error */ } finally { setEliminando(false) }
  }
  const cancelar = useCallback(() => setAEliminar(null), [])

  return (
    <>
      <EncabezadoPagina
        titulo="Retos"
        descripcion="Una temática al azar, una landing nueva. Cada reto publicado llena una casilla del muro en PandaX Code."
      />

      {error && (
        <EstadoVacio titulo="No se pudieron cargar los retos" texto={error}>
          <Boton variant="ghost" onClick={recargar}>Reintentar</Boton>
        </EstadoVacio>
      )}

      {!error && cargando && !items.length && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{[0, 1, 2].map(i => <div key={i} className="skeleton h-64 rounded-xl" />)}</div>
      )}

      {!error && !cargando && !items.length && (
        <EstadoVacio icono={faDice} titulo="Aún no hay retos"
          texto="Agrega el primero con su temática, la miniatura y los enlaces al video y a la demo.">
          <Boton to="/admin/retos/nuevo" icon={faPlus}>Nuevo reto</Boton>
        </EstadoVacio>
      )}

      {items.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map(r => (
            <li key={r._id} className={`tarjeta flex flex-col overflow-hidden ${r.publicado === false ? 'opacity-70' : ''}`}>
              <div className="aspect-video bg-ink-800">
                {r.imagen?.secure_url
                  ? <img src={imagenOptimizada(r.imagen.secure_url, 600)} alt="" loading="lazy" className="size-full object-cover object-top" />
                  : <div className="grid size-full place-items-center text-sm text-subtle">Sin miniatura</div>}
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div>
                  <p className="font-mono text-xs font-semibold text-neon-soft">RETO #{dos(r.numero)}</p>
                  <p className="mt-1 font-semibold text-fg">{r.tematica}</p>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                  {r.video
                    ? <a href={r.video} target="_blank" rel="noreferrer" className="hover:text-fg"><FontAwesomeIcon icon={faPlay} /> Video</a>
                    : <span className="text-subtle">Sin video</span>}
                  {r.demo
                    ? <a href={r.demo} target="_blank" rel="noreferrer" className="hover:text-fg"><FontAwesomeIcon icon={faArrowUpRightFromSquare} /> Demo</a>
                    : <span className="text-subtle">Sin demo</span>}
                </div>
                <div className="mt-auto flex items-center justify-between gap-3 border-t border-ink-600 pt-3">
                  <InterruptorPublicado publicado={r.publicado} nombre={`reto ${r.numero}`} onChange={v => alternarPublicado(r, v)} />
                  <div className="flex items-center gap-1">
                    <Link to={`/admin/retos/${r._id}`} className="btn btn-subtle btn-icon" aria-label={`Editar reto ${r.numero}`} title="Editar">
                      <FontAwesomeIcon icon={faPen} />
                    </Link>
                    <button onClick={() => setAEliminar(r)} className="btn btn-subtle btn-icon hover:text-danger" aria-label={`Eliminar reto ${r.numero}`} title="Eliminar">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        abierto={Boolean(aEliminar)}
        titulo="¿Eliminar reto?"
        mensaje={<>Se eliminará el reto <strong className="text-fg">#{aEliminar && dos(aEliminar.numero)} · {aEliminar?.tematica}</strong> y su miniatura. Para dejar de mostrarlo sin borrarlo, desactiva «Publicado».</>}
        cargando={eliminando}
        onConfirmar={confirmar}
        onCancelar={cancelar}
      />
    </>
  )
}

export default Retos
