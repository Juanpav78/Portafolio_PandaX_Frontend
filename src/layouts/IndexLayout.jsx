import { useEffect } from "react";
import { Outlet, useLocation } from "react-router"
import Footer from "../components/Footer"
import Header from "../components/Header"
import useProyectos from "../hooks/useProyectos";
import useIdioma from "../hooks/useIdioma";

const IndexLayout = () => {
  const { obtenerProyectos } = useProyectos();
  const { pathname, hash } = useLocation()
  const { t } = useIdioma()

  // Ya no se bloquea toda la página con un loader mientras llegan los proyectos: el hero y el
  // resto del contenido se muestran al instante y sólo la rejilla de proyectos usa skeletons.
  useEffect(()=>{
    obtenerProyectos()
  },[obtenerProyectos])

  // React Router no hace scroll al cambiar de ruta: sin esto, al ir de la home a /proyectos se
  // conservaría la posición anterior. Si la URL trae #seccion (p. ej. desde el menú en otra
  // página) se espera un frame para que la sección exista en el DOM antes de desplazarse.
  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      return
    }
    const frame = requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash])

  return (
    <>
      <div className="bg-escena" />
      <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 btn btn-primary btn-sm">
        {t('nav.skip')}
      </a>
      <Header />
      <div id="contenido">
        <Outlet />
      </div>
      <Footer />
    </>
  )
}

export default IndexLayout
