import { useContext } from "react";
import ProyectoContext from "../context/ProyectosProvider";

const useProyectos = () =>{
    return useContext(ProyectoContext)
}

export default useProyectos