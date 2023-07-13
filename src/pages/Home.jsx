import Boton from '../components/Boton'
import Perfil from '/src/assets/perfil.png'

const Home = () => {
  return (
    <section className='home bg-p_silverDark min-h-screen' >
      <div className='mx-auto py-52 max-w-6xl flex gap-4'>
        <div className='flex-1 flex flex-col justify-center'>
          <h2 className='font-title text-p_white text-5xl'>Hi, I’m Juan Alvarado</h2>
          <span className=' w-72 font-text mb-2 font-bold text-3xl text-transparent bg-clip-text inner-box--text '>Developer web junior</span>
          <p className='text-p_white font-text text-lg'>High-quality web development, paying attention to every detail to perfectly represent my client{"'"}s brand.</p>
        
          <div className=' my-4 flex gap-4 justify-start'>
            <Boton msg='My work' isNormal/>
            <Boton msg='Contact Me' isImportant />
          </div>
        </div>
        <div className='flex-1 inner-box rounded-full aspect-square overflow-hidden'>
          <img className=' h-full mx-auto' src={Perfil} alt="" />
        </div>
      </div>
      
    </section>
  )
}

export default Home