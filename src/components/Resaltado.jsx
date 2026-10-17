import { normalizar } from "../helpers/proyectos"

// Resalta en el texto la primera coincidencia de la búsqueda, ignorando mayúsculas y tildes
// (igual que el filtro, para que lo resaltado sea siempre lo que hizo coincidir el resultado).
// Funciona porque quitar tildes no cambia la longitud del texto: "Diseño" y "diseno" tienen
// los mismos índices, así que la posición encontrada en uno sirve para cortar el original.
const Resaltado = ({ texto = '', busqueda = '' }) => {
  const termino = normalizar(busqueda)
  const inicio = termino ? normalizar(texto).indexOf(termino) : -1
  if (inicio === -1) return texto

  const fin = inicio + termino.length
  return (
    <>
      {texto.slice(0, inicio)}
      <mark className="rounded bg-neon/25 px-0.5 text-fg">{texto.slice(inicio, fin)}</mark>
      {texto.slice(fin)}
    </>
  )
}

export default Resaltado
