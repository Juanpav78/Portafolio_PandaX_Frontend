import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

// Mensaje para listados sin datos (o sin resultados con los filtros actuales)
const EstadoVacio = ({ icono, titulo, texto, children }) => (
  <div className="tarjeta flex flex-col items-center gap-3 px-6 py-14 text-center">
    {icono && <span className="grid size-12 place-items-center rounded-xl bg-ink-700 text-xl text-subtle"><FontAwesomeIcon icon={icono} /></span>}
    <h2 className="text-base font-semibold text-fg">{titulo}</h2>
    {texto && <p className="max-w-sm text-sm text-muted">{texto}</p>}
    {children && <div className="mt-2 flex flex-wrap justify-center gap-2">{children}</div>}
  </div>
)

export default EstadoVacio
