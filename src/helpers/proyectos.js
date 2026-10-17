// Cloudinary entrega la imagen original subida (a veces varios MB). Insertando transformaciones
// en la URL pedimos una copia redimensionada y en el mejor formato que soporte el navegador
// (AVIF/WebP); c_limit nunca agranda imágenes más pequeñas que el ancho pedido.
export const imagenOptimizada = (url, ancho = 800) => {
  if (!url?.includes('/upload/')) return url
  return url.replace('/upload/', `/upload/f_auto,q_auto,c_limit,w_${ancho}/`)
}

// El backend guarda las tecnologías como un único string ("React, Node ,Mongo").
// Se limpian espacios y entradas vacías para que los filtros comparen valores consistentes.
export const parseTecnologias = (texto = '') =>
  texto.split(',').map(tech => tech.trim()).filter(Boolean)

// Búsqueda tolerante: ignora mayúsculas y tildes para que "diseno" encuentre "Diseño".
// También descarta puntuación al final ("Diseño Web:" → "diseno web") para que un typo al
// escribir el tipo no cree una categoría duplicada en los filtros.
export const normalizar = (texto = '') =>
  texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/[.,:;]+$/, '')

// fechaEntrega es opcional en proyectos antiguos; se cae a createdAt para poder ordenarlos igual.
export const fechaProyecto = proyecto =>
  new Date(proyecto.fechaEntrega ?? proyecto.createdAt ?? 0)

export const formatearFecha = (proyecto, idioma = 'en') =>
  // timeZone UTC: la fecha se guarda como medianoche UTC; en hora de Colombia caería en el día
  // (y a veces el mes) anterior
  fechaProyecto(proyecto).toLocaleDateString(idioma, { month: 'short', year: 'numeric', timeZone: 'UTC' })

export const filtrarProyectos = (proyectos, { busqueda = '', tipo = '', tecnologia = '' } = {}) => {
  const termino = normalizar(busqueda)

  return proyectos.filter(proyecto => {
    if (tipo && normalizar(proyecto.tipo) !== normalizar(tipo)) return false

    const techs = parseTecnologias(proyecto.tecnologias).map(normalizar)
    if (tecnologia && !techs.includes(normalizar(tecnologia))) return false

    if (!termino) return true
    // Se busca en todos los campos visibles a la vez para que un solo input cubra cualquier intención
    const texto = normalizar([proyecto.nombre, proyecto.tipo, proyecto.descripcion, proyecto.tecnologias].join(' '))
    return texto.includes(termino)
  })
}

// Claves de orden disponibles; el texto visible de cada una vive en los diccionarios de i18n
export const ORDENES = ['destacados', 'recientes', 'antiguos', 'nombre']

const porFechaDesc = (a, b) => fechaProyecto(b) - fechaProyecto(a)

export const ordenarProyectos = (proyectos, orden = 'recientes') => {
  // Se copia el array: sort() muta y el original es estado de React
  const copia = [...proyectos]
  if (orden === 'nombre') return copia.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
  // Destacados primero en el orden elegido a mano en el admin; el resto, del más nuevo al más viejo
  if (orden === 'destacados') {
    return copia.sort((a, b) =>
      Number(Boolean(b.destacado)) - Number(Boolean(a.destacado)) ||
      (a.destacado ? (a.orden ?? 0) - (b.orden ?? 0) : 0) ||
      porFechaDesc(a, b))
  }
  const signo = orden === 'antiguos' ? 1 : -1
  return copia.sort((a, b) => signo * (fechaProyecto(a) - fechaProyecto(b)))
}

// Devuelve los valores distintos de un campo con su número de apariciones, de más a menos usado.
// Las variantes de escritura ("react" / "React ") se agrupan bajo la primera forma encontrada.
export const contarValores = (proyectos, obtener) => {
  const conteo = new Map()
  proyectos.forEach(proyecto => {
    obtener(proyecto).forEach(valor => {
      const clave = normalizar(valor)
      if (!clave) return
      const actual = conteo.get(clave) ?? { valor: valor.trim().replace(/[.,:;]+$/, ''), total: 0 }
      actual.total++
      conteo.set(clave, actual)
    })
  })
  return [...conteo.values()].sort((a, b) => b.total - a.total || a.valor.localeCompare(b.valor))
}

export const contarTipos = proyectos => contarValores(proyectos, p => [p.tipo ?? ''])
export const contarTecnologias = proyectos => contarValores(proyectos, p => parseTecnologias(p.tecnologias))

// Muestra sólo el dominio de un enlace ("github.com/usuario/repo" → "github.com")
export const dominio = url => {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}
