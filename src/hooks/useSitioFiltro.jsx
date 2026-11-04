import { useSearchParams } from "react-router"
import { esSitio } from "../helpers/sitios"

// Sitio activo en los listados del admin (?sitio=code|portafolio); '' significa "Todos"
const useSitioFiltro = () => {
  const [params] = useSearchParams()
  const sitio = params.get('sitio')
  return esSitio(sitio) ? sitio : ''
}

export default useSitioFiltro
