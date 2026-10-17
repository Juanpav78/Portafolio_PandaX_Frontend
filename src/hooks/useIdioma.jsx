import { useContext } from "react"
import IdiomaContext from "../context/IdiomaProvider"

const useIdioma = () => {
  return useContext(IdiomaContext)
}

export default useIdioma
