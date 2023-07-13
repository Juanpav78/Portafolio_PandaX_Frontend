import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWhatsapp, faInstagram, faGithub, faYoutube, faLinkedin } from "@fortawesome/free-brands-svg-icons"
const Footer = () => {
  return (
    <footer className='bg-p_silverDark p-8 mt-0.5'>
      <div className='max-w-6xl mx-auto grid grid-cols-2 gap-8 justify-center'>
      <div className=''>
        <h4 className='mb-4 text-p_white text-center font-title text-3xl'>Social Networks</h4>
        <div className='flex gap-4 justify-center'>
        <FontAwesomeIcon className=' text-p_white text-4xl' icon={faWhatsapp} />
        <FontAwesomeIcon className=' text-p_white text-4xl' icon={faInstagram} />
        <FontAwesomeIcon className=' text-p_white text-4xl' icon={faLinkedin} />
        <FontAwesomeIcon className=' text-p_white text-4xl' icon={faGithub} />
        <FontAwesomeIcon className=' text-p_white text-4xl' icon={faYoutube} />
        </div>
      </div>
      <div className=''>
      <h4 className='mb-4 text-p_white text-center font-title text-3xl'>Need Help?</h4>
        <p className='text-p_white text-base font-text'>Contac whit me i n Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum, nesciunt recusandae ea qui ipsa fuga a maiores reprehenderit aperiam, repellendus ullam dolorem, molestiae assumenda accusamus ipsam iste minima veritatis cum.</p>
      </div>
      </div>

      <p className='pt-8 text-p_white text-base font-text text-center'>Copyright &copy; - Juan Alvarado-Pandax-2023</p>
    </footer>
  )
}

export default Footer