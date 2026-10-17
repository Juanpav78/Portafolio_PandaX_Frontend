// Campo de formulario con label, ayuda y error ya conectados por accesibilidad:
// aria-invalid pinta el borde rojo (ver .field en index.css) y aria-describedby hace que el
// lector de pantalla lea el error o la ayuda al enfocar el input.
const Campo = ({ label, id, error, hint, as: Control = 'input', className = '', extra, ...props }) => {
  const descripcion = error ? `${id}-error` : hint ? `${id}-hint` : undefined

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-sm font-semibold text-fg/90">{label}</label>
        {extra}
      </div>
      <Control
        id={id}
        name={id}
        aria-invalid={Boolean(error)}
        aria-describedby={descripcion}
        className={`field ${className}`}
        {...props}
      />
      {error
        ? <p id={`${id}-error`} className="text-xs font-semibold text-danger">{error}</p>
        : hint && <p id={`${id}-hint`} className="text-xs text-subtle">{hint}</p>}
    </div>
  )
}

export default Campo
