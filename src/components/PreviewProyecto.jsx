import { Link } from "react-router-dom"

const PreviewProyecto = ({proyecto}) => {
  const {nombre, _id, imagen, tipo} = proyecto
  return (
    <div className="shadow-md shadow-p_dark border-1px p-4 my-4  rounded-lg flex justify-between">
      <div className="flex items-center flex-col justify-start">
      <h4 className='font-title font-bold text-p_white  text-xl'>{nombre}</h4>
      <img className='w-56 h-32 border-2 border-p_orange' src={imagen} alt={nombre + " "+tipo} />
      </div>


      <div className="flex flex-col w-40 text-center font-text font-bold text-lg gap-4 text-p_white justify-center">
        <Link 
        className='bg-p_blue rounded p-4'
        to={`preview/${_id}`} > Editar</Link>
        <button className='bg-p_red rounded p-4'>
          Eliminar
        </button>
      </div>
      
    </div>
  )
}

export default PreviewProyecto