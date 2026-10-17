import { createContext, useCallback, useEffect, useMemo, useState } from "react"
import { TEXTOS } from "../i18n/textos"

const IdiomaContext = createContext()
const CLAVE = 'idioma'

// Idioma inicial: el que eligió el visitante la última vez y, si es su primera visita, el de su
// navegador. localStorage puede lanzar error (modo privado, cookies bloqueadas), de ahí el try.
const idiomaInicial = () => {
  try {
    const guardado = localStorage.getItem(CLAVE)
    if (guardado === 'es' || guardado === 'en') return guardado
  } catch { /* sin almacenamiento: se usa el del navegador */ }
  return navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en'
}

const IdiomaProvider = ({ children }) => {
  const [idioma, setIdiomaEstado] = useState(idiomaInicial)

  // <html lang> afecta a lectores de pantalla (pronunciación), traductores automáticos y SEO
  useEffect(() => { document.documentElement.lang = idioma }, [idioma])

  const setIdioma = useCallback(nuevo => {
    setIdiomaEstado(nuevo)
    try { localStorage.setItem(CLAVE, nuevo) } catch { /* no persistir no es crítico */ }
  }, [])

  // t('portfolio.showing', { a: 3, b: 8 }) → busca la ruta en el diccionario y sustituye {a}, {b}
  const t = useCallback((clave, variables = {}) => {
    const valor = clave.split('.').reduce((nodo, parte) => nodo?.[parte], TEXTOS[idioma])
    if (typeof valor !== 'string') return valor ?? clave
    return valor.replace(/\{(\w+)\}/g, (_, nombre) => variables[nombre] ?? `{${nombre}}`)
  }, [idioma])

  // Texto de un proyecto en el idioma activo. Los campos traducibles tienen una versión
  // "<campo>En" opcional; si el visitante está en inglés pero no hay traducción, se muestra
  // el original en español antes que dejar el hueco vacío.
  const campo = useCallback((proyecto, nombre) =>
    (idioma === 'en' && proyecto[`${nombre}En`]) || proyecto[nombre] || '', [idioma])

  const valor = useMemo(() => ({ idioma, setIdioma, t, campo }), [idioma, setIdioma, t, campo])

  return <IdiomaContext.Provider value={valor}>{children}</IdiomaContext.Provider>
}

export { IdiomaProvider }

export default IdiomaContext
