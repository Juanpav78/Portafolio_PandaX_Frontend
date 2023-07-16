import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const Sidebar = () => {

  const {auth} = useAuth();
  return (
    <aside className='md:w-80 lg:w-96 px-5 py-10 border-r-2 border-p_orangeDark'>
      <p className='text-2xl font-title font-bold text-p_white mb-8'>
        Hola: {auth.nombre}
      </p>

      <Link
      to="create"
      className=' bg-p_cake w-full p-3 text-center text-p_white block
      font-text font-bold rounded-md text-xl
      '>
        Nuevo Proyecto
      </Link>
    </aside>
  )
}

export default Sidebar