import Boton from "./Boton"

const ModalProyectos = ({proyecto, isModal = false, handleClick}) => {
    const {nombre, imagen, descripcion, tipo, tecnologias, link, github} = proyecto
  return (
    <div className={`shadow mt-10 rounded-lg p-5  max-w-2xl mx-auto ${!isModal ? "bg-p_silver" : " bg-p_silver"}`}>
        <div className='w-full flex justify-end'>
        <span className='font-bold text-p_white font-title text-2xl mr-4 ' onClick={handleClick}>x</span> 

        </div>
        <p className='text-center text-2xl my-4 text-p_white font-title uppercase '>
          {nombre}
        </p> 
        <img src={imagen && imagen.secure_url} alt={nombre + " "+tipo} />
        <div className='flex gap-4 text-center mt-4' >
        { tecnologias && tecnologias.split(",").map((tech, i) =>( //Se muestran las tecnologias
            <p key={i} className='flex-1 rounded inner-box p-2 uppercase'>{tech}</p>
        ))}
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