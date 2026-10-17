import {
  faCircleCheck, faFlagCheckered, faLightbulb, faListCheck, faPlay, faRocket, faBolt, faMap,
} from '@fortawesome/free-solid-svg-icons'

// Columnas del tablero en orden de avance. `siguiente` lo usa el botón de "mover" de cada
// tarjeta para avanzar un plan sin tener que arrastrarlo (útil en móvil y con teclado).
export const ESTADOS = [
  { id: 'idea', nombre: 'Ideas', icono: faLightbulb, texto: 'text-neon-amber', fondo: 'bg-neon-amber' },
  { id: 'planificado', nombre: 'Planificado', icono: faMap, texto: 'text-neon-cyan', fondo: 'bg-neon-cyan' },
  { id: 'en-progreso', nombre: 'En progreso', icono: faBolt, texto: 'text-neon', fondo: 'bg-neon' },
  { id: 'completado', nombre: 'Completado', icono: faCircleCheck, texto: 'text-success', fondo: 'bg-success' },
]
export const estadoPorId = id => ESTADOS.find(e => e.id === id) ?? ESTADOS[0]
export const siguienteEstado = id => ESTADOS[ESTADOS.findIndex(e => e.id === id) + 1]

export const PRIORIDADES = {
  alta: { nombre: 'Alta', orden: 0, clase: 'border-danger/40 bg-danger/10 text-danger' },
  media: { nombre: 'Media', orden: 1, clase: 'border-neon-amber/40 bg-neon-amber/10 text-neon-amber' },
  baja: { nombre: 'Baja', orden: 2, clase: 'border-white/10 bg-white/5 text-muted' },
}

export const progreso = plan => {
  const total = plan.tareas?.length ?? 0
  const hechas = plan.tareas?.filter(t => t.completada).length ?? 0
  return { total, hechas, porcentaje: total ? Math.round((hechas / total) * 100) : 0 }
}

// ---------- Fechas ----------
// Las fechas sin hora (input type="date") llegan del backend como medianoche UTC
// ("2026-10-20T00:00:00Z"). Convertidas a hora local de Colombia (UTC-5) serían las 19:00 del
// día ANTERIOR, así que estas fechas se comparan siempre por su clave "YYYY-MM-DD" en UTC.
export const claveFecha = fecha => (fecha ? new Date(fecha).toISOString().slice(0, 10) : '')

// Los días del calendario, en cambio, se construyen en hora local del navegador
export const claveLocal = fecha => {
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')
  return `${fecha.getFullYear()}-${mes}-${dia}`
}
export const claveHoy = () => claveLocal(new Date())

// Días entre hoy y una clave "YYYY-MM-DD" (negativo = ya pasó). Se calcula con Date.UTC
// para que los cambios de horario de verano no produzcan días de 23 o 25 horas.
export const diasHasta = clave => {
  const [a, m, d] = clave.split('-').map(Number)
  const [ah, mh, dh] = claveHoy().split('-').map(Number)
  return Math.round((Date.UTC(a, m - 1, d) - Date.UTC(ah, mh - 1, dh)) / 86400000)
}

export const formatearDia = (fecha, opciones = { day: 'numeric', month: 'short' }) =>
  fecha ? new Date(fecha).toLocaleDateString('es', { ...opciones, timeZone: 'UTC' }) : ''

// Texto y color del vencimiento de un plan o tarea. Lo ya completado nunca se marca como
// vencido: avisaría de algo que ya no requiere atención.
export const vencimiento = (fecha, completado = false) => {
  if (!fecha) return null
  const dias = diasHasta(claveFecha(fecha))
  if (completado) return { texto: formatearDia(fecha), clase: 'text-subtle' }
  // `urgente` marca lo que merece un aviso aparte de la fecha (vencido o en la próxima semana)
  if (dias < 0) return { texto: `Venció hace ${-dias} ${-dias === 1 ? 'día' : 'días'}`, clase: 'text-danger', vencido: true, urgente: true }
  if (dias === 0) return { texto: 'Vence hoy', clase: 'text-neon', urgente: true }
  if (dias === 1) return { texto: 'Vence mañana', clase: 'text-neon-amber', urgente: true }
  if (dias <= 7) return { texto: `En ${dias} días`, clase: 'text-neon-amber', urgente: true }
  return { texto: formatearDia(fecha), clase: 'text-muted' }
}

// ---------- Calendario ----------
export const TIPOS_EVENTO = {
  inicio: { nombre: 'Inicio de plan', icono: faPlay, clase: 'border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan', punto: 'bg-neon-cyan' },
  entrega: { nombre: 'Entrega de plan', icono: faFlagCheckered, clase: 'border-neon/30 bg-neon/10 text-neon-soft', punto: 'bg-neon' },
  tarea: { nombre: 'Tarea', icono: faListCheck, clase: 'border-neon-amber/30 bg-neon-amber/10 text-neon-amber', punto: 'bg-neon-amber' },
  publicado: { nombre: 'Proyecto publicado', icono: faRocket, clase: 'border-success/30 bg-success/10 text-success', punto: 'bg-success' },
}

// Reúne en un único índice { "YYYY-MM-DD": [eventos] } todo lo que tiene fecha: inicios y
// entregas de planes, tareas con fecha límite y proyectos ya publicados en el portafolio.
// Indexar por clave hace que pintar las 42 celdas del mes sea una búsqueda directa por día.
export const construirEventos = (planes, proyectos) => {
  const eventos = new Map()
  const agregar = (fecha, evento) => {
    if (!fecha) return
    const clave = claveFecha(fecha)
    eventos.set(clave, [...(eventos.get(clave) ?? []), { ...evento, clave }])
  }

  planes.forEach(plan => {
    const ruta = `/admin/planes/${plan._id}`
    const hecho = plan.estado === 'completado'
    agregar(plan.fechaInicio, { id: `${plan._id}-i`, tipo: 'inicio', titulo: plan.nombre, detalle: 'Inicio', ruta, completado: hecho })
    agregar(plan.fechaLimite, { id: `${plan._id}-e`, tipo: 'entrega', titulo: plan.nombre, detalle: 'Entrega', ruta, completado: hecho })
    plan.tareas?.forEach(tarea => agregar(tarea.fechaLimite, {
      id: tarea._id, tipo: 'tarea', titulo: tarea.titulo, detalle: plan.nombre, ruta, completado: tarea.completada,
    }))
  })

  proyectos.forEach(proyecto => agregar(proyecto.fechaEntrega, {
    id: proyecto._id, tipo: 'publicado', titulo: proyecto.nombre, detalle: 'Publicado', ruta: `/admin/preview/${proyecto._id}`, completado: true,
  }))

  return eventos
}

// 6 semanas × 7 días empezando en lunes: siempre 42 celdas para que la rejilla no cambie de
// alto al pasar de un mes que ocupa 5 semanas a otro que ocupa 6.
export const diasDelMes = primerDia => {
  const desfase = (primerDia.getDay() + 6) % 7 // getDay() empieza en domingo; se pasa a lunes = 0
  return Array.from({ length: 42 }, (_, i) =>
    new Date(primerDia.getFullYear(), primerDia.getMonth(), i - desfase + 1))
}
