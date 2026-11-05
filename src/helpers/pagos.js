// Mismos valores que el backend (models/Payment.js), con el nombre que se muestra
export const METODOS_PAGO = [
  { valor: 'transferencia', texto: 'Transferencia' },
  { valor: 'nequi', texto: 'Nequi' },
  { valor: 'daviplata', texto: 'Daviplata' },
  { valor: 'efectivo', texto: 'Efectivo' },
  { valor: 'tarjeta', texto: 'Tarjeta' },
  { valor: 'otro', texto: 'Otro' },
]

// Sólo "pagado" suma en caja: "pendiente" es un abono acordado que aún no llega
export const ESTADOS_PAGO = [
  { valor: 'pagado', texto: 'Pagado', clase: 'bg-success/10 text-success border-success/25' },
  { valor: 'pendiente', texto: 'Pendiente', clase: 'bg-neon-amber/10 text-neon-amber border-neon-amber/25' },
  { valor: 'reembolsado', texto: 'Reembolsado', clase: 'bg-ink-700 text-subtle border-ink-600' },
]

export const textoMetodo = valor => METODOS_PAGO.find(m => m.valor === valor)?.texto ?? valor
export const estadoPago = valor => ESTADOS_PAGO.find(e => e.valor === valor) ?? ESTADOS_PAGO[0]

// Colombia está siempre en UTC-5: "hoy" y "este mes" se calculan en esa hora y no en la del navegador
const enBogota = () => new Date(Date.now() - 5 * 36e5).toISOString()
export const hoyBogota = () => enBogota().slice(0, 10)
export const mesBogota = () => enBogota().slice(0, 7)

const formatoMes = new Intl.DateTimeFormat('es-CO', { month: 'long', year: 'numeric', timeZone: 'UTC' })
export const nombreMes = mes => formatoMes.format(new Date(`${mes}-15T00:00:00Z`))

const formatoDia = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'America/Bogota' })
export const fechaPago = fecha => (fecha ? formatoDia.format(new Date(fecha)) : '—')

// Para el <input type="date"> al editar: el día en hora de Bogotá
export const fechaInputBogota = fecha => (fecha ? new Date(new Date(fecha).getTime() - 5 * 36e5).toISOString().slice(0, 10) : hoyBogota())
