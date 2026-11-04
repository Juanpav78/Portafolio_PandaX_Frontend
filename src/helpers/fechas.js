const relativo = new Intl.RelativeTimeFormat('es', { numeric: 'auto' })
const corta = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })
const completa = new Intl.DateTimeFormat('es-CO', { dateStyle: 'long', timeStyle: 'short' })

// "hace 5 minutos", "ayer"… para lo reciente; fecha corta a partir de una semana, donde lo
// relativo ("hace 23 días") cuesta más leer que la fecha.
export const fechaRelativa = (fecha) => {
  if (!fecha) return ''
  const segundos = (new Date(fecha) - Date.now()) / 1000
  const abs = Math.abs(segundos)
  if (abs < 60) return 'ahora'
  if (abs < 3600) return relativo.format(Math.round(segundos / 60), 'minute')
  if (abs < 86400) return relativo.format(Math.round(segundos / 3600), 'hour')
  if (abs < 7 * 86400) return relativo.format(Math.round(segundos / 86400), 'day')
  return corta.format(new Date(fecha))
}

export const fechaCompleta = (fecha) => (fecha ? completa.format(new Date(fecha)) : '')
