import Nav from "./Nav";
import Logo from "/src/assets/PandaX_White.svg";

const Header = () => {
  return (
    <header className='fixed w-full p-5 bg-p_silverDark'>
        <div className='max-w-6xl mx-auto flex justify-between'>
        <div className='flex items-center gap-2'>
            <img className='w-20' src={Logo} alt="PandaX Logo Panda Rojo Web Developer Portafolio" />
            <h1 className='font-title text-p_white text-5xl'>PandaX{"/>"}</h1>
        </div>
        <Nav />
        </div>
    </header>
  )
}

export default Header