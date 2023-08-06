import Boton from "./Boton"
import {motion} from "framer-motion"
const ModalProyectos = ({proyecto, isModal = false, handleClick}) => {
    const {nombre, imagen, descripcion, tipo, tecnologias, link, github} = proyecto
  return (
    <div 
    className={`shadow mt-10 rounded-lg p-5  max-w-2xl mx-auto ${!isModal ? "bg-p_silver" : " bg-p_silverDark border-p_orange border-2 modal"}`}>
        <div className='w-full flex justify-end'>
        <span className='font-bold text-p_white font-title text-2xl mr-4 cursor-pointer ' onClick={handleClick}>x</span> 

        </div>
        <p className='text-center text-2xl my-4 text-p_white font-title uppercase '>
          {nombre}
        </p> 
        <img src={imagen && imagen.secure_url} loading="lazy" className=" w-full" alt={nombre + " "+tipo} />
        <div className='w-full overflow-hidden '>
        <div className='relative flex w-full gap-4 text-center mt-4 overflow-x-scroll tech' >
        { tecnologias && tecnologias.split(",").map((tech, i) =>( //Se muestran las tecnologias
            <p key={i} className=' rounded inner-box p-2 uppercase'>{tech}</p>
        ))}
        </div>
        </div>
       
        <p className=' text-md my-4 text-p_white font-text '>
            <span className='font-title'>{tipo}: </span>
            {descripcion}</p>
        <div className='flex justify-between gap-4 '>
        <Boton isLink
        msg='Visitar'
        clase='flex-1'
        where={link}
        target='newBlank'
        />
        <Boton isLink
        msg='Github'
        clase='flex-1 inner-box '
        where={github}
        target='newBlank'
        />
        </div>
        
    </div>
  )
}

export default ModalProyectos