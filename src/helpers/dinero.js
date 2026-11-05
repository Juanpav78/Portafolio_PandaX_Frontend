const cop = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })

// $ 1.200.000 — formato de pesos colombianos sin decimales, usado en todo el módulo de negocio
export const formatoCOP = (valor) => cop.format(Number(valor) || 0)
