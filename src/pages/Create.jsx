import { useLocation } from 'react-router'
import EncabezadoAdmin from '../components/EncabezadoAdmin'
import Formulario from '../components/Formulario'

const Create = () => {
  // El planificador navega aquí con { state: { borrador } } al publicar un plan completado.
  // Se usa el state de la navegación (no la URL) porque la descripción puede ser larga.
  const { state } = useLocation()

  return (
    <>
      <EncabezadoAdmin etiqueta="nuevo" titulo={state?.borrador ? 'Publicar plan' : 'Crear proyecto'} />
      <Formulario borrador={state?.borrador} />
    </>
  )
}

export default Create
