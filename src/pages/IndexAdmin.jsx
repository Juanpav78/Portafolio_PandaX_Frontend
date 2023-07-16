import useProyectos from "../hooks/useProyectos"
const IndexAdmin = () => {
  const {proyectos} = useProyectos();
  return (
      <>
      <h1 className=' font-title text-6xl inner-box--text'>Proyectos</h1>

      <div>
          {proyectos.length ?
          <p></p> : <p></p> 
        }
      </div>
      </>
  )
}

export default IndexAdmin