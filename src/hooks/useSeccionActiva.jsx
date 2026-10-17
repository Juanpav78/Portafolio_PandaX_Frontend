import { useEffect, useState } from "react"

// Devuelve el id de la sección que ocupa la franja central de la pantalla, para resaltar
// el enlace correspondiente del menú. Con rootMargin se reduce el área observada a una
// banda del 40% en medio del viewport: así sólo una sección "gana" a la vez y el cambio
// ocurre cuando el usuario realmente está leyéndola, no cuando asoma un borde.
const useSeccionActiva = (ids, habilitado = true) => {
  const [activa, setActiva] = useState('')
  const clave = ids.join(',')

  useEffect(() => {
    if (!habilitado) return
    const observer = new IntersectionObserver(
      entradas => {
        entradas.forEach(entrada => {
          if (entrada.isIntersecting) setActiva(entrada.target.id)
        })
      },
      { rootMargin: '-30% 0px -30% 0px' }
    )
    clave.split(',').forEach(id => {
      const elemento = document.getElementById(id)
      if (elemento) observer.observe(elemento)
    })
    return () => observer.disconnect()
  }, [clave, habilitado])

  return habilitado ? activa : ''
}

export default useSeccionActiva
