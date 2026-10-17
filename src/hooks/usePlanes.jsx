import { useContext } from "react";
import PlanesContext from "../context/PlanesProvider";

const usePlanes = () => {
    return useContext(PlanesContext)
}

export default usePlanes
