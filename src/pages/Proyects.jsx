import useProyectos from "../hooks/useProyectos"
import Boton from "../components/Boton"
import Card from "../components/Card"
import { useEffect } from "react"


const Proyects = () => {
  const { proyectos} = useProyectos()
  const orderP = [...proyectos].reverse()

  return (
    <main className='proyects bg-p_silverDark py-16 ' id="proyects" >
      <h2 className=' text-center  font-title  text-5xl md:text-6xl text-p_white mb-16'>
        My
      <span className=' ml-4 w-72 font-title mb-2 font-bold  text-5xl md:text-6xl inner-box--text '>
        Proyects
      </span>

      </h2>

      <div className='grid grid-cols-1 md:grid-cols-3 justify-items-center max-w-6xl mx-auto gap-8'>
        { proyectos &&
           orderP.map((proyecto, i)=>{
            if(i>=3 && i<6){
              return(
                <Card key={proyecto._id} proyecto={proyecto} />
              )
            }
          })
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