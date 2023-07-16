import { useState } from "react"
import Boton from "../components/Boton"
import Alert from "../components/Alert";
import axios from "axios";
const Signup = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [alerta , setAlerta] = useState({})

  //TODO: REALIZAR UN STATE PARA MOSTRAR UN ENLACE AL LOGIN

  const handleSubmit = async e =>{
    e.preventDefault();


    /*Validacion del formulario y creacion de la alerta*/

    if([nombre, email,password,repeatPassword].includes("")){
      setAlerta({msg : "Todos los campos son obligatorios",
    error : true
    })
      setTimeout(()=>{  //se elimina la alerta despues de 5s
        setAlerta({})
      }, 5000)

      return;
      
    }
    if(password.length < 8){
      setAlerta({msg : "Las contraseña debe ser de minimo 8 caracteres"})
      setTimeout(()=>{  //se elimina la alerta despues de 5s
        setAlerta({})
      }, 5000)
      return;
    }
  

    if(password !== repeatPassword){
      setAlerta({msg : "Las contraseñas no coinciden",
      error : true
    })
      setTimeout(()=>{  //se elimina la alerta despues de 5s
        setAlerta({})
      }, 5000)
      return;
    }


    /*Registro del usuario desde la API*/

    try {
      const {data} = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/usuarios`,
      {nombre,email,password}

      )
      setAlerta({msg :data.msg, //cuenta registrada
      error : false
      })
      setTimeout(()=>{  //se elimina la alerta despues de 5s
        setAlerta({})
      }, 5000)

      setNombre('')
      setEmail('')
      setPassword('')
      setRepeatPassword('')

    } catch (error) {
      console.log(error)
      setAlerta({msg : error.response.data.msg, //error
        error : true
        })
      setTimeout(()=>{  //se elimina la alerta despues de 5s
          setAlerta({})
      }, 5000)
    }
  }


  return (
    <main className='max-w-6xl mx-auto py-20'>
        {alerta.msg && ( //se muestra de manera condicional la alerta
          <Alert 
            isError ={alerta.error}
            msg={alerta.msg}
          />
        )}
        <form 
        className='border-1px flex flex-col p-8 max-w-md  mx-auto'
        onSubmit={handleSubmit}
        >
          
          <legend className='font-title text-4xl mb-8 text-p_white'>Registrate</legend>

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
          htmlFor="email"
          >Email</label>
          <input className='bg-transparent border-1px p-2 text-p_white font-text '
          type="email"
          name="email" id="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          />

          <label className=' text-p_white font-text my-2 ' htmlFor="password">Contraseña</label>
          <input className='bg-transparent border-1px p-2 text-p_white font-text '
          type="password" name="password" id="password" placeholder="min. 8 caracteres" 
          value={password}
          onChange={e => setPassword(e.target.value)}
          />

          <label className=' text-p_white font-text my-2 ' htmlFor="repeat-password">Repite tu contraseña</label>
          <input className='bg-transparent border-1px p-2 text-p_white font-text '
          type="password" name="repeat-password" id="repeat-password" placeholder="min. 8 caracteres"
          value={repeatPassword}
          onChange={e => setRepeatPassword(e.target.value)}
          />
          <Boton isBtn
            msg="Registrarse"
            clase='w-52'
          />
      </form>
    </main>
  )
}

export default Signup