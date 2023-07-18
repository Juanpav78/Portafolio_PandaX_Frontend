import {  useEffect, useState } from "react"
import Boton from "./Boton"
import Alert from "./Alert"
import useProyectos from "../hooks/useProyectos"
import { useParams } from "react-router-dom"
const Formulario = () => {
  const [id, setId] = useState(null);
  const [nombre, setNombre] = useState("")
  const [link, setLink] = useState("")
  const [github, setGithub] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [tipo, setTipo] = useState("")
  const [tecnologias, setTecnologias] = useState("")
  const [imagen, setImagen] = useState()
  const {submitProyecto, proyecto} = useProyectos();

  const [alerta, setAlerta] = useState({})
  const params = useParams();
  useEffect(()=>{
    if(params.id){
      setId(proyecto._id)
      setNombre(proyecto.nombre) 
      setLink(proyecto.link) 
      setGithub(proyecto.github)  
      setDescripcion(proyecto.descripcion) 
      setTipo(proyecto.tipo) 
      setTecnologias(proyecto.tecnologias) 
    }
  },[params])
  const handleSubmit = async (e) =>{
    e.preventDefault()

    if([nombre,link,github,descripcion,tipo,tecnologias].includes("")){
      setAlerta({
        msg: "Todos los campos son obligatorios",
        error: true
      })
      setTimeout(()=>{  //se elimina la alerta despues de 5s
        setAlerta({})
      }, 5000)
      return
    }
    if(!params.id && imagen){
      const medida =2000 * 1000;
      if (imagen.size > medida){
        setAlerta({
          msg: "Tla imagen es muy grande",
          error: true
        })
        setTimeout(()=>{  //se elimina la alerta despues de 5s
          setAlerta({})
        }, 5000)
        return
      }
    }
   

    await submitProyecto({id, nombre,link,github,descripcion,tipo,tecnologias, imagen})
    setId(null)
    setNombre('') 
    setLink('') 
    setGithub('')  
    setDescripcion('') 
    setTipo('') 
    setTecnologias('') 
  
  }

  const uploadImg = files =>{
    setImagen(files)
  }

  return (
    <>
    {alerta.msg && ( //se muestra de manera condicional la alerta
          <Alert 
            isError ={alerta.error}
            msg={alerta.msg}
          />
        )}
    <form 
        className='border-1px flex flex-col p-8 w-full lg:max-w-1/2'
        onSubmit={handleSubmit}
        
        >
          
          <legend className='font-title text-4xl mb-8 text-p_white'>Nuevo Proyecto</legend>

          <label className=' text-p_white font-text my-2 '
          htmlFor="nombre"
          >Nombre</label>
          <input className='bg-transparent border-1px p-2 text-p_white font-text '
          type="text"
          name="nombre" id="nombre"
          placeholder="Tu Nombre"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          />

          <label className=' text-p_white font-text my-2 '
          htmlFor="tipo"
          >Tipo</label>
          <input className='bg-transparent border-1px p-2 text-p_white font-text '
          type="text"
          name="tipo" id="tipo"
          placeholder="Clon, diseño, web, etc..."
          value={tipo}
          onChange={e => setTipo(e.target.value)}
          />

          <label className=' text-p_white font-text my-2 '
          htmlFor="link"
          >Link</label>
          <input className='bg-transparent border-1px p-2 text-p_white font-text '
          type="text"
          name="link" id="link"
          placeholder="https://www.paginadeejemplo.com"
          value={link}
          onChange={e => setLink(e.target.value)}
          />

          <label className=' text-p_white font-text my-2 '
          htmlFor="github"
          >Github</label>
          <input className='bg-transparent border-1px p-2 text-p_white font-text '
          type="text"
          name="github" id="github"
          placeholder="Repositorio del Github"
          value={github}
          onChange={e => setGithub(e.target.value)}
          />

          <label className=' text-p_white font-text my-2 '
          htmlFor="tecnologias"
          >Tecnologias</label>
          <input className='bg-transparent border-1px p-2 text-p_white font-text '
          type="text"
          name="tecnologias" id="tecnologias"
          placeholder="Tecnologias usadas separas por una coma"
          value={tecnologias}
          onChange={e => setTecnologias(e.target.value)}
          />

          <label className=' text-p_white font-text my-2 '
          htmlFor="imagen"
          >Imagen png/jpg</label>
          <input type="file" name="imagen" id="imagen" 
          accept="image/jpeg, image/png"
          onChange={e => uploadImg(e.target.files[0])}
          />

          <label className=' text-p_white font-text my-2 '
          htmlFor="descripcion"
          >Descripcion</label>
          <textarea
           className='text-p_white font-text my-2 bg-p_silver border-1px p-4 '
           name="descripcion" id="descripcion"
           cols="30" rows="10"
           value={descripcion}
           onChange={e => setDescripcion(e.target.value)}
           >

          </textarea>

          <Boton isBtn
            msg="Registrarse"
            clase='w-52'
          />
      </form>
    </>
    
  )
}

export default Formulario