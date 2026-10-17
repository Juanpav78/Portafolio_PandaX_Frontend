import { Link } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons"

// Encabezado de las páginas internas del admin (crear, editar, vista previa): enlace de vuelta
// al listado, título y un hueco a la derecha para las acciones propias de cada página.
const EncabezadoAdmin = ({ etiqueta, titulo, children, volver = { to: '/admin', texto: 'Proyectos' } }) => (
  <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div className="min-w-0">
      <Link to={volver.to} className="mb-3 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-neon">
        <FontAwesomeIcon icon={faChevronLeft} className="text-xs" /> {volver.texto}
      </Link>
      <p className="font-mono text-sm text-neon">{`// ${etiqueta}`}</p>
      <h1 className="mt-1 truncate font-display text-3xl text-fg sm:text-4xl">{titulo}</h1>
    </div>
    {children && <div className="flex shrink-0 gap-2">{children}</div>}
  </div>
)

export default EncabezadoAdmin
