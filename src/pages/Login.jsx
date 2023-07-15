import { Link } from "react-router-dom"
import Boton from "../components/Boton"

const Login = () => {
  return (
    <main className='max-w-6xl mx-auto py-20'>
        <form className='border-1px flex flex-col p-8 max-w-md  mx-auto' action="">
          
          <legend className='font-title text-4xl mb-8 text-p_white'>Iniciar Sesion</legend>

          <label className=' text-p_white font-text my-2 '
          htmlFor="email"
          >Email</label>
          <input className='bg-transparent border-1px p-2 text-p_white font-text '
          type="email"
          name="email" id="email"
          placeholder="Email"
          />

          <label className=' text-p_white font-text my-2 ' htmlFor="password">Contraseña</label>
          <input className='bg-transparent border-1px p-2 text-p_white font-text '
          type="password" name="password" id="password" />

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