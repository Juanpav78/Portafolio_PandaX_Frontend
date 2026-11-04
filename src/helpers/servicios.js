const cop = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })

// Iconos que sabe dibujar PandaX Code (mismos valores que valida el backend)
export const ICONOS_SERVICIO = [
  { valor: 'layout', nombre: 'Página / landing' },
  { valor: 'monitor', nombre: 'Sitio corporativo' },
  { valor: 'shopping-bag', nombre: 'Tienda online' },
  { valor: 'pen-tool', nombre: 'Diseño / rediseño' },
  { valor: 'code', nombre: 'Desarrollo a medida' },
  { valor: 'rocket', nombre: 'Mantenimiento / lanzamiento' },
]

// Mismo texto que pinta ServiceCard en PandaX Code, para que la vista previa del admin coincida
export const textoPrecio = s => {
  if (s.priceLabel) return s.priceLabel
  if (typeof s.priceFrom !== 'number' || Number.isNaN(s.priceFrom)) return 'Cotiza tu proyecto'
  return `${s.priceLabelPrefix || 'Desde'} ${cop.format(s.priceFrom)}${s.priceSuffix || ''}`
}
