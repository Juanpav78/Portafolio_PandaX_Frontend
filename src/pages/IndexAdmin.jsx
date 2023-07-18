import useProyectos from "../hooks/useProyectos"
import PreviewProyecto from "../components/PreviewProyecto";
const IndexAdmin = () => {
  const {proyectos, cargando} = useProyectos();
  if (cargando) return "cargando..."
  return (
      <>
      <h1 className=' font-title text-6xl inner-box--text'>Proyectos</h1>

      <div className='  mt-10 rounded-lg p-5  max-w-2xl mx-auto'>
          {proyectos.length > 0?
          proyectos.map(proyecto =>(
            <PreviewProyecto key={proyecto._id} proyecto={proyecto} />
          ))
          : 
          <p className='text-center text-p_white font-title uppercase '>
            No hay proyectos aun
          </p> 
        }
      </div>
      </>
  )
}

export default IndexAdmin