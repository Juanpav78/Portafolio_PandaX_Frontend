import useProyectos from "../hooks/useProyectos"
import Card from "../components/Card"
const Portafolio = () => {
  const {proyectos} = useProyectos()
  return (
    <main className='proyects bg-p_silverDark min-h-screen' >
    <h2 className=' text-center  font-title text-6xl text-p_white mb-16'>
        My
      <span className=' ml-4 w-72 font-title mb-2 font-bold text-6xl inner-box--text '>
        Proyects
      </span>

    </h2>
    <div className='grid grid-cols-1 md:grid-cols-3 justify-items-center max-w-6xl mx-auto gap-8'>

    { proyectos &&
          proyectos.map((proyecto)=>(
            <Card key={proyecto._id} proyecto={proyecto} />
          ) 
          )
        }
    </div>
    </main>
  )
}

export default Portafolio