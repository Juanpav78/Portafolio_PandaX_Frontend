// Estado de un mensaje de contacto. "Nuevo" usa el acento para que salte a la vista; el resto
// es gris porque ya no requiere acción inmediata.
const ESTILOS = {
  nuevo: 'bg-neon/10 text-neon border-neon/25',
  'leído': 'bg-ink-700 text-muted border-ink-600',
  respondido: 'bg-success/10 text-success border-success/25',
  archivado: 'bg-ink-700 text-subtle border-ink-600',
}

const EtiquetaEstado = ({ estado }) => (
  <span className={`inline-flex rounded-md border px-1.5 py-0.5 text-[0.7rem] font-medium capitalize ${ESTILOS[estado] ?? ESTILOS['leído']}`}>
    {estado}
  </span>
)

export default EtiquetaEstado
