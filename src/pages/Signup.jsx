import { useState } from "react"
import Boton from "../components/Boton"
const Signup = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  return (
    <main className='max-w-6xl mx-auto py-20'>
        <form className='border-1px flex flex-col p-8 max-w-md  mx-auto' action="">
          
          <legend className='font-title text-4xl mb-8 text-p_white'>Registrate</legend>

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
          type="password" name="password" id="password" placeholder="min. 8 caracteres" />

          <label className=' text-p_white font-text my-2 ' htmlFor="repeat-password">Repite tu contraseña</label>
          <input className='bg-transparent border-1px p-2 text-p_white font-text '
          type="password" name="repeat-password" id="repeat-password" placeholder="min. 8 caracteres" />
          <Boton isBtn
            msg="Registrarse"
            clase='w-52'
          />
      </form>
    </main>
  )
}

export default Signup