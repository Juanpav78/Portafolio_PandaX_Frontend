import { Link, useLocation } from "react-router-dom";
import Nav from "./Nav";
import Logo from "/src/assets/PandaX_White.svg";

const Header = () => {
  const location = useLocation();
  return (
    <header className={` w-full p-5 bg-p_silverDark bg-opacity-90 backdrop-blur-2xl ${location.pathname === "/" ? "fixed z-10" : ""} `}>
        <div className='max-w-6xl mx-auto flex justify-between flex-col gap-2  md:flex-row items-center'>
        <Link to='/' className='flex items-center gap-2 '>
            <img className='w-20' src={Logo} alt="PandaX Logo Panda Rojo Web Developer Portafolio" />
            <h1 className='logo font-title text-p_white text-5xl'>PandaX{"/>"}</h1>
        </Link>
        <Nav />
        </div>
    </header>
  )
}

export default Header