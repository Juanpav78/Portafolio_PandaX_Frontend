import { useCallback, useEffect, useRef, useState } from "react"

// Alerta temporal (toast). Sustituye el patrón setAlerta + setTimeout que se repetía en cada página.
// Guarda el id del timeout para reiniciar la cuenta si llega otra alerta antes de que expire la
// anterior (si no, la primera borraría a la segunda antes de tiempo) y lo limpia al desmontar.
const useAlerta = (duracion = 5000) => {
  const [alerta, setAlerta] = useState({})
  const timer = useRef()

  const mostrarAlerta = useCallback((msg, error = true) => {
    clearTimeout(timer.current)
    setAlerta({ msg, error })
    timer.current = setTimeout(() => setAlerta({}), duracion)
  }, [duracion])

  const cerrarAlerta = useCallback(() => {
    clearTimeout(timer.current)
    setAlerta({})
  }, [])

  useEffect(() => () => clearTimeout(timer.current), [])

  return { alerta, mostrarAlerta, cerrarAlerta }
}

export default useAlerta
