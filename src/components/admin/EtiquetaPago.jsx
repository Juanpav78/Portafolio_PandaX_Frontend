import { estadoPago } from "../../helpers/pagos"

const EtiquetaPago = ({ estado }) => {
  const { texto, clase } = estadoPago(estado)
  return <span className={`inline-flex rounded-md border px-1.5 py-0.5 text-[0.7rem] font-medium ${clase}`}>{texto}</span>
}

export default EtiquetaPago
