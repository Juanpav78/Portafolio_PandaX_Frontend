import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useProyectos from '../hooks/useProyectos'
import { Link } from 'react-router-dom'
import Boton from '../components/Boton'
const Proyecto = () => {
    const params = useParams()
    const {obtenerProyecto, proyecto, cargando} = useProyectos()
    useEffect(()=>{
       obtenerProyecto(params.id) //Obtengo el proyecto

    },[])
    if(cargando) return "cargando..."
  return (
    <>
    <div className='flex justify-between gap-4'>
    <h1 className=' font-title max-w-2xl text-6xl inner-box--text'>Proyecto: </h1>
    <Link 
        className='bg-p_blue rounded max-h-16 p-4 w-32 text-center text-lg font-bold text-p_white'
        to={`/admin/edit/${params.id}`} > Editar</Link>
    
    </div>
    <div className='bg-p_silver shadow mt-10 rounded-lg p-5  max-w-2xl mx-auto'>
        
        <p className='text-center text-2xl my-4 text-p_white font-title uppercase '>
          {proyecto.nombre}
        </p> 
        <img src={proyecto.imagen && proyecto.imagen.secure_url} alt={proyecto.nombre + " "+proyecto.tipo} />
        <div className='flex gap-4 text-center mt-4' >
        { proyecto.tecnologias && proyecto.tecnologias.split(",").map((tech, i) =>( //Se muestran las tecnologias
            <p key={i} className='flex-1 rounded inner-box p-2 uppercase'>{tech}</p>
        ))}
        </div>
        <p className=' text-md my-4 text-p_white font-text '>
            <span className='font-title'>{proyecto.tipo}: </span>
            {proyecto.descripcion}</p>
        <div className='flex justify-between gap-4 '>
        <Boton isLink
        msg='Visitar'
        clase='flex-1'
        where={proyecto.link}
        target='newBlank'
        />
        <Boton isLink
        msg='Github'
        clase='flex-1 inner-box '
        where={proyecto.github}
        target='newBlank'
        />
        </div>
        
    </div>
    </>
  )
}

export default Proyecto