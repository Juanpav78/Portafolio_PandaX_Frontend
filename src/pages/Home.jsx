import Boton from '../components/Boton'
import Perfil from '/src/assets/perfil.png'

const Home = () => {
  return (
    <section className='home bg-p_silverDark min-h-screen' id='home'>
      <div className='mx-auto py-52 max-w-6xl flex gap-4 flex-col-reverse items-center  md:flex-row '>
        <div className='flex-1 flex flex-col justify-center'>
          <h2 className='text-center font-title text-p_white text-5xl md:text-left'>Hi, I’m Juan Alvarado</h2>
          <span className=' mx-auto w-72 font-text mb-2 font-bold text-3xl md:mx-0 text-transparent bg-clip-text inner-box--text '>Developer web junior</span>
          <p className='text-center text-p_white font-text text-lg md:text-left'>High-quality web development, paying attention to every detail to perfectly represent my client{"'"}s brand.</p>
        
          <div className=' my-4 flex gap-4 justify-center md:justify-start'>
            <Boton msg='My work' isNormal/>
            <Boton msg='Contact Me' isImportant />
          </div>
        </div>
        <div className='flex-1 inner-box rounded-full w-10/12 aspect-square overflow-hidden max-w-sm md:max-w-none '>
          <img className=' h-full mx-auto' src={Perfil} alt="" />
        </div>
      </div>
      
    </section>
  )
}

export default Home