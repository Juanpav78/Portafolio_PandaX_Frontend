import { useState } from "react"
import ModalProyectos from "./ModalProyectos"

const Card = ({proyecto}) => {
  const {nombre, imagen, descripcion, tipo, tecnologias} = proyecto
  const [modal, setModal] = useState(false)

  const handleClick = (e) =>{
    e.preventDefault()
    setModal(!modal)
    document.querySelector("body").classList.toggle("no-scroll")
  }
  return (
    <>
    <div 
    onClick={handleClick}
    className='cursor-pointer card border-1px flex flex-col max-w-sm  rounded-md overflow-hidden'>
              <div className='h-48'>
                <img loading="lazy"  className="  h-full w-full" src={imagen.secure_url} alt={`proyecto web design ${tipo +" "+ nombre} `} />
              </div>
              <div className='p-4 h-48'>
              <div className='flex gap-2 mb-2'>
              { tecnologias && tecnologias.split(",").map((tech, i) =>{
                if(i<3){
                 return ( //Se muestran las tecnologias
                  <span key={i} className='text-p_silverDark text-sm inner-box rounded-md px-4 py-1 font-text font-bold'>{tech}</span>
                )
                }
              })}
          
              </div>

              <h3 className='text-p_white font-title text-2xl'>{nombre}</h3>
              <p  className='text-p_white  ' >{descripcion}</p>
              </div>
    </div>

    {modal && (
      <div className='fixed p-8 w-full h-screen z-10 backdrop-blur-sm top-0 left-0 flex justify-center items-center overflow-y-scroll'>
      <ModalProyectos
          isModal
          proyecto={proyecto}
          handleClick={handleClick}
          />
      </div>
    )
    }
    </>
    
  )
}

export default Card