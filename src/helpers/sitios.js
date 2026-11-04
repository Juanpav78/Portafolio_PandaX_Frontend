// Sitios públicos que comparten la base de datos (mismos valores que el backend).
// `descripcion` alimenta la vista previa "dónde aparecerá" de los formularios.
export const SITIOS = [
  { valor: 'code', nombre: 'PandaX Code', descripcion: 'Web de la empresa (servicios y clientes)' },
  { valor: 'portafolio', nombre: 'Portafolio', descripcion: 'Tu portafolio personal' },
]

export const nombreSitio = valor => SITIOS.find(s => s.valor === valor)?.nombre ?? valor

export const esSitio = valor => SITIOS.some(s => s.valor === valor)
