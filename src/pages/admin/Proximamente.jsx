import { useParams } from "react-router"
import { faHourglassHalf, faUser } from "@fortawesome/free-solid-svg-icons"
import Boton from "../../components/Boton"
import EncabezadoPagina from "../../components/admin/EncabezadoPagina"
import EstadoVacio from "../../components/admin/EstadoVacio"

// Secciones ya visibles en el menú pero sin pantalla todavía
const SECCIONES = {
  'sobre-mi': { titulo: 'Sobre mí', icono: faUser, texto: 'Hoy el texto "Sobre mí" del portafolio vive en el código (src/i18n/textos.js). Editarlo desde aquí llegará en una próxima versión.' },
}

const Proximamente = () => {
  const { seccion } = useParams()
  const datos = SECCIONES[seccion] ?? { titulo: 'Próximamente', icono: faHourglassHalf, texto: 'Esta sección todavía no está disponible.' }

  return (
    <>
      <EncabezadoPagina titulo={datos.titulo} />
      <EstadoVacio icono={datos.icono} titulo="Próximamente" texto={datos.texto}>
        <Boton to="/admin" variant="ghost">Volver al panel</Boton>
      </EstadoVacio>
    </>
  )
}

export default Proximamente
