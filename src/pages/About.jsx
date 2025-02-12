import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {faGithub, faFigma,
    faCss3Alt, faHtml5,
    faPhp, faNodeJs,
    faSquareJs, faWordpress,
    faReact, faPython, faRProject,
    faGulp, faYoutube, faInstagram, faLinkedin
    } from '@fortawesome/free-brands-svg-icons'
import { Link } from 'react-router-dom'



const skills = [
  {
    ico : faGithub,
    name : "github"
  },
  {
    ico : faFigma,
    name : "figma"
  },
  {
    ico : faHtml5,
    name : "html5"
  },
  {
    ico : faCss3Alt,
    name : "css3"
  },
  {
    ico : faPython,
    name : "Python"
  },
  {
    ico : faGulp,
    name : "Gulp.JS"
  },
  {
    ico : faPhp,
    name : "php"
  },
  {
    ico : faNodeJs,
    name : "Node.JS"
  },
  {
    ico : faSquareJs,
    name : "javascript"
  },
  {
    ico : faWordpress,
    name : "wordpress"
  },
  {
    ico :  faReact,
    name : "React.JS"
  },
  {
    ico: faRProject,
    name : "R"
  }
]

const About = () => {
  return (
    <section className='inner-box py-20  gap-4' id='about'>
      <div className='grid grid-cols-1 md:grid-cols-2 max-w-6xl mx-auto items-center gap-4'>

      <div className=' h-full flex flex-col bg-opacity-90 p-8 rounded-md bg-p_silverDark  drop-shadow-Dark '>
        <h2 className='text-3xl text-p_white mb-4 font-title text-center'>About me</h2>  
        <p className='font-text m-2 font-semibold text-justify text-p_white text-lg'>
          Hello, my name is Juan. I am a self-taught individual passionate about programming, and I am a full-stack developer specializing in the frontend area.
        </p>
        <p className='font-text m-2 font-semibold text-justify text-p_white text-lg'>
          My goal is to exceed expectations and deliver exceptional results in every project I get involved in.
        </p>
        <p className='font-text m-2 font-semibold text-justify text-p_white text-lg'>
        I am passionate about continuous learning, and I am always seeking opportunities to improve my skills and knowledge. I consider myself a creative, proactive person with a great ability to solve problems.
        </p>
        <p className='font-text m-2 font-semibold texts-justify text-p_white text-lg'>
          More about me? I am currently learning French, I enjoy doing sports, and I like to watch series.
        </p>
        <div className='flex justify-around mt-4'>
        <Link to="https://github.com/Juanpav78" target='newBlank'>
        <FontAwesomeIcon className='text-4xl md:text-5xl text-p_white hover:text-p_orange' icon={faGithub} />
        </Link>
        <Link to="https://www.instagram.com/pandaxcode/" target='newBlank'>
        <FontAwesomeIcon className='text-4xl md:text-5xl text-p_white hover:text-p_orange' icon={faInstagram} />
        </Link>
        <Link to="https://www.linkedin.com/in/juanpavpandax/" target='newBlank'>
        <FontAwesomeIcon className='text-4xl md:text-5xl text-p_white hover:text-p_orange' icon={faLinkedin} />
        </Link>
        <Link to="https://www.youtube.com/@pandaxcode9228" target='newBlank'>
        <FontAwesomeIcon className='text-4xl md:text-5xl text-p_white hover:text-p_orange' icon={faYoutube} />
        </Link>
       
        
        
        
        </div>
      
      </div>
      
      

      <div className=' h-full bg-opacity-90 p-8 rounded-md bg-p_silverDark'>
        <h2 className='text-3xl text-p_white mb-7 font-title text-center'>Skills</h2>

        <div className='grid grid-cols-4 justify-items-center gap-0 gap-y-7'>
          {skills.map(skill =>(
          <div key={skill.name} className='flex flex-col text-p_white hover:text-p_orange'>
          <FontAwesomeIcon className='text-4xl md:text-5xl' icon={skill.ico} />
          <p className=' font-text p-1'>{skill.name}</p>
          </div>
          ))}
          <div className='flex flex-col items-center text-p_white hover:text-p_orange'>
          <img className=' aspect-square w-12 grayscale hover:grayscale-0' src="https://www.vectorlogo.zone/logos/mysql/mysql-icon.svg" alt="" />
          <p className=' font-text p-1'>MySql</p>
          </div>
          <div className='flex flex-col items-center text-p_white hover:text-p_orange'>
          <img className=' aspect-square w-12 grayscale hover:grayscale-0' src="https://www.vectorlogo.zone/logos/mongodb/mongodb-icon.svg" alt="" />
          <p className=' font-text p-1'>MongoDB</p>
          </div>
        </div>
      </div>
      </div>
    </section>
  )
}

export default About