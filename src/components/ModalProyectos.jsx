import Boton from "./Boton"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faX } from "@fortawesome/free-solid-svg-icons"
const ModalProyectos = ({proyecto, isModal = false, handleClick}) => {
    const {nombre, imagen, descripcion, tipo, tecnologias, link, github} = proyecto
  return (
    <div 
    className={`shadow mt-10 h-auto rounded-lg p-8 md:p-16  max-w-2xl m-auto my-5  ${!isModal ? "bg-p_silver" : " bg-p_silverDark border-p_orange border-2 modal"}`}>
        <div className=''>
          <FontAwesomeIcon 
          onClick={handleClick}
          className="text-p_white relative left-full text-end font-title text-2xl block cursor-pointer transition-colors hover:text-p_orange" icon={faX} />  
        </div>
        <p className='text-center text-2xl my-4 inner-box--text font-title uppercase '>
          {nombre}
        </p> 
        <img src={imagen && imagen.secure_url} loading="lazy" className=" shadow-lg my-8 w-full h-72 rounded-md" alt={nombre + " "+tipo} />
        <div className='flex overflow-hidden  '>
        <div className='grid grid-cols-3 gap-4 text-center whitespace-nowrap justify-center items-center' >
        { tecnologias && tecnologias.split(",").map((tech, i) =>( //Se muestran las tecnologias
            <p key={i} className=' rounded inner-box p-2 uppercase truncate'>{tech}</p>
        ))}
        </div>
        </div>
       
        <p className=' text-md my-4 text-p_white font-text  '>
            <span className='font-title'>{tipo}: </span>
            {descripcion}</p>
        <div className='flex justify-between gap-4 flex-col md:flex-row '>
        <Boton isLink
        msg='Visitar'
        clase='flex-1 w-full md:w-auto'
        where={link}
        target='newBlank'
        />
        <Boton isLink
        msg='Github'
        clase='flex-1 inner-box   w-full md:w-auto'
        where={github}
        target='newBlank'
        />
        </div>
        
    </div>
  )
}

export default ModalProyectos