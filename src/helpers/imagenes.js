// Reglas de las imágenes que se suben desde el admin (proyectos y retos). El backend corta en
// 5 MB; aquí se pide 2 MB para que las webs no carguen archivos pesados.
export const MAX_IMAGEN = 2 * 1000 * 1000 // 2 MB, mismo límite que se usaba antes
export const TIPOS_IMAGEN = ['image/png', 'image/jpeg', 'image/webp']

// Mensaje de error para un archivo elegido, o null si sirve
export const errorImagen = archivo => {
  if (!TIPOS_IMAGEN.includes(archivo.type)) return 'Formato no válido. Usa PNG, JPG o WebP'
  if (archivo.size > MAX_IMAGEN) return `La imagen pesa ${(archivo.size / 1e6).toFixed(1)} MB; el máximo es 2 MB`
  return null
}
