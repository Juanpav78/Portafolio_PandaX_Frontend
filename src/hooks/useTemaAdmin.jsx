import { useCallback, useEffect, useState } from "react"

const CLAVE = 'admin-tema'

// Activa el tema neutral del admin (clase `admin` en <html>) mientras el panel está montado y
// lo quita al volver a la web pública, que conserva su estilo neón. Va en <html> y no en un
// div para que también lo reciban los toasts y diálogos que se pintan en portales de <body>.
// El modo oscuro es opcional y se recuerda en este navegador.
const useTemaAdmin = () => {
  const [tema, setTemaEstado] = useState(() => localStorage.getItem(CLAVE) === 'oscuro' ? 'oscuro' : 'claro')

  useEffect(() => {
    const html = document.documentElement
    html.classList.add('admin')
    html.classList.toggle('admin-oscuro', tema === 'oscuro')
    return () => html.classList.remove('admin', 'admin-oscuro')
  }, [tema])

  const setTema = useCallback(nuevo => {
    localStorage.setItem(CLAVE, nuevo)
    setTemaEstado(nuevo)
  }, [])

  return { tema, setTema }
}

export default useTemaAdmin
