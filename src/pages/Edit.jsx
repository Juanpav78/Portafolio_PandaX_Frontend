import { useParams } from 'react-router'
import EncabezadoAdmin from '../components/EncabezadoAdmin'
import Formulario from '../components/Formulario'
import ProyectoNoEncontrado from '../components/ProyectoNoEncontrado'
import useProyectos from '../hooks/useProyectos'

const Edit = () => {
  const { id } = useParams()
  const { proyectos, cargando } = useProyectos()
  // El AdminLayout ya descargó la lista completa: se busca ahí en vez de pedir el proyecto
  // otra vez al backend, así la edición abre al instante.
  const proyecto = proyectos.find(p => p._id === id)

  if (!proyecto) {
    return cargando
      ? <div className="skeleton h-96 rounded-2xl" />
      : <ProyectoNoEncontrado />
  }

  return (
    <>
      <EncabezadoAdmin etiqueta="editar" titulo={proyecto.nombre} />
      {/* key: si se navega de editar un proyecto a otro, el formulario se reinicia con sus datos */}
      <Formulario key={id} proyecto={proyecto} />
    </>
  )
}

export default Edit
