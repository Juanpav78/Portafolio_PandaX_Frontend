// Datos que aparecen en el encabezado de cada cotización impresa. Si cambian (p. ej. al tener
// NIT de empresa o un correo propio del dominio), se actualizan aquí.
export const EMPRESA = {
  marca: 'PandaX Code',
  responsable: 'Juan Pablo Alvarado Valero',
  documento: 'C.C. 1.127.623.037',
  ciudad: 'Bogotá D.C., Colombia',
  correo: 'juanpav.78d@gmail.com',
  telefono: '+57 322 408 1829',
}

// Texto inicial de las notas de una cotización nueva (se puede editar en cada una)
export const NOTAS_POR_DEFECTO = [
  'Valores en pesos colombianos (COP). No responsable de IVA.',
  'Forma de pago: 50 % para iniciar y 50 % contra entrega.',
  'El dominio y el hosting se cotizan aparte si el cliente no los tiene.',
].join('\n')

// COT-0007: el número con ceros a la izquierda se lee y se dicta mejor por teléfono
export const codigoCotizacion = numero => (numero ? `COT-${String(numero).padStart(4, '0')}` : 'COT-—')

// "vencida" no se elige a mano: el backend la deduce de una enviada cuya fecha ya pasó
export const ESTADOS_COTIZACION = [
  { valor: 'borrador', texto: 'Borrador', clase: 'bg-ink-700 text-muted border-ink-600' },
  { valor: 'enviada', texto: 'Enviada', clase: 'bg-neon/10 text-neon border-neon/25' },
  { valor: 'aceptada', texto: 'Aceptada', clase: 'bg-success/10 text-success border-success/25' },
  { valor: 'rechazada', texto: 'Rechazada', clase: 'bg-danger/10 text-danger border-danger/25' },
  { valor: 'vencida', texto: 'Vencida', clase: 'bg-neon-amber/10 text-neon-amber border-neon-amber/25', automatico: true },
]

export const estadoCotizacion = valor => ESTADOS_COTIZACION.find(e => e.valor === valor) ?? ESTADOS_COTIZACION[0]

export const totalLineas = items => items.reduce((suma, i) => suma + (Number(i.quantity) || 0) * (Number(i.unitPrice) || 0), 0)

const fechaCorta = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })
export const fechaDocumento = fecha => (fecha ? fechaCorta.format(new Date(fecha)) : '—')

// <input type="date"> trabaja con "YYYY-MM-DD"
export const aFechaInput = fecha => (fecha ? new Date(fecha).toISOString().slice(0, 10) : '')
