import { useEffect } from "react"

// Bloquea el scroll del <body> mientras haya un modal abierto.
// Se compensa el ancho de la barra de scroll con padding para que el contenido de fondo no
// "salte" a la derecha al desaparecer la barra, y se restauran los valores previos al cerrar
// (en vez de forzar "auto") por si otro modal sigue abierto debajo.
const useBloquearScroll = (activo = true) => {
  useEffect(() => {
    if (!activo) return
    const { body, documentElement } = document
    const anchoBarra = window.innerWidth - documentElement.clientWidth
    const previo = { overflow: body.style.overflow, paddingRight: body.style.paddingRight }

    body.style.overflow = 'hidden'
    if (anchoBarra > 0) body.style.paddingRight = `${anchoBarra}px`

    return () => {
      body.style.overflow = previo.overflow
      body.style.paddingRight = previo.paddingRight
    }
  }, [activo])
}

export default useBloquearScroll
