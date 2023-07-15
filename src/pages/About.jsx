import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {faGithub, faFigma,
    faCss3Alt, faHtml5,
    faPhp, faNodeJs,
    faSquareJs, faWordpress,
    faReact, faSass, faNpm,
    faGulp, 
    faWhatsapp, faYoutube, faInstagram
    } from '@fortawesome/free-brands-svg-icons'

const About = () => {
  return (
    <section className='inner-box py-20  gap-4' id='about'>
      <div className='grid grid-cols-1 md:grid-cols-2 max-w-6xl mx-auto items-center gap-4'>

      <div className=' h-full flex flex-col bg-opacity-90 p-8 rounded-md bg-p_silverDark  drop-shadow-Dark '>
        <h2 className='text-3xl text-p_white mb-4 font-title text-center'>About me</h2>  
        <p className='font-text m-2 font-semibold text-justify text-p_white text-lg'>Hola, me llamo Juan, soy autodidacta y me apasiona la programación.</p>
        <p className='font-text m-2 font-semibold text-justify text-p_white text-lg'>Mi objetivo es superar las expectativas y proporcionar resultados excepcionales en cada proyecto en el que me involucro.</p>
        <p className='font-text m-2 font-semibold text-justify text-p_white text-lg'>Mi objetivo es superar las expectativas y proporcionar resultados excepcionales en cada proyecto en el que me involucro.</p>
        <div className='flex justify-around mt-4'>
        <FontAwesomeIcon className='text-4xl md:text-5xl text-p_white' icon={faGithub} />
        <FontAwesomeIcon className='text-4xl md:text-5xl text-p_white' icon={faInstagram} />
        <FontAwesomeIcon className='text-4xl md:text-5xl text-p_white' icon={faWhatsapp} />
        <FontAwesomeIcon className='text-4xl md:text-5xl text-p_white' icon={faYoutube} />
        </div>
      
      </div>
      
      

      <div className=' h-full bg-opacity-90 p-8 rounded-md bg-p_silverDark'>
        <h2 className='text-3xl text-p_white mb-7 font-title text-center'>Skills</h2>

        <div className='grid grid-cols-4 justify-items-center gap-0 gap-y-7'>
        <FontAwesomeIcon className='text-4xl md:text-5xl text-p_white' icon={faGithub} />
        <FontAwesomeIcon className='text-4xl md:text-5xl text-p_white' icon={faFigma} />
        <FontAwesomeIcon className='text-4xl md:text-5xl text-p_white' icon={faCss3Alt} />
        <FontAwesomeIcon className='text-4xl md:text-5xl text-p_white' icon={faHtml5} />
        <FontAwesomeIcon className='text-4xl md:text-5xl text-p_white' icon={faPhp} />
        <FontAwesomeIcon className='text-4xl md:text-5xl text-p_white' icon={faNodeJs} />
        <FontAwesomeIcon className='text-4xl md:text-5xl text-p_white' icon={faSquareJs} />
        <FontAwesomeIcon className='text-4xl md:text-5xl text-p_white' icon={faWordpress} />
        <FontAwesomeIcon className='text-4xl md:text-5xl text-p_white' icon={faReact} />
        <FontAwesomeIcon className='text-4xl md:text-5xl text-p_white' icon={faSass} />
        <FontAwesomeIcon className='text-4xl md:text-5xl text-p_white' icon={faNpm} />
        <FontAwesomeIcon className='text-4xl md:text-5xl text-p_white' icon={faGulp} />
        <FontAwesomeIcon className='text-4xl md:text-5xl text-p_white' icon={faWordpress} />
        <FontAwesomeIcon className='text-4xl md:text-5xl text-p_white' icon={faReact} />
        <FontAwesomeIcon className='text-4xl md:text-5xl text-p_white' icon={faSass} />
        <FontAwesomeIcon className='text-4xl md:text-5xl text-p_white' icon={faNpm} />
        </div>
      </div>
      </div>
    </section>
  )
}

export default About