import { Link } from "react-router-dom"


const Nav = () => {
  return (
    <nav className='flex justify-between gap-2 items-center'>
        <Link className='font-title text-p_white' to='/'>Home</Link>
        <Link className='font-title text-p_white' to='/'>About Me</Link>
        <Link className='font-title text-p_white' to='/'>Proyects</Link>
        <Link className='font-title text-p_white' to='/'>Contact</Link>
        <Link className='font-title text-p_white' to='/'>Login</Link>
    </nav>
  )
}

export default Nav