// Silueta de una Card mientras llegan los datos. Mantiene exactamente las mismas proporciones
// (imagen 16:10 + cuerpo) para que la rejilla no "salte" cuando se reemplaza por la tarjeta real.
const CardSkeleton = () => (
  <div aria-hidden="true" className="overflow-hidden rounded-2xl border border-white/5 bg-ink-800/60">
    <div className="skeleton aspect-16/10" />
    <div className="flex flex-col gap-3 p-5">
      <div className="skeleton h-6 w-2/3 rounded-md" />
      <div className="skeleton h-4 w-full rounded-md" />
      <div className="skeleton h-4 w-5/6 rounded-md" />
      <div className="mt-2 flex gap-2">
        <div className="skeleton h-5 w-16 rounded-full" />
        <div className="skeleton h-5 w-14 rounded-full" />
        <div className="skeleton h-5 w-12 rounded-full" />
      </div>
    </div>
  </div>
)

export default CardSkeleton
