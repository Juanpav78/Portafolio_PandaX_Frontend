import { Link } from "react-router-dom"
import Logo from "/src/assets/PandaX_White.svg";
import Boton from "./Boton";
import useProyectos from "../hooks/useProyectos";
import useAuth from "../hooks/useAuth";
const HeaderAdmin = () => {

    const {cerrarSesionAuth} = useAuth()
    const {cerrarSesionProyectos} = useProyectos()
    const handleClick = e =>{
        e.preventDefault()
        cerrarSesionAuth()
        cerrarSesionProyectos()
        localStorage.removeItem('token')

    }
  return (
    <header className='px-4 py-5'>
        <div className='md:flex md:justify-between md:items-center'>
            <Link to='/' className='flex items-center gap-2 '>
                <img className='w-20' src={Logo} alt="PandaX Logo Panda Rojo Web Developer Portafolio" />
                <h1 className='font-title text-p_white text-5xl hover:bg-p_dark'>PandaX{"/>"}</h1>
            </Link>

            <input type="search"
                placeholder="Buscar Proyecto"
                className='rounded-lg lg:w-96 block p-2 h-14 border'
            />

            <div className='flex items-center gap-4'>
                <Link to='/admin'
                    className='font-bold uppercase font-text text-p_white'
                >Proyectos</Link>

                <Boton
                isBtn
                msg="cerrar sesion"
                clase="w-56"
                click={handleClick}
                />
            </div>


        </div>

    </header>
  )
}

export default HeaderAdmin