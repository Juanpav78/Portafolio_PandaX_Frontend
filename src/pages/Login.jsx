import { Link } from "react-router-dom"
import Boton from "../components/Boton"
import Alert from "../components/Alert"
import clientAxios from "../config/clientAxios"
import { useState } from "react"
import useAuth from "../hooks/useAuth"
import { useNavigate } from "react-router-dom"

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alerta, setAlerta] = useState({})

  const {setAuth} = useAuth();
  const navigate = useNavigate()

  const handleSubmit = async (e) =>{
    e.preventDefault();
    if([email,password].includes("")){
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


    try {
      const {data} = await clientAxios.post('/usuarios/login', {email, password})
      localStorage.setItem('token', data.token)
      setAuth(data)
      navigate("/admin");

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
        <form className='border-1px flex flex-col p-8 max-w-md  mx-auto'
        onSubmit={handleSubmit}
        >
          
          <legend className='font-title text-4xl mb-8 text-p_white'>Iniciar Sesion</legend>

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

          <Link to='/recover-password' className='text-p_silver font-text my-2 text-right' >¿Olvidaste tu contraseña?</Link>
          <Boton isBtn
            msg="Iniciar Sesion"
            clase='w-52'
          />
      </form>
    </main>
  )
}

export default Login