// Encabezado de las pantallas de listado del admin: título, descripción y acciones a la derecha
const EncabezadoPagina = ({ titulo, descripcion, children }) => (
  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div className="min-w-0">
      <h1 className="text-2xl font-semibold tracking-tight text-fg">{titulo}</h1>
      {descripcion && <p className="mt-1 text-sm text-muted">{descripcion}</p>}
    </div>
    {children && <div className="flex shrink-0 flex-wrap gap-2">{children}</div>}
  </div>
)

export default EncabezadoPagina
