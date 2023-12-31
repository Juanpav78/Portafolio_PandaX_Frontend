import { Link, useLocation } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faUser}  from "@fortawesome/free-solid-svg-icons"
import {Link as Scroll} from "react-scroll"

const Nav = () => {
  const location = useLocation();
  return (
    <nav className='flex justify-between gap-4 items-center '>
    
      {location.pathname !== '/' ? (
        <>
        <Link className='font-title transition-colors text-p_white hover:text-p_orange cursor-pointer' to='/'>Home</Link>
        <Link className='font-title transition-colors text-p_white hover:text-p_orange cursor-pointer' to='/login'>Login</Link>
        </>
      ):(
        <>
        <Scroll className='font-title transition-colors text-p_white hover:text-p_orange cursor-pointer' smooth={true} offset={0} duration={500} to='home'>Home</Scroll>
        <Scroll className='font-title transition-colors text-p_white hover:text-p_orange cursor-pointer' smooth={true} offset={-100} duration={500} to='about'>About Me</Scroll>
        <Scroll className='font-title transition-colors text-p_white hover:text-p_orange cursor-pointer' smooth={true} offset={-100} duration={500} to='proyects'>Proyects</Scroll>
        <Scroll className='font-title transition-colors text-p_white hover:text-p_orange cursor-pointer' smooth={true} offset={-100} duration={500} to='contact'>Contact</Scroll>

        <Link to='/login'><FontAwesomeIcon  className=' text-p_white hover:text-p_orange cursor-pointer' icon={faUser} /></Link>
        </>
      )}
       
        
        
    </nav>
  )
}

export default Nav