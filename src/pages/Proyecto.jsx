import { useCallback, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import useProyectos from '../hooks/useProyectos'
import Boton from '../components/Boton'
import ConfirmDialog from '../components/ConfirmDialog'
import DetalleProyecto from '../components/DetalleProyecto'
import EncabezadoAdmin from '../components/EncabezadoAdmin'
import ProyectoNoEncontrado from '../components/ProyectoNoEncontrado'

const formatoCompleto = fecha =>
  fecha ? new Date(fecha).toLocaleString('es', { dateStyle: 'medium', timeStyle: 'short' }) : '—'

// Vista previa en el admin: muestra el proyecto tal como lo verá un visitante, más los
// metadatos internos y las acciones de edición.
const Proyecto = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { proyectos, cargando, eliminarProyecto } = useProyectos()
  const [confirmando, setConfirmando] = useState(false)
  const [eliminando, setEliminando] = useState(false)
  const proyecto = proyectos.find(p => p._id === id)
  const cancelar = useCallback(() => setConfirmando(false), [])

  if (!proyecto) {
    return cargando ? <div className="skeleton h-128 rounded-2xl" /> : <ProyectoNoEncontrado />
  }

  const eliminar = async () => {
    setEliminando(true)
    try {
      await eliminarProyecto(id)
      navigate('/admin')
    } catch {
      setEliminando(false)
    }
  }

  const metadatos = [
    ['Creado', formatoCompleto(proyecto.createdAt)],
    ['Última edición', formatoCompleto(proyecto.updatedAt)],
    ['ID', proyecto._id],
  ]

  return (
    <>
      <EncabezadoAdmin etiqueta="vista previa" titulo={proyecto.nombre}>
        <Boton variant="ghost" icon={faTrash} onClick={() => setConfirmando(true)} className="hover:text-danger! hover:border-danger/60!">
          Eliminar
        </Boton>
        <Boton to={`/admin/edit/${id}`} icon={faPen}>Editar</Boton>
      </EncabezadoAdmin>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="glass neon-border rounded-3xl p-5 sm:p-8">
          <DetalleProyecto proyecto={proyecto} />
        </div>
        <aside className="glass h-fit rounded-2xl p-6">
          <h2 className="mb-4 font-mono text-xs tracking-widest text-subtle uppercase">Detalles</h2>
          <dl className="flex flex-col gap-4 text-sm">
            {metadatos.map(([etiqueta, valor]) => (
              <div key={etiqueta}>
                <dt className="text-subtle">{etiqueta}</dt>
                <dd className="mt-0.5 font-semibold break-all text-fg">{valor}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>

      <ConfirmDialog
        abierto={confirmando}
        titulo="¿Eliminar proyecto?"
        mensaje={<>Se eliminará <strong className="text-fg">{proyecto.nombre}</strong> y su imagen. Esta acción no se puede deshacer.</>}
        cargando={eliminando}
        onConfirmar={eliminar}
        onCancelar={cancelar}
      />
    </>
  )
}

export default Proyecto
