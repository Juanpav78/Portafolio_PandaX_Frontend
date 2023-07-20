import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWhatsapp, faInstagram, faGithub, faYoutube, faLinkedin } from "@fortawesome/free-brands-svg-icons"
import { Link } from "react-router-dom"
const Footer = () => {
  return (
    <footer className='bg-p_silverDark p-8 mt-0.5'>
      <div className='max-w-6xl mx-auto grid grid-cols-1 gap-8 justify-center md:grid-cols-2'>
      <div className=''>
        <h4 className='mb-4 text-p_white text-center font-title text-3xl'>Social Networks</h4>
        <div className='flex gap-4 justify-center'>
        <Link to="https://github.com/Juanpav78" target='newBlank'>
        <FontAwesomeIcon className='text-4xl md:text-4xl text-p_white hover:text-p_orange' icon={faGithub} />
        </Link>
        <Link to="https://www.instagram.com/pandaxcode/" target='newBlank'>
        <FontAwesomeIcon className='text-4xl md:text-4xl text-p_white hover:text-p_orange' icon={faInstagram} />
        </Link>
        <Link to="https://www.linkedin.com/in/juanpavpandax/" target='newBlank'>
        <FontAwesomeIcon className='text-4xl md:text-4xl text-p_white hover:text-p_orange' icon={faLinkedin} />
        </Link>
        <Link to="https://www.youtube.com/@pandaxcode9228" target='newBlank'>
        <FontAwesomeIcon className='text-4xl md:text-4xl text-p_white hover:text-p_orange' icon={faYoutube} />
        </Link>
        <Link to="https://wa.me/573224081829" target='newBlank'>
        <FontAwesomeIcon className='text-4xl md:text-4xl text-p_white hover:text-p_orange' icon={faWhatsapp} />
        </Link>
        </div>
      </div>
      <div className=''>
      <h4 className='mb-4 text-p_white text-center font-title text-3xl'>Need Help?</h4>
        <p className='text-p_white text-base font-text'>If you need help, contact me on my social media, which are listed above.</p>
      </div>
      </div>

      <p className='pt-8 text-p_white text-base font-text text-center'>Copyright &copy; - Juan Alvarado-Pandax-2023</p>
    </footer>
  )
}

export default Footer