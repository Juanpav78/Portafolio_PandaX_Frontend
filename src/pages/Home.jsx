
import Perfil from '../assets/Perfil.png'
import PerfilWeb from '../build/images/Perfil.webp'
import {Link as Scroll} from "react-scroll"
const Home = () => {
  return (
    <section className='home bg-p_silverDark min-h-screen' id='home'>
      <div className='mx-auto py-52 max-w-6xl flex gap-4 flex-col-reverse items-center  md:flex-row '>
        <div className='flex-1 flex flex-col justify-center'>
          <h2 className='text-center font-title text-p_white text-5xl md:text-left'>Hi, I’m Juan Alvarado</h2>
          <span className=' mx-auto w-72 font-text mb-2 font-bold text-3xl md:mx-0 text-transparent bg-clip-text inner-box--text '>Developer web junior</span>
          <p className='px-2 text-center text-p_white font-text text-lg md:text-left'>High-quality web development, paying attention to every detail to perfectly represent my client{"'"}s brand.</p>
        
          <div className=' my-4 flex gap-4 justify-center md:justify-start'>
            
          <Scroll className='uppercase text-p_white block w-40 text-center border-1px text-xl py-3 px-5 rounded-md cursor-pointer' smooth={true} offset={-100} duration={500} to='proyects'>Proyects</Scroll>
          <Scroll className=' uppercase text-p_white block w-40 text-center text-xl py-3 px-5 rounded-md inner-box cursor-pointer' smooth={true} offset={-100} duration={500} to='contact'>Contact</Scroll>

          </div>
        </div>
        <div className='flex-1 inner-box rounded-full w-10/12 aspect-square overflow-hidden max-w-sm md:max-w-none '>
          <picture>
          <source className='w-3/4 h-full mx-auto' srcSet={PerfilWeb} type="image/webp" />
          <img className='w-3/4 h-full mx-auto' src={Perfil} alt="Juan Alvarado PandaX Desarrollo Web Perfil" />
          
          </picture>
          
        </div>
      </div>
      
    </section>
  )
}

export default Home