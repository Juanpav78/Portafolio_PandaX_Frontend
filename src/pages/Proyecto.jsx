import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useProyectos from '../hooks/useProyectos'
import { Link } from 'react-router-dom'

import ModalProyectos from '../components/ModalProyectos'
const Proyecto = () => {
    const params = useParams()
    const {obtenerProyecto, proyecto, cargando, eliminarProyecto} = useProyectos()
    useEffect(()=>{
       obtenerProyecto(params.id) //Obtengo el proyecto

    },[])

    const handleClick = ()=>{
      if(confirm('¿Deseas eliminar este proyecto?')){
         eliminarProyecto(params.id)
      }
    }
    if(cargando) return "cargando..."
  return (
    <>
    <div className='flex justify-between gap-4'>
    <h1 className=' font-title max-w-2xl text-6xl inner-box--text'>Proyecto: </h1>
    <Link 
        className='bg-p_blue rounded max-h-16 p-4 w-32 text-center text-lg font-bold text-p_white'
        to={`/admin/edit/${params.id}`} > Editar</Link>
    <button className='bg-p_red rounded p-4'
    onClick={handleClick}>
          Eliminar
        </button>
    </div>
    <ModalProyectos proyecto={proyecto} />
    </>
  )
}

export default Proyecto