import Boton from "../components/Boton"
const Signup = () => {
  return (
    <main className='max-w-6xl mx-auto pt-44 pb-20'>
        <form className='border-1px flex flex-col p-8 max-w-md  mx-auto' action="">
          
          <legend className='font-title text-4xl mb-8 text-p_white'>Registrate</legend>

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
          type="password" name="password" id="password" placeholder="min. 8 caracteres" />

          <label className=' text-p_white font-text my-2 ' htmlFor="password">Repite tu contraseña</label>
          <input className='bg-transparent border-1px p-2 text-p_white font-text '
          type="password" name="password" id="password" placeholder="min. 8 caracteres" />
          <Boton isBtn
            msg="Registrarse"
            clase='w-52'
          />
      </form>
    </main>
  )
}

export default Signup