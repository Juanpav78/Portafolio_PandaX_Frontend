import { useParams } from "react-router"
import { faFileInvoiceDollar, faHourglassHalf, faMoneyBillWave, faUser, faUsers } from "@fortawesome/free-solid-svg-icons"
import Boton from "../../components/Boton"
import EncabezadoPagina from "../../components/admin/EncabezadoPagina"
import EstadoVacio from "../../components/admin/EstadoVacio"

// Secciones ya visibles en el menú pero sin pantalla todavía. Los modelos de Clientes,
// Cotizaciones y Pagos ya existen en el backend; falta la siguiente fase.
const SECCIONES = {
  clientes: { titulo: 'Clientes', icono: faUsers, texto: 'Aquí podrás registrar clientes, ver su historial y convertir un mensaje de contacto en cliente.' },
  cotizaciones: { titulo: 'Cotizaciones', icono: faFileInvoiceDollar, texto: 'Arma cotizaciones con los servicios del catálogo y sigue si están enviadas, aceptadas o vencidas.' },
  pagos: { titulo: 'Pagos', icono: faMoneyBillWave, texto: 'Registra abonos y pagos por cliente o cotización para saber qué está pendiente.' },
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
