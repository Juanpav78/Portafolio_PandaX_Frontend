import { estadoCotizacion } from "../../helpers/cotizaciones"

// Estado de una cotización con su color (borrador, enviada, aceptada, rechazada o vencida)
const EtiquetaCotizacion = ({ estado }) => {
  const { texto, clase } = estadoCotizacion(estado)
  return <span className={`inline-flex rounded-md border px-1.5 py-0.5 text-[0.7rem] font-medium ${clase}`}>{texto}</span>
}

export default EtiquetaCotizacion
