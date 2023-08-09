import { Outlet, useNavigate } from "react-router-dom"
import Footer from "../components/Footer"
import Header from "../components/Header"
import useProyectos from "../hooks/useProyectos";
import { useEffect } from "react";
import Loading from "../components/Loading";
import {motion} from "framer-motion"



const IndexLayout = () => {
  const navigate = useNavigate()
  const {obtenerProyectos, cargando, tarda } = useProyectos();
  useEffect(()=>{
    obtenerProyectos()
  },[])
  

  if(cargando) {

    if(tarda){
      location.reload();
    }

    return <Loading />

  }

  return (
    <motion.div
    initial={{opacity: 0}}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    >
    <Header />
    <Outlet />
    <Footer />
    </motion.div>
  )
}

export default IndexLayout