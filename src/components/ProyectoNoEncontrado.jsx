import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGhost } from "@fortawesome/free-solid-svg-icons"
import Boton from "./Boton"

// Se muestra si el id de la URL no existe (elemento borrado, enlace viejo o id mal copiado)
const ProyectoNoEncontrado = ({ titulo = 'Proyecto no encontrado', volver = { to: '/admin', texto: 'Volver a proyectos' } }) => (
  <div className="glass mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl p-12 text-center">
    <FontAwesomeIcon icon={faGhost} className="text-4xl text-subtle" />
    <h1 className="text-xl font-bold text-fg">{titulo}</h1>
    <p className="text-muted">Puede que se haya eliminado o que el enlace no sea correcto.</p>
    <Boton to={volver.to} variant="ghost">{volver.texto}</Boton>
  </div>
)

export default ProyectoNoEncontrado
