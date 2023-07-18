import { Outlet } from "react-router-dom"
import Footer from "../components/Footer"
import Header from "../components/Header"
import { useEffect } from "react"
import useProyectos from "../hooks/useProyectos"
const IndexLayout = () => {
  const {obtenerProyectos} = useProyectos()
  useEffect(()=>{
    obtenerProyectos()
  },[])
  return (
    <>
    <Header />
    <Outlet />
    <Footer />
    </>
  )
}

export default IndexLayout