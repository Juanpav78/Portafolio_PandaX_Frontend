import { Outlet, useNavigate } from "react-router-dom"
import Footer from "../components/Footer"
import Header from "../components/Header"
import useProyectos from "../hooks/useProyectos";
import { useEffect } from "react";
import Loading from "../components/Loading";
import {motion} from "framer-motion"

const comprobar = (proyecto)=>{
  console.log("hola")
  if(!proyecto){
    location.reload();
    return false
  }
  return true
}

const IndexLayout = () => {
  const navigate = useNavigate()
  const {obtenerProyectos, cargando, proyectos } = useProyectos();
  useEffect(()=>{
    obtenerProyectos()
  },[])
  if(cargando) {

    setTimeout(()=>{
      let isLoading = comprobar(proyectos);
      if(isLoading){
        navigate(0);
      }
    },1200)
   
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