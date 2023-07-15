import { Link } from "react-router-dom"
import proyectos from "../mocks/proyecto.json"
import Boton from "../components/Boton"


const Proyects = () => {

  return (
    <main className='proyects bg-p_silverDark py-16 ' id="proyects" >
      <h2 className=' text-center  font-title text-6xl text-p_white mb-16'>
        My
      <span className=' ml-4 w-72 font-title mb-2 font-bold text-6xl inner-box--text '>
        Proyects
      </span>

      </h2>

      <div className='grid grid-cols-1 md:grid-cols-3 justify-items-center max-w-6xl mx-auto gap-8'>
        {
          proyectos.map((proyecto, i)=>(
            <div key={i} className='card border-1px flex flex-col max-w-sm  rounded-md overflow-hidden'>
              <div className=''>
                <img src={proyecto.imagen} alt={`proyecto web design ${proyecto.tipo +" "+ proyecto.titulo} `} />
              </div>
              <div className='p-4'>
              <div className='flex gap-2 mb-2'>
              <span className='text-p_silverDark inner-box rounded-md px-4 py-1 font-text font-bold'>php</span>
              <span className='text-p_silverDark inner-box rounded-md px-4 py-1 font-text font-bold'>php</span>
              <span className='text-p_silverDark inner-box rounded-md px-4 py-1 font-text font-bold'>php</span>
              </div>

              <h3 className='text-p_white font-title text-2xl'>{proyecto.titulo}</h3>
              <p  className='text-p_white  ' >{proyecto.descripcion}</p>
              </div>
              
            </div>
          ))
        }

      </div>
        <Boton isLink 
        msg="See More"
        clase='mx-auto my-4'
        where="/proyectos"
        />

    </main>
  )
}

export default Proyects